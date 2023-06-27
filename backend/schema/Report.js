import mongoose, { Schema } from 'mongoose';

const ReportSchema=new Schema({
    reporter:{
        type: Schema.Types.ObjectId,
        ref: "User Details",
        required: true
    },
    concern :{
        type: String
    },
    post:{
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    status:{
        type:{
            value:{
                //0: not handled
                //1: Blocked
                //2: Deleted
                //3: Ignored
                type:Number,
                default:0
            },
            time:{
                type:Date
            }
        }
    }
});

const Report=mongoose.model("Report",ReportSchema)
export default Report;