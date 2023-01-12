import axiox from "axios";

export const getRoomDetails = () => {
    return axiox.get(`http://localhost:9000/roomDetails`);
};