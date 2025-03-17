import User from '../models/userModel.js'
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from '../utils/helper/generateTokenAndSetCookie.js';


//User Sign up 
const signupUser = async(req,res)=>{
    try{
    const {name,username,email,password} = req.body ; 

    
    const user = await User.findOne({
        $or : [
            {
                email
            },
            {
                username
            }
        ]
    }
    )
    //If user already exist 
    if(user) {
        return res.status(400).json({message:"User already exist"})
    }

    //Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(password,salt);

    //New user
    const newUser = new User({
        name,
        username,
        email,
        password: hashedPasword
    })
    //Save new user
    await newUser.save();
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        res.status(201).json({
            _id : newUser._id ,
            name : newUser.name ,
            email : newUser.email ,
            username : newUser.username,

        })
    } else{
        res.status(400).json({message:"Invalid user data"})
    }

    }
    catch(err){
            res.status(500).json({message:err.message})
    }
}

//User login
const loginUser = async(req,res)=>{
    try{
       const {username,password} = req.body ;
       const user = await User.findOne({username})
       const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")
       if( !user || !isPasswordCorrect) return res.status(400).json({message:"Invalid username or password"})
      generateTokenAndSetCookie(user._id,res)
      res.status(200).json({
        _id : user._id ,
        name : user.name ,
        email : user.email ,
        username : user.username,
    }
)
}
    catch(err){
       res.status(500).json({message:err.message})
    }
}

//Logout user
const logoutUser = async(req,res)=>{
    try{
     res.cookie("jwt","",{maxAge:1})
     res.status(200).json({message:"User logged out successfully"})
    }
    catch(err){
        res.status(500).json({message:err.message})
     }
}
const followUnfollowUser = async(req,res)=>{
    try{ 
      const {id} = req.params ;
      const userToModify = await User.findById(id);
      const currentUser = await User.findById(req.user._id)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
export {signupUser , loginUser,logoutUser, followUnfollowUser} ;