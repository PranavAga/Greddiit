import mongoose, { Schema } from 'mongoose';
import SG from './Sg.js';
const PostSchema=new Schema({
    sg:{
        type: Schema.Types.ObjectId,
        ref: "Subgreddiit"
    }
})

const Post=mongoose.model("Post",PostSchema);
export default Post;