import express from'express';
import Users from '../../schema/User.js'
import bcrypt from 'bcryptjs';
import {body,oneOf,validationResult} from 'express-validator';

//.select for reqd fields

const router=express.Router();
router.use(express.json());

router.post('/',
oneOf([body('contact').matches("^[\+][0-9]{2}-[0-9]{10}$"),body('contact').isEmpty()]),
    body('email').isEmail(),
    body('uname').not().isEmpty(),
    body('password').not().isEmpty(),
    body('fname').not().isEmpty(),
async(req,res)=>{
    try{
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()});
        }
        const {uname,password,fname,email,lname,age,contact}=req.body;
        const user=await Users.findOne({uname:uname});
        const user_mail=await Users.findOne({email:email});
        if(user)
            return res.status(400).send({errors: [{msg: 'Username taken'}]})
        if(user_mail)
            return res.status(400).send({errors:[{msg: 'Email already registered'}]})
        
        const nuser=new Users({uname,password,fname,email,lname,age,contact});
        
        // hash pswd with salt
        const salt=await bcrypt.genSalt();
        const token=await nuser.genToken();
        nuser.password=await bcrypt.hash(nuser.password,salt);
        await nuser.save();
        
        
        return res.send({token});
    }   
    catch(e){ 
        console.error(e);
        res.status(500);
    }
});

export default router;