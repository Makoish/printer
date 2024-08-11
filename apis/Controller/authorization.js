const bcrypt = require('bcrypt');
const User = require("../Models/user.model.js")
const jwt = require("jsonwebtoken")






exports.Login = async (req, res) => {
    try {
        
        const phoneNO = req.body.phoneNO;
        const password = req.body.password;

        const user = await User.findOne({"phoneNO": phoneNO})

        if (!user)
            throw new Error("user doesn't exist");


        const hashedPassword = user.password;
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match)
            throw new Error("Incorrect password");

        
        const token = jwt.sign({
            id: user._id,
            exp: Math.floor(Date.now() / 1000) + 86400
        }, process.env.tokenSecret);
          

    

        return res.status(200).json({"token": token});
        

    } catch(err){
        res.status(400).json({"message": err.message});
    }
  
};