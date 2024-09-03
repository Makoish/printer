const jwt = require("jsonwebtoken");
const User = require("../Models/user.model.js");

exports.userAuth = async (req, res, next) => {

    try{

    const token = req.headers.authorization.split(" ")[1]

    if (!token)
        throw new Error("Unauthorized");
    

    const decoded_token = jwt.verify(token, process.env.tokenSecret)

    const id = decoded_token.id

    const user = await User.findById(id);

    if (!user)
        throw new Error("User doesn't exist");


    if (Date.now() >= decoded_token.exp * 1000) 
        throw new Error("Token expired");


    res.locals.id = decoded_token.id; // pass the userID to the next function/middleware
    
    

    

    }
    catch(err){
        next(err)   
    }
    
};



exports.adminAuth = async (req, res, next) => {


    try{

    const token = req.headers.authorization.split(" ")[1]

    if (!token){
        throw new Error("Unauthorized");
    }

    const decoded_token = jwt.verify(token, process.env.tokenSecret)

    const id = decoded_token.id
   
    const user = await User.findById(id);

    if (user.isAdmin === false){
        throw new Error("Unauthorized");
    }
    
    if (!user)
        throw new Error("User doesn't exist");


    if (Date.now() >= decoded_token.exp * 1000) 
        {throw new Error("Token expired");}


    res.locals.id = decoded_token.id; // pass the userID to the next function/middleware
    next();

    

    }
    catch(err){
        res.status(400).json({"message": err.message});
    }
    
};



exports.staffAuth = async (req, res, next) => {


    try{

    const token = req.headers.authorization.split(" ")[1]

    if (!token){
        throw new Error("Unauthorized");
    }

    const decoded_token = jwt.verify(token, process.env.tokenSecret)

    const id = decoded_token.id

    const user = await User.findById(id);
    


    if (user.isAdmin === false && user.isStaff === false){
        throw new Error("Unauthorized");
    }
    
    if (!user)
        throw new Error("User doesn't exist");


    if (Date.now() >= decoded_token.exp * 1000) 
        {throw new Error("Token expired");}


    res.locals.id = decoded_token.id; // pass the userID to the next function/middleware
    next();

    

    }
    catch(err){
        res.status(400).json({"message": err.message});
    }
    
};