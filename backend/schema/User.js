import mongoose ,{Schema}from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema =new mongoose.Schema({
    uname: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
    },
    fname: {
        type:String,
        required: true,
    },email: {
        type:String,
        required: true,
        unique: true
    },
    lname: String,
    age: Number, 
    contact: {
        type:String
    }
});

UserSchema.methods.checkPswd=function(password){
    return bcrypt.compare(password,this.password)
}
UserSchema.methods.genToken=function(){
    const input={
        id: this._id
    }
    const key=process.env.PRIVATE_KEY

    const token=jwt.sign(input,key,{expiresIn: 1000000});
    return token;
}
const User=mongoose.model("User Details",UserSchema);
export default User;