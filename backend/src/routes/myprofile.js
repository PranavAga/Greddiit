import express from 'express';
import bcrypt from 'bcryptjs';

import verify from '../middleware/verify.js'
import Users from '../../schema/User.js'
import Followspair from '../../schema/UserFF.js';
import {body,oneOf,validationResult} from 'express-validator';

const router=express.Router();
router.use(express.json());

router.get('/',verify,async(req,res)=>{
    try {
        const id=req.id;
        const user=await Users.findOne({_id:id});
        return res.send(user);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.post('/',verify,
oneOf([body('contact').matches("^[\+][0-9]{2}-[0-9]{10}$"),body('contact').isEmpty()]),
    body('email').isEmail(),
    body('uname').not().isEmpty(),
    body('fname').not().isEmpty(),
async(req,res)=>{
    try {
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()});
        }
        const filter={
            _id:req.id
        }
        const curr_user= await Users.findOne(filter);
        // console.log(req.body);
        const {uname,oldpassword,newpassword,fname,email,lname,age,contact}=req.body;
        let pswd,username,emailid
        //checking if changed uname and email exits
        if(curr_user.uname!==uname){
            const user=await Users.findOne({uname:uname});
            if (user)
                return res.status(400).send({errors: [{msg: 'Username taken'}]})
            username=uname
        }
        else{
            username=curr_user.uname
        }
        if(curr_user.email!==email){
            const user=await Users.findOne({email:email});
            if (user)
                return res.status(400).send({errors: [{msg: 'Email ID already registered to different account'}]})
            emailid=email
        }
        else{
            emailid=curr_user.email
        }
        //verifying for pswd change
        if (oldpassword){
            const correct=await curr_user.checkPswd(oldpassword)
            if (!correct)
                return res.status(400).send({errors:[{msg: 'Incorrect password'}]});
            if (!newpassword)
                returnres.status(400).send({errors:[{msg: 'Password can not be empty'}]});
            const salt=await bcrypt.genSalt();
            pswd=await bcrypt.hash(newpassword,salt);
        }
        else{
            pswd=curr_user.password;
        }
        curr_user.uname=username
        curr_user.email=emailid
        curr_user.fname=fname
        curr_user.lname=lname
        curr_user.age=age
        curr_user.contact=contact
        curr_user.password=pswd
        await curr_user.save();

        return res.send(curr_user); 
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

router.get('/getfollowers',verify,async(req,res)=>{
    try {
        const id=req.id;
        const followers=await Followspair.find({follows:id}).select('curr_user');
        // console.log(followers)
        const details=Array();
        for(let i=0;i<followers.length;i++){
            const name=await Users.findById(followers[i].curr_user).select('uname');
            details.push({
                id:followers[i],
                name:name.uname
            })
        }
        // console.log('details',details)
        return res.send(details);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.get('/getfollowing',verify,async(req,res)=>{
    try {
        const id=req.id;
        const following=await Followspair.find({curr_user:id}).select('follows');
        const details=Array();
        for(let i=0;i<following.length;i++){
            const name=await Users.findById(following[i].follows).select('uname');
            details.push({
                id:following[i],
                name:name.uname
            })
        }
        return res.send(details);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.post('/remfollower',verify,async(req,res)=>{
    try {
        const {id}=req.body
        await Followspair.findByIdAndDelete(id._id);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
export default router;