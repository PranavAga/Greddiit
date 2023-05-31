import React, { useEffect,useState } from "react";
import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline } from "@mui/material";
// import Tooltip from '@mui/material/Tooltip';

import mysgAPI from '../api/sg';
import { useNavigate } from "react-router-dom";

export default function MySG(){
    const theme=Theme;
    const [lock,setLock]=useState(true);
    const [nname,setNname]=useState();
    const [nimage,setNimage]=useState('');
    const [ndesc,setNdesc]=useState();
    const [ntags,setNtags]=useState();
    const [nban,setNban]=useState();
    const [ref,setRef]=useState(true);
    const [sgs,setSgs]=useState();
    const navigate=useNavigate();

    useEffect(()=>{
        // const tags=
        const onlylc=/^[a-z ]+$/
        const onlyabcs=/^[a-zA-Z ]+$/
        if(
            nname
            &&ntags?.trim()
            &&onlylc.test(ntags)
            &&(!nban || onlyabcs.test(nban))
        ){
            setLock(false); 
        }
        else{
            setLock(true);
        }
    },[nname,ntags,nban])
    const resetVals=()=>{
        setNdesc("")
        setNname("")
        setNtags("")
        setNban("")
        // setNimage('')
    }
    const createSG=async ()=>{
        const prev=lock;
        setLock(true);
        const tags=ntags?.trim();
        const ban=nban?.trim();      
        const formData=new FormData();
        formData.append('image',nimage);
        formData.append('name',nname)
        formData.append('desc',ndesc)
        formData.append('tags',tags) //.split(" ")
        formData.append('banned',ban?ban:"")  
        try {
            await mysgAPI.create(formData);
            resetVals();
            setRef(!ref);
            getmySG();
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
            console.error(error);
            }
        }
        setLock(prev);
    }
    const getmySG=async(e)=>{
        try {
            const res=await mysgAPI.getmy();
            setSgs(res.sgs);
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
    }
    useEffect(()=>{
        getmySG();
    },[]);
    async function delSG(id){
        const res=await mysgAPI.delSG(id);
        getmySG();
    };
    const goTo=(id)=>{
        navigate('/mysg/'+id)
    };
    // console.log(sgs);
    return(
        <main>
        <ThemeProvider theme={theme}><CssBaseline>
        {/* Create SG */}
        <Box 
        sx={{
            border: 2,
            // borderBottom: 1,
            borderColor: 'secondary.main',
            borderStyle:'dotted',
            borderRadius: 3,
            display:'flex',
        flexDirection: 'column',
        // m="auto"
        alignItems:"center",
        justifyContent:"center"}}
        >
            <h2>Create Subgreddit</h2>
            <form id='make'>
                <label>Name:</label><br></br>
                <input title="Required" required id='nname' type='text' value={nname} onChange={(e)=>{setNname(e.target.value)}}>
                </input><br></br><br></br>
                <label>Image:</label><br></br>
                <input id='nimage' type='file' accept=".png, .jpg, .jpeg" onChange={(e)=>{setNimage(e.target.files[0])}}>
                </input><br></br><br></br>
                <label>Description:</label><br></br>
                <input id='ndesc' type='text' value={ndesc} onChange={(e)=>{setNdesc(e.target.value)}} ></input>
                <br></br><br></br>
                <label>Tags:</label><br></br>
                <input title="Enter space seperated tags with only lowercase letters, atleast one required" id ='ntags' type='text' required value={ntags} onChange={(e)=>{setNtags(e.target.value)}}></input>
                <br></br><br></br>
                <label>Banned keywords:</label><br></br>
                <input title="Enter space seperated banned words with only letters" id ='bnanned' type='text' required value={nban} onChange={(e)=>{setNban(e.target.value)}}></input>
            </form>
            <br></br>
            <button type ='submit' title={lock ? 'Invalid inputs':''} disabled={lock} onClick={createSG}>Create!</button>
            <br></br>
        </Box>
        {/* Mod's SG */}
        <Box
            sx={{
                border: 2,
                borderColor: 'secondary.main',
                borderStyle:'dotted',
                borderRadius: 3
            }}
        >
            <h2>&nbsp;Created Subgreddiits</h2>
            {
                sgs?.map((elem)=>
                <Box
                sx={{
                backgroundColor: 'white',

                    borderTop:1,
                    borderBottom:1,
                    borderColor: 'secondary.main',
                    p: 2
                }}>
                    <h3>{elem.name}</h3>
                    <button type='submit' onClick={()=>delSG(elem._id)}>Delete</button>
                    <button type="button" onClick={()=>goTo(elem._id)}>Open</button>
                    <p>{elem.desc}</p>
                    <ul>
                        <li>Followers: {elem.followers.length}</li>
                        <li>Posts:{elem.posts?.length||0}</li>
                        <li>Banned words: &nbsp;
                            {
                            elem.banned?.join(', ')
                            }
                        </li>
                    </ul>
                </Box>

                )
            }
            <br></br>
        </Box>
        </CssBaseline></ThemeProvider>
                
        </main>
    )
}