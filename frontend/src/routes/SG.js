import { Fragment } from "react";
import { ThemeProvider } from '@mui/material/styles';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import TextField from '@mui/material/TextField';
import { Box, Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem } from "@mui/material";
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
                    p: 2,
                    m:1,
                    display: 'flex',
                    // justifyContent: 'flex-start',
                    alignItems: 'center'
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
                    <Box
                        sx={{
                            border: 2,
                            borderColor: 'secondary.main',
                            borderStyle:'dotted',
                            borderRadius: 3,
                            display: 'flex',
                            p:2,
                            border:2,
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
                                <TextField id="ntitle" label="Title" variant="standard" /><br></br>
                                <TextField id="ncontent" label="Content" variant="standard" />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={()=>setOpenCreate(false)}>Cancel</Button>
                                <Button onClick={handleSubmitPost}>Submit</Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/* All posts */}
                        {
                            posts?.map((post)=>(
                                <Box 
                                sx={{
                                    p:1,
                                    border: 1,
                                    borderColor: "primary.main",
                                    borderRadius: 2,
                                    backgroundColor: "white"
                                }}>
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <IconButton onClick={()=>handleUpVote(post.up_votes.includes(user_id),post._id)} 
                                        color={post.up_votes?.includes(user_id)?'upVote':voteDefault}>
                                        <NorthIcon/>
                                    </IconButton>
                                    {post.up_votes.length-post.down_votes.length}
                                    <IconButton onClick={()=>handleDownVote(post.down_votes.includes(user_id),post._id)} 
                                        color={post.down_votes?.includes(user_id)?'downVote':voteDefault}>
                                        <SouthIcon/>
                                    </IconButton>

                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </CssBaseline>
            </ThemeProvider>
            
        </Fragment>
    )
}