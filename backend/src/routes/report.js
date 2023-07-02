import express from'express';
import Report from '../../schema/Report.js';
import verify from '../middleware/verify.js';
import SG from '../../schema/Sg.js'
import Post from '../../schema/Post.js';
import {body,param,validationResult} from 'express-validator';
import User from '../../schema/User.js';

const router=express.Router();
router.use(express.json());

router.post('/create',
body('concern').not().isEmpty(),
verify, 
async(req,res)=>{
    try {
        const errors=validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()});
        }
        const {post_id,concern}=req.body
        const reporter=req.id
        const curr_time=new Date()
        const report=new Report({
            reporter,
            concern,
            post:post_id,
            status:{value:0,time:curr_time}
        });
        await report.save()

        const post=await Post.findById(post_id).populate('sg','report_stats')
        if(!post.sg.report_stats.total){
            const sg_id=post.sg
            const posts= await Post.find({sg:sg_id},{_id:1}) 
            let reports= await Report.find({post:{$in:posts}})
            post.sg.report_stats.total=reports.length
        }
        else{
            post.sg.report_stats.total+=1
        }
        await post.sg.save()

        return res.send();
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});
router.get('/getallreports/:id',
verify,
async(req,res)=>{
    try{
        const sg_id=req.params.id
        const sg=await SG.findById(sg_id);
        if(!sg){
            return res.status(400).send({errors: [{msg: "SG not found"}]})
        }
        if(sg.mod._id!=req.id){
            return res.status(400).send({errors: [{msg: "Not the moderator of this SG"}]})
        };
        const posts= await Post.find({sg:sg_id},{_id:1}) 
        let reports= await Report.find({post:{$in:posts}}).populate('reporter','uname').populate({
            path:'post',
            populate:{
                path: 'creator',
                model: 'User Details',
                select: 'uname'
            }
        })
        const curr_date=new Date()
        const limit_days=10
        const limit_ms=limit_days*24*60*60*1000;
        // const limit_ms=60*60*1000;
        
        reports=reports.filter(async function(report){
            if(report.status.value===0 &&(curr_date-report.status.time>=limit_ms)){
                await Report.findByIdAndDelete(report._id);
            }
            return report.status.value===0 && (curr_date-report.status.time>=limit_ms)
        })

        // console.log(reports.length)
        return res.send(reports)
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
});
router.post('/ignore',
verify, 
async(req,res)=>{
    try {
        
        const {report_id,sg_id}=req.body
        const mod_id=req.id
        const report=await Report.findById(report_id).populate({
            path:'post',
            populate:{
                path: 'sg',
                model: 'Subgreddiit',
                select: 'mod'
            }
        })
        //verify mod
        if(mod_id!=report.post.sg.mod._id){
            return res.status(400).send({errors: [{msg: "Not the moderator of this SG"}]})
        }
        //verify sg
        if(sg_id!=report.post.sg._id){
            return res.status(400).send({errors: [{msg: "Post not part of the SG"}]})
        }
        report.status.value=3
        report.status.time= new Date()
        
        await report.save()

        return res.send();
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});
router.post('/block',
verify, 
async(req,res)=>{
    try {
        
        const {report_id,sg_id}=req.body
        const mod_id=req.id
        const report=await Report.findById(report_id).populate({
            path:'post',
            populate:{
                path: 'sg',
                model: 'Subgreddiit',
                // select: 'mod'
            },
            select:'creator'

        })
        //verify mod
        if(mod_id!=report.post.sg.mod._id){
            return res.status(400).send({errors: [{msg: "Not the moderator of this SG"}]})
        }
        //verify sg
        if(sg_id!=report.post.sg._id){
            return res.status(400).send({errors: [{msg: "Post not part of the SG"}]})
        }
        //cannot block the mod :|
        if(mod_id==report.post.creator){
            return res.status(400).send({errors: [{msg: "Cannot block the moderator"}]})
        }
        // const sg=await SG.findById(sg_id)
        report.post.sg.blocked_users.push(report.post.creator)
        const index = report.post.sg.followers.indexOf(report.post.creator);
        if (index > -1) {
            report.post.sg.followers.splice(index, 1);
        }
        
        report.status.value=1
        report.status.time= new Date()
        
        await report.post.sg.save()
        await report.save()

        return res.send();
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});
router.post('/delete',
verify, 
async(req,res)=>{
    try {
        
        const {report_id,sg_id}=req.body
        const mod_id=req.id
        const report=await Report.findById(report_id).populate({
            path:'post',
            populate:{
                path: 'sg',
                model: 'Subgreddiit',
                select: 'mod'
            }
        })
        //verify mod
        if(mod_id!=report.post?.sg.mod._id){
            return res.status(400).send({errors: [{msg: "Not the moderator of this SG"}]})
        }
        //verify sg
        if(sg_id!=report.post.sg._id){
            return res.status(400).send({errors: [{msg: "Post not part of the SG"}]})
        }
        
        //deleting that post
        await Post.findByIdAndDelete(report.post._id)

        //deleting it form saved posts
        const users_saves=await User.find({saved_posts:report.post._id})
        for(let i=0;i<users_saves.length;i++){
            const index = users_saves[i].saved_posts.indexOf(report.post._id);
            if (index > -1) {
                users_saves[i].saved_posts.splice(index, 1);
            }
            await users_saves[i].save()
        }

        //deleting all reports about that post
        await Report.findByIdAndDelete({post:report.post._id})

        const sg=await SG.findById(sg_id)
        sg.report_stats.deleted+=1
        await sg.save()
        return res.send();
    } catch (e) {
        console.error(e);
        res.status(500); 
    }
});

export default router;
