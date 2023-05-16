import mongoose, { Schema } from 'mongoose';
import User from './User.js';

const FollowsSchema =new mongoose.Schema({
    curr_user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: User
    },
    follows:{
        type: Schema.Types.ObjectId,
        ref: User
    }
});

const Followspair=mongoose.model('Follows',FollowsSchema);
export default Followspair;
