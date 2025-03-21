import User from "../models/userModel.js";
import Post from "../models/postModel.js" ;
import {v2 as cloudinary} from 'cloudinary';
// Create a new post
const createPost = async (req, res) => {
    try {
        const { postedBy, text } = req.body;
        let {img} = req.body ;
        // Check required fields
        if (!postedBy || !text) {
            return res.status(400).json({ message: "PostedBy and text fields are required" });
        }

        // Validate user existence
        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure user is authorized to create a post
        if (!user._id.equals(req.user._id)) {
            return res.status(403).json({ message: "You are not authorized to create a post" });
        }
        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url ;
        }

        // Check text length
        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ message: `Text should not exceed ${maxLength} characters` });
        }

        // Create and save post
        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        // Send response
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Get post
const getPost = async(req,res)=>{
    try{
       const post = await Post.findById(req.params.id);
       if(!post) return res.status(404).json({message:"Post not found"}) ;
       res.status(200).json(post) ;
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

//Delete post
const deletePost = async(req,res)=>{
    try{
       const post = await Post.findById(req.params.id);
       if(!post) return res.status(404).json({message:"Post not found"}) ;

       if(post.postedBy.toString()!== req.user._id.toString()){
        return res.status(404).json({message:"Unauthorized to delete"})
       }

       await Post.findByIdAndDelete(req.params.id); 
       res.status(200).json({message:"Post deleted successfully"}) ;
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
    console.log(req.user._id);
}


//Like or Unlike post
const likeUnlikePost = async(req,res)=>{
    try{
         const {postId} = req.params ;
         const userId = req.user._id ;
         const post = await Post.findById(postId);
         if(!post){
            return res.status(404).json({message:"Post not found"}) ;
         }
         const userLikedPost = post.likes.includes(userId);
         if(userLikedPost){
            //Unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}}) ;
            res.status(200).json({message:"Post unliked"}) ;
         }
         else{
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message:"Post liked"}) ;
         }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
} 

//Reply to post

const replyToPost = async (req, res) => {
    try {
      const { text } = req.body;
      const postId = req.params.postId;
      const userId = req.user._id;
      const post = await Post.findById(postId);
      const userProfilePic = req.user.profilePic; 
      const username = req.user.username; 
  
      if (!text) {
        return res.status(400).json({ message: "Reply text is required" });
      }
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const reply = { userId, text, userProfilePic, username };
      post.replies.push(reply);
      await post.save();
      res.status(200).json({ message: "Reply added successfully", reply });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

//Get feed posts
const getFeedPosts = async(req,res)=>{
    try{
        const userId = req.user._id ;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"}) ;
        }
        const following = user.following;
        const feedPosts = await Post.find({postedBy : {$in:following}})
        .sort({createdAt: -1 })
        res.status(200).json(feedPosts) ;
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}

const getUserPosts = async(req,res)=>{
    const {username} = req.params ;
    try{
       const user = await User.findOne({username});
       if(!user){
            return res.status(404).json({error:"User not found"}) ;
       }
       const posts = await Post.find({postedBy:user._id}).sort({createdAt: -1 });
       res.status(200).json(posts) ;
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}

// Delete a reply
const deleteReply = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user._id;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const reply = post.replies.find((r) => r._id.toString() === commentId);
      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }
  
      if (reply.userId.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized to delete this reply" });
      }
  
      post.replies = post.replies.filter((r) => r._id.toString() !== commentId);
      await post.save();
  
      res.status(200).json({ message: "Reply deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
export {createPost,getPost,deletePost,likeUnlikePost, replyToPost, getFeedPosts,getUserPosts ,deleteReply} ;