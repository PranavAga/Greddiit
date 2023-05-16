import express from 'express';
import Users from '../../schema/User.js'
const router=express.Router();
router.use(express.json());

//to put u/p in body not url
router.post('/',async(req,res)=>{
    try{
        const {uname,password}=req.body;
        const user=await Users.findOne({uname:uname});
        //express validator?
        if(!user)
            return res.status(400).send({errors: [{msg: 'Invalid username'}]})
        const correct=await user.checkPswd(password)
        // console.log('pswd check',correct);
        if (!correct)
            return res.status(400).send({errors:[{msg: 'Incorrect password'}]});
        
        //gen token on every login
        const token=user.genToken();
        return res.send({token});
    }   
    catch(e){
        console.error("Error:",e);
        res.status(500);
    }
});

export default router;