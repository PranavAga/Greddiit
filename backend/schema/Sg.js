import mongoose, { Schema } from 'mongoose';
import User from './User.js';
import Post from './Post.js';

const SGSchema=new mongoose.Schema({
    mod:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    followers:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: User
        }],
        default:[],
        validate: [isNotempty, '{PATH} is empty array']
    },
    name:{
        type: String,
        required: true,
    },
    desc:{
        type: String
    },
    tags:{
        type: [{
            type:String,
            validate:{
                validator: function(v){
                    return /^\S*$/.test(v);
                },
                message: props => `${props.value} has spaces`
            }
        }
        ],
        default:[],
        validate: [isNotempty, '{PATH} is empty array']
        
    },
    banned:{
        type: [{
            type:String,
            validate:{
                validator: function(v){
                    return /^\S*$/.test(v);
                },
                message: props => `${props.value} has spaces`
            }
        }
        ],
        default:[]
    },
    posts:{
        type:[Schema.Types.ObjectId],
        ref: Post,
        // default: []
    }
});
function isNotempty(arr) {
    return arr.length>0;
}

SGSchema.methods.totalFollowers= function(){
    return this.followers?.length;
}

SGSchema.pre('findByIdAndDelete', async function(){
    for (let index = 0; index < this.posts.length; index++) {
       await Post.findByIdAndDelete(this.posts[index]);        
    };
    await this.delete();
})

const SG=mongoose.model("Subgreddiit",SGSchema);
export default SG;