var express = require("express");
var router = express.Router();

const roomDetails = {
	roomHeight: "400",
    roomWidth: "400",
};

router.get("/",function(req,res,next){
    res.json(roomDetails);
});

module.exports=router;