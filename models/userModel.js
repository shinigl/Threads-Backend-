import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    profilePic: {
        type: String,
        default: "", // Default profile pic will be empty
    },
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",  // Reference to User model
        default: [],  // Default value as an empty array
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",  // Reference to User model
        default: [],  // Default value as an empty array
    },
    bio: {
        type: String,
        default: "",
    }
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
