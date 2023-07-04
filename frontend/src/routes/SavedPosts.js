import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import CommentRoundedIcon from '@mui/icons-material/CommentBankRounded'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import Fade from '@mui/material/Fade';
import { useEffect, useState } from 'react';

import postsAPI from '../api/posts.js';

export default function Saved(){
    const theme=Theme;
    const navigate=useNavigate();

    const[savedPosts,setSavedPosts]=useState([])
    const [comments,setComments]=useState({})
    const[user_id,setUser_id]=useState();
    const[showComments,setShowComments]=useState([]);
    const[addComment,setAddComment]=useState({})
    const voteDefault='#7d7d7d'

    function censorPost(bannedW,text){
        let ftext=text;
        if(bannedW?.length===0){
            return ftext;
        }
        for(let i=0;i<bannedW?.length && ftext;i++){
            ftext=ftext.replaceAll(RegExp(bannedW[i],"gi"),'*'.repeat(bannedW[i].length))
        }
        return ftext;
    }
    async function getComments(post_id){
        try {
            const res=await postsAPI.getAllComments(post_id);
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
    const getSavedPosts=async()=>{
        try {
            const res=await postsAPI.getUserSavedPosts();
            setSavedPosts(res.posts)
            setUser_id(res.user_id)
            for(let i=0;i<res?.posts?.length;i++){
                getComments(res.posts[i]._id)
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
    const handleUpVote=async(already,post_id)=>{
        if(!already){
            try {
                await postsAPI.upVote(post_id);
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
                await postsAPI.remupVote(post_id);
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
        getSavedPosts()
    }
    const handleDownVote=async(already,post_id)=>{
        if(!already){
            try {
                await postsAPI.downVote(post_id);
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
                await postsAPI.remdownVote(post_id);
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
        getSavedPosts();
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
    const handleUnsave=async(post_id)=>{
        try {
            const res=await postsAPI.unsavePost(post_id);
            setSavedPosts(res)
        } catch (error) {
            if (error.errors?.[0]){
                if(error.errors?.[0].msg!=="Not saved"){
                    return navigate('/');
                }
                alert(error.errors?.[0].msg)
            }
            else{
            console.error(error);   
            }
        }
        getSavedPosts();
    }

    useEffect(()=>{
        getSavedPosts()
    },[])
    return(
        <main>
            <ThemeProvider theme={theme}>
            <CssBaseline>
                <Box 
                sx={{
                    border: 2,
                    borderColor: 'secondary.main',
                    borderStyle:'dotted',
                    borderRadius: 3,
                    display:'flex',
                    flexDirection: 'column',
                    alignItems:"center",
                    justifyContent:"center"
                }}
                >
                    <h2>Saved Posts</h2>
                    <i>from joined subgreddiits</i>
                    
                    {/* All Posts*/}
                    <Box>
                        {
                            savedPosts?.map((post)=>(
                                <Box 
                                sx={{
                                    p:1,
                                    m:1,
                                    border: 1,
                                    borderColor: "primary.main",
                                    borderRadius: 2,
                                    backgroundColor: "white"
                                }}>
                                    <Box sx={{ display: 'flex',justifyContent: 'space-between'}}>
                                    <h3>{censorPost(post?.sg?.banned,post?.title)}</h3>
                                    <IconButton onClick={()=>handleUnsave(post?._id)} color="primary">
                                        <BookmarkIcon>unsave</BookmarkIcon>
                                    </IconButton>
                                    </Box>
                                    <i>by {post?.creator?.uname}</i>&nbsp; 
                                    <p>{censorPost(post?.sg.banned,post?.content)}</p>
                                    <IconButton onClick={()=>handleUpVote(post?.up_votes.includes(user_id),post?._id)} 
                                        color={post?.up_votes?.includes(user_id)?'upVote':voteDefault}>
                                        <NorthIcon/>
                                    </IconButton>
                                    {post?.up_votes?.length-post?.down_votes?.length}
                                    <IconButton onClick={()=>handleDownVote(post?.down_votes.includes(user_id),post?._id)} 
                                        color={post?.down_votes?.includes(user_id)?'downVote':voteDefault}>
                                        <SouthIcon/>
                                    </IconButton>
                                    &nbsp;&nbsp;
                                    {post?.comments?.length}
                                    <IconButton onClick={()=>handleShowComments(post?._id)}>
                                        <CommentRoundedIcon/>
                                    </IconButton>
                                    {(showComments?.includes(post?._id))&&
                                    <Box sx={{ display: 'flex' }}>
                                        <Fade in={showComments?.includes(post?._id)}>{
                                            <Box
                                            sx={{
                                                border:1,
                                                borderColor: 'black',
                                                backgroundColor: '#c2c2c2',
                                                borderRadius: 2,
                                                p:1                                            
                                            }}
                                            >
                                                {/* All comments */}
                                                <Box>
                                                    {
                                                        // comments[post?._id]
                                                        comments[post?._id]?.map((comment)=>(
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
                                                                <p>{censorPost(post?.sg.banned,comment.text)}</p>
                                                            </Box>
                                                        ))
                                                    }
                                                </Box>
                                                
                                                {/* Add comment */}
                                                <OutlinedInput value={addComment?.[post?._id]} onChange={(e)=>handleAddComment(e.target.value,post?._id)} type="text" endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={()=>submitAddComment(post?._id)}>
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
            </CssBaseline>
            </ThemeProvider>
        </main>
    )
}