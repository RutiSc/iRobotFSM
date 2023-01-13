import React, { useState, useEffect, useRef } from 'react';
import { createMachine, interpret } from 'xstate';
import { useMachine } from '@xstate/react';
import "./iRobotFSM.scss";
import { getRoomDetails } from '../../services/roomService'
import Directions from '../../enums/directions';

var whereTurn = Directions.left;
var flagTimer = false;
var positionLeft = 0;
var positionTop = 100;
var countDrive = 0;
var rotate = 0;

const iRobot = createMachine({
    id: 'robot',
    initial: 'standby',
    states: {
        standby: {
            on: {
                CLICK: { target: 'drive' }
            }
        },
        drive: {
            entry: () => {
                flagTimer = !flagTimer;
            },
            on: {
                DRIVE_TIMER: [{
                    target: 'right',
                    cond: () => whereTurn == Directions.right,
                },
                {
                    target: 'left',
                }
                ],
                TURN_TIMER: [{
                    target: 'right',
                    cond: () => whereTurn == Directions.right,
                },
                {
                    target: 'left'
                }]
            }
        },
        right: {
            on: {
                TURN: {
                    target: 'drive',
                },
                END: {
                    target: 'end'
                }
            }
        },
        left: {
            on: {
                TURN: {
                    target: 'drive'
                },
                END: {
                    target: 'end'
                }
            }
        },
        end: {
            type: 'final'
        }
    },
    actions: {
        startTimer: () => {
            flagTimer = !flagTimer;
        }
    }
});


export default function IRobot() {

    const [state, send] = useMachine(iRobot);
    const [roomWidth, setRoomWidth] = useState();

    const robotImg = useRef(null);
    const room = useRef(null);

    const robot = interpret(iRobot).onTransition((state) =>
        console.log(state.value)
    );

    robot.start();

    useEffect(() => {
        getRoomDetails()
            .then((res) => {
                setRoomWidth(res.data.roomWidth);
                room.current.style.width = res.data.roomWidth + 'px';
                room.current.style.height = res.data.roomHeight + 'px';
            })
            .catch((err) => {
                console.log(err.message);
            })
    }, []);

    function moveRobot(direction) {
        if (direction == Directions.top) {
            robotImg.current.style.top = positionTop + 'px';
            positionTop = positionTop + 100;
        }
        else {
            direction == Directions.right ? positionLeft = positionLeft + 100 : positionLeft = positionLeft - 100;
            robotImg.current.style.left = positionLeft + 'px';
        }
    }

    function turnRobot() {
        whereTurn == Directions.right ? rotate = rotate + 90 : rotate = rotate - 90;
        robotImg.current.style.transform = 'rotate(' + rotate + 'deg)'
    }

    useEffect(() => {
        if (state.matches('drive')) {
            if (flagTimer) {
                countDrive++;
                whereTurn == Directions.right ? whereTurn = Directions.left : whereTurn = Directions.right;
                moveRobot(whereTurn);
                var myInterval = setInterval(() => {
                    moveRobot(whereTurn);
                }, 1100)

                setTimeout(() => {
                    clearInterval(myInterval);
                    send('DRIVE_TIMER')
                }, 3000);
            }
            else {
                setTimeout(() => { send('TURN_TIMER') }, 1000);
                moveRobot(Directions.top);
            }
        }
        if (state.matches('right') || state.matches('left')) {
            countDrive == roomWidth / 100 ? send('END') : setTimeout(() => { send('TURN') }, 1000);
            turnRobot(state.value);
        }
    }, [state]);

    //A solution to the problem of events listening in webpack
    window.clickStart = function () {
        send('CLICK');
    }

    return (
        <div className='body'>
            <div>
                <img className='logoIRobot' src="logoIRobot.png"></img>
                <div id="clockDisplay" className="clockDesign" dir="ltr">{state.value}</div>                

                <div ref={room} className='room'>
                    <img ref={robotImg} className='robot' src="iRobot.png"></img>
                </div>

                <button className='btnStart' onClick={clickStart}> start</button>

            </div>
        </div>
    )
}
