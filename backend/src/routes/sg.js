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
verify,
async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);

        // verify has joined
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        }
        return res.send(sg);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/users',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const users=Array()
        for(let i=0; i<sg.followers.length;i++){
            const user=await Users.findById(sg.followers[i]).select('uname');
            users.push(user);
        }
        return res.send({users});
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/reqs',verify,async(req,res)=>{
    try {
        const {id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const req_users=Array()
        for(let i=0; i<sg.req_users.length;i++){
            const user=await Users.findById(sg.req_users[i]);
            req_users.push(user);
        }
        return res.send({req_users});
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/accept',verify,async(req,res)=>{
    try {
        const {id,user_id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        const new_user= await Users.findById(user_id)
        if(!new_user){
            return res.status(400).send({errors: [{msg: "User not found"}]})
        }
        if(sg.followers.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Already joined"}]})
        }
        sg.followers.push(user_id);
        sg.prev_users.push(user_id);
        const index = sg.req_users.indexOf(user_id);
        if (index > -1) {
            sg.req_users.splice(index, 1);
        }
        await sg.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/mod/reject',verify,async(req,res)=>{
    try {
        const {id,user_id}=req.body;
        const sg=await SG.findById(id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Don't have access to this SG"}]})
        };
        if(sg.followers.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Already joined"}]})
        }
        const index = sg.req_users.indexOf(user_id);
        if (index > -1) {
            sg.req_users.splice(index, 1);
        }
        await sg.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/request',verify,async(req,res)=>{
    try {
        const user_id=req.id;
        const {sg_id}=req.body;
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
        if(sg.prev_users.includes(user_id)){
            return res.status(400).send({errors: [{msg: "Once leaft, you cannot enter :/"}]})
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

        //storing date of creation
        const joined_sg_dates=[]
        const other_sg_dates=[]
        for (let index = 0; index < joined_sg.length; index++) {
            joined_sg_dates[index]= joined_sg[index]._id.getTimestamp();
        }
        for (let index = 0; index < other_sg.length; index++) {
            other_sg_dates[index]= other_sg[index]._id.getTimestamp();
        }
        const response={
            userID:id,
            joined_sg,
            joined_sg_dates,
            other_sg,
            other_sg_dates
        }
        return res.send(response);
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/sgs/leave',verify,async(req,res)=>{
    try {
        const {sg_id}=req.body;
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id==req.id){
            return res.status(400).send({errors: [{msg: "Moderator can't leave the SG !"}]})
        };
        if(!sg.followers.includes(req.id)){
            return res.status(400).send({errors: [{msg: "Not joined this SG"}]})
        }
        if(!sg.prev_users.includes(req.id)){
            sg.prev_users.push(req.id);
        }

        const index = sg.followers.indexOf(req.id);
        if (index > -1) {
            sg.followers.splice(index, 1);
        }
        await sg.save()
        return res.send()
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});

export default router;