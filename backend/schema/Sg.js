import mongoose, { Schema } from 'mongoose';
import User from './User.js';
import Post from './Post.js';

const SGSchema=new mongoose.Schema({
    mod:{
        type: Schema.Types.ObjectId,
        ref: "User Details",
        required: true
    },
    followers:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "User Details"
        }],
        default:[],
        validate: [isNotempty, '{PATH} is empty array']
    },
    prev_users:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "User Details"
        }],
        default:[],
        validate: [isNotempty, '{PATH} is empty array']
    },
    blocked_users:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "User Details"
        }],
        default:[],
    },
    req_users:{
        type:[{
            type: Schema.Types.ObjectId,
            ref: "User Details"
        }],
        default:[],
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
        ref: "Post",
        // default: []
    },
    img: 
      { data: Buffer, contentType: String },
    user_growth:{
            type:[{
            count:{
                type:Number
            },
            time:{
                type:String
            }
        }]
    },
    post_growth:[{
        count:{
            type:Number
        },
        time:{
            type:String
        }
    }],
    visits:[{
        count:{
            type:Number
        },
        time:{
            type:String
        }
    }]
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