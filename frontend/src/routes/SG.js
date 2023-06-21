import { Fragment } from "react";
import { ThemeProvider } from '@mui/material/styles';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import CommentRoundedIcon from '@mui/icons-material/CommentBankRounded'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput } from "@mui/material";
import Fade from '@mui/material/Fade';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {Buffer} from 'buffer';
import axios from "axios";

import mysgAPI from "../api/sg";
import postsAPI from "../api/posts"
import Top from './util/top';
import {Theme} from './util/ColorTheme.js';

export default function JoinedSG(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;
    const navigate=useNavigate();
    const token=localStorage.getItem('token');
    if (token){
        axios.defaults.headers.common['x-auth-token']=token;
    }
    const voteDefault='#7d7d7d'

    const[sdetails,setSdetails]=useState();
    const[user_id,setUser_id]=useState();
    const[imageb,setImageb]=useState();
    const[hasImage,setHasImage]=useState(false);
    const[openCreate,setOpenCreate]=useState(false);
    const[bannedW,setBannedW]=useState();
    const[posts,setPosts]=useState();
    const[showComments,setShowComments]=useState([]);
    const[addComment,setAddComment]=useState({})
    const [comments,setComments]=useState({})

    async function theSG(){
        try {
            const res=await mysgAPI.getSG_joined(id);
            setSdetails([res.sg.name,res.sg.desc]);
            setUser_id(res.user_id)
            setBannedW(res.sg.banned)
            //const STRING_CHAR = String.fromCharCode.apply(null, res.img.data.data);
            // const base64String1 = btoa(STRING_CHAR);//DEPRECATED
            const base64String1 = Buffer.from(res.img.data.data).toString('base64')
            setImageb('data:image/gif; base64,'+base64String1)
            if(base64String1){
                setHasImage(true)
            }
            
        } catch (error) {
            if (error.errors[0]){
                console.log(error.errors[0])
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    async function getPosts(){
        try {
            const res=await postsAPI.getAll(id);
            setPosts(res)
            for(let i=0;i<res?.length;i++){
                getComments(res[i]._id)
            }
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    async function getComments(post_id){
        try {
            const res=await postsAPI.getAllComments(post_id);
            console.log(res)
            let updated_comments=comments;
            updated_comments[post_id]=res;
            setComments(comments => ({
            ...updated_comments
        }));
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    const handleSubmitPost= async()=>{
        const title=document.getElementById("ntitle").value;
        const content=document.getElementById("ncontent").value;
        if(title?.trim()&&content?.trim()){
            try {
                const res=await postsAPI.create(title,content,id);
                setOpenCreate(false);
                getPosts();
                
            } catch (error) {
                if (error.errors?.[0]){
                    return navigate('/');
                }
                else{
                 console.error(error);   
                }
            }
        }
        else{
            alert("Title and content cannot be empty.")
        }
    }
    const handleUpVote=async(already,post_id)=>{
        if(!already){
            try {
                await postsAPI.upVote(post_id,id);
            } catch (error) {
                if (error.errors?.[0]){
                    alert(error.errors?.[0].msg)
                    if(error.errors?.[0].msg!=="Already upvoted"){
                        return navigate('/');
                    }
                    
                }
                else{
                console.error(error);   
                }
            }
        }
        else{
            try {
                await postsAPI.remupVote(post_id,id);
            } catch (error) {
                if (error.errors?.[0]){
                    alert(error.errors?.[0].msg)
                    if(error.errors?.[0].msg!=="Already upvoted"){
                        return navigate('/');
                    } 
                }
                else{
                console.error(error);   
                }
            }
        }
        getPosts()
    }
    const handleDownVote=async(already,post_id)=>{
        if(!already){
            try {
                await postsAPI.downVote(post_id,id);
            } catch (error) {
                if (error.errors?.[0]){
                    alert(error.errors?.[0].msg)
                    if(error.errors?.[0].msg!=="Already downVoted"){
                        return navigate('/');
                    }
                    
                }
                else{
                console.error(error);   
                }
            }
        }
        else{
            try {
                await postsAPI.remdownVote(post_id,id);
            } catch (error) {
                if (error.errors?.[0]){
                    alert(error.errors?.[0].msg)
                    if(error.errors?.[0].msg!=="not downvoted"){
                        return navigate('/');
                    }  
                }
                else{
                console.error(error);   
                }
            }
        }
        getPosts();
    }
    const handleShowComments=(post_id)=>{
        if(showComments?.includes(post_id)){
            setShowComments(showComments.filter(id=>id!==post_id))
        }
        else{
            setShowComments(showComments=>showComments.concat(post_id));
        }
    }
    const handleAddComment=(comment,post_id)=>{
        let updated_addComment=addComment;
        updated_addComment[post_id]=comment;
        setAddComment(addComment => ({
            ...updated_addComment
        }));
    }
    const submitAddComment=async(post_id)=>{
        if(addComment[post_id]?.trim()){
            try {
                await postsAPI.addComment(addComment[post_id],post_id);
                getComments(post_id)
                let updated_addComment=addComment;
                updated_addComment[post_id]='';
                setAddComment(addComment => ({
                ...updated_addComment
                }));
            } catch (error) {
                if (error.errors?.[0]){
                    alert(error.errors?.[0].msg)
                    return navigate('/');
                }
                else{
                    console.error(error);   
                }
            }
        }
        else{
            alert("Cannot add empty comment")
        }
    }
    function filteredPost(text){
        let ftext=text;
        for(let i=0;i<bannedW?.length;i++){
            ftext=ftext.replaceAll(RegExp(bannedW[i],"gi"),'*'.repeat(bannedW[i].length))
        }
        return ftext;
    }

    useEffect(()=>{
        theSG();
        getPosts()
    },[]);
    return(
        <Fragment>
            <Top/>
            <ThemeProvider theme={theme}><CssBaseline>
                <br></br><br></br><br></br>
                <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 2,
                    m:2
                }}
                >
                    <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column' ,
                        alignItems: 'center'
                    }}
                    >
                        <h1>{sdetails?.[0]}</h1>
                    {
                        (!hasImage)?
                        <img src="/default_sg.jpg"  alt="default" 
                        style={{
                            maxWidth: '300px',
                            height: 'auto'
                        }} ></img>
                        :
                        <img src={imageb} alt={imageb}
                        style={{
                            maxWidth: '300px',
                            height: 'auto'
                        }} ></img>
                    }
                        <h3>{sdetails?.[1]}</h3>
                    </Box>
                    &nbsp;&nbsp;
                    <Box
                        sx={{
                            border: 2,
                            borderColor: '#14989f',
                            backgroundColor: '#d7f8fa',
                            borderStyle:'dotted',
                            borderRadius: 3,
                            display: 'flex',
                            p:2,
                            border:2,
                            flexGrow: 1,
                            // width:'100%',
                            flexDirection: 'column'
                        }}
                    >
                        <Button onClick={()=>setOpenCreate(true)}
                        >Create Post !</Button>
                        <Dialog open={openCreate} onClose={()=>setOpenCreate(false)}>
                            <DialogTitle>Create</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Add a post to the Subgreddiit. Use appropriate language.
                                </DialogContentText>
                                <TextField autoComplete='off' id="ntitle" label="Title" variant="standard" /><br></br>
                                <TextField autoComplete='off' id="ncontent" label="Content" variant="standard" />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={()=>setOpenCreate(false)}>Cancel</Button>
                                <Button onClick={handleSubmitPost}>Submit</Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/* All posts */}
                        <Box>
                        {
                            posts?.map((post)=>(
                                <Box 
                                sx={{
                                    p:1,
                                    m:1,
                                    border: 1,
                                    borderColor: "primary.main",
                                    borderRadius: 2,
                                    backgroundColor: "white"
                                }}>
                                    <h3>{post.title}</h3>
                                    <p>{filteredPost(post.content)}</p>
                                    <IconButton onClick={()=>handleUpVote(post.up_votes.includes(user_id),post._id)} 
                                        color={post.up_votes?.includes(user_id)?'upVote':voteDefault}>
                                        <NorthIcon/>
                                    </IconButton>
                                    {post.up_votes.length-post.down_votes.length}
                                    <IconButton onClick={()=>handleDownVote(post.down_votes.includes(user_id),post._id)} 
                                        color={post.down_votes?.includes(user_id)?'downVote':voteDefault}>
                                        <SouthIcon/>
                                    </IconButton>
                                    &nbsp;&nbsp;
                                    {post?.comments.length}
                                    <IconButton onClick={()=>handleShowComments(post._id)}>
                                        <CommentRoundedIcon/>
                                    </IconButton>
                                    {(showComments?.includes(post._id))&&
                                    <Box sx={{ display: 'flex' }}>
                                        <Fade in={showComments?.includes(post._id)}>{
                                            <Box
                                            sx={{
                                                border:1,
                                                borderColor: 'black',
                                                backgroundColor: '#c2c2c2',
                                                borderRadius: 2,
                                                p:1                                            }}
                                            >
                                                {/* All comments */}
                                                <Box>
                                                    {
                                                        // comments[post._id]
                                                        comments[post._id]?.map((comment)=>(
                                                            <Box
                                                            sx={{
                                                                borderRadius: 1,
                                                                borderColor: '#e3c51c',
                                                                border:1,
                                                                m:1,
                                                                p:1
                                                            }}
                                                            >
                                                                <i>commented by {comment.usname.uname}</i>
                                                                <p>{comment.text}</p>
                                                            </Box>
                                                        ))
                                                    }
                                                </Box>
                                                
                                                {/* Add comment */}
                                                <OutlinedInput value={addComment?.[post._id]} onChange={(e)=>handleAddComment(e.target.value,post._id)} type="text" endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={()=>submitAddComment(post._id)}>
                                                                <AddCircleIcon/>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                >
                                                </OutlinedInput>
                                            </Box>
                                        }</Fade>
                                    </Box>}                                    
                                </Box>
                            ))
                        }
                        </Box>
                    </Box>
                </Box>
            </CssBaseline>
            </ThemeProvider>
            
        </Fragment>
    )
}