const router = require("express").Router(); // ✅ correct
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");

//SIGN IN APIs
router.post("/sign-in", async(req, res) => {
 try {
    const  { username } = req.body;
    const {email} = req.body;
   const existingUser = await User.findOne({username: username});
   const existingEmail = await User.findOne({email: email});
   if(existingUser){
    return res.status(400).json({message: "Username already exists"});
   } else if (username.length < 4)
   {
    return res
    .status(400)
    .json({message: "Username Should have atleast 4 characters"});
   }
   if(existingEmail){
    return res.status(400).json({message: "Email already exists"});
   }
   const hashPass = await bcrypt.hash(req.body.password, 10);
   const newUser = new User ({
    username: req.body.username,
     email: req.body.email,
     password: hashPass, 
     country: req.body.country,
    });

     await newUser.save();
     return res.status(200).json({message: "signIn successfully"});
 } catch (error){
    console.log(error);
  res.status(400).json({message: "Internal Server Error"});
 }
});

// Login APIs
router.post("/log-in", async (req, res) => {
    const { username, password} = req.body;
    const exisitingUser = await User.findOne({ username: username });
    if (!exisitingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
                  
    }
    bcrypt.compare(password, exisitingUser.password, (err,data) => {
        if(data)
        {
          const authClaims= [{name: username},{jti: jwt.sign({}, "tcmTM" )}] ; 
          const token =  jwt.sign({authClaims}, "tcmTM", {expiresIn: "2d" });
          res.status(200).json({id: exisitingUser._id, token: token});
        } else {
            return res.status(400).json({ message: "Invalid Credentials" });
            
            
        }
    });

});
module.exports = router;