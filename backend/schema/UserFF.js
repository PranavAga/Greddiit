import mongoose, { Schema } from 'mongoose';

const FollowsSchema =new mongoose.Schema({
    curr_user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "User Details"
    },
    follows:{
        type: Schema.Types.ObjectId,
        ref: "User Details"
    }
});

const Followspair=mongoose.model('Follows',FollowsSchema);
export default Followspair;
