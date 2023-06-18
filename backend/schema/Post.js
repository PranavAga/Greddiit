import mongoose, { Schema } from 'mongoose';
const PostSchema=new Schema({
    creator:{
        type: Schema.Types.ObjectId,
        ref: "User Details",
        required: true
    },
    sg:{
        type: Schema.Types.ObjectId,
        ref: "Subgreddiit",
        required: true
    },
    title :{
        type: String
    },
    content :{
        type: String
    },
    up_votes :{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "User Details"
        }],
        default:[]
    },
    down_votes :{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "User Details"
        }],
        default:[]
    }
})

const Post=mongoose.model("Post",PostSchema);
export default Post;