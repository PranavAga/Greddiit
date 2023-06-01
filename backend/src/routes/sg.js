import express from'express';
import multer from 'multer'
import Users from '../../schema/User.js'
import SG from '../../schema/Sg.js';
import verify from '../middleware/verify.js'

import {body,param,validationResult} from 'express-validator';

const router=express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.use(express.json());

router.post('/create',
verify, 
upload.single('image'),
async(req,res)=>{
    try {
        const tags=req.body.tags.split(" ")
        const banned=req.body.banned.split(" ")
        const sg= new SG({
            mod:req.id,
            name:req.body.name,
            desc:req.body.desc
        })
        for (let index = 0; index < tags.length; index++) {
            const element = tags[index];
            sg.tags.push(element);
        }
        for (let index = 0; index < banned.length; index++) {
            const element = banned[index];
            sg.banned.push(element);
        }
        sg.followers.push(req.id);
        sg.prev_users.push(req.id);
        if(req.file){
            sg.img.data=req.file.buffer}
        const mgErrors = sg.validateSync();
        if (mgErrors) {
          return res.status(400).send(mgErrors.message);
        }

        await sg.save();
        return res.send(sg);
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});
/** 
 * Number of people in the Sub Greddiit
 * Number of posts posted in the Sub Greddiit until now
 * Name
 * Desc
 * banned
*/

router.get('/mysgs',verify,
async(req,res)=>{ 
    try {
        const id=req.id;
        const sgs= await SG.find({mod:id})
        // .select("name banned desc")
        const sg_fls= new Array();
        const sg_psts= new Array();
        for (let i = 0; i < sgs.length; i++) {
            sg_fls.push(sgs[i].totalFollowers())
            // console.log(sgs[i].totalFollowers())
            
        }
        for(let i=0;i<sgs.length;i++){
            sg_psts.push(sgs[i].posts.length);
        }
        // console.log('fls',sg_fls.length)
        const respose={
            // direct:sgs.select("name banned"),
          sg_fls,
            sg_psts,
            sgs
        }
        return res.send(respose);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

router.post('/del',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        // console.log('deleting sg',id);
        const deleted=await SG.findByIdAndDelete(id);
        // console.log(deleted)
        return res.send({deleted})
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        // console.log(sg.mod,req.id);
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        }
        return res.send(sg);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/joined',
// verify,
async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);

        //verify has joined
        // if(sg.mod._id!=req.id){
        //     return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        // }
        return res.send(sg);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/details',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const users=Array()
        for(let i=0; i<sg.followers.length;i++){
            const user=await Users.findById(sg.followers[i]).select('uname');
            users.push(user);
        }
        //populate?
        // for(let i=0; i<sg.followers.length;i++){
        //     const user=await Users.findById(sg.followers[i]).select('uname');
        //     users.push(user);
        // }
        return res.send({users});
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/request',verify,async(req,res)=>{
    try {
        const user_id=req.id;
        const {sg_id}=req.body;
        console.log(user_id,sg_id)
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        };
        if(sg.followers.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Already joined"}]})
        }
        if(sg.req_users.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Request already sent"}]})
        }
        sg.req_users.push(user_id)
        await sg.save();
        return
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.get('/sgs',verify,
async(req,res)=>{ 
    try {
        const id=req.id;
        const joined_sg= await SG.find({followers:id})
        const other_sg= await SG.find({followers:{$ne: id}})
        
        const respose={
          joined_sg,
            other_sg
        }
        return res.send(respose);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
export default router;