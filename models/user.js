const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        
    },
   country:{
    type: String,
    required: true,
    
   },
   tasks:[
    {
    type : mongoose.Types.ObjectId,
    ref: "task",
   },
   ],
});
module.exports = mongoose.model("user", userSchema);
