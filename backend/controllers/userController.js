import User from '../models/userModel.js'
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from '../utils/helper/generateTokenAndSetCookie.js';


//See/Get profile 
const getUserProfile =async(req,res)=>{
    const {username} = req.params ;
    console.log(req.params);
    console.log(username);
    try{
      const user = await User.findOne({username}).select("-password -updatedAt")

      if(!user) return res.status(404).json({message:"Profile not available"})
      res.status(201).json(user)
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

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
    const hashedPassword = await bcrypt.hash(password,salt);

    //New user
    const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword
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

      if (id === req.user._id.toString())
        return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

      if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const updateUser = async(req,res)=>{
    
    const{name,email,username,password,profilePic,bio} = req.body ;
    const userId = req.user._id ;
    try{
        let user = await User.findById(userId);
        if(!user) return res.status(400).json({message:"user not found"});
        
        if(req.params.id !== userId.toString()){
            return res.status(400).json({message:"You can't update other user's profile"})
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt)
        user.password = hashedPassword ;
        }
       
        user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

        user = await user.save();
        res.status(200).json({message:"User profile updated successfully"})
    }
    catch(err){
        res.status(500).json({message:err.message})
     }
}
export {signupUser , loginUser,logoutUser, followUnfollowUser,updateUser ,getUserProfile} ;