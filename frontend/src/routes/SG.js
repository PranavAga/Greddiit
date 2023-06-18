import { Fragment } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from "@mui/material";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {Buffer} from 'buffer';
import axios from "axios";

import mysgAPI from "../api/sg";
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

    const[sdetails,setSdetails]=useState();
    const[imageb,setImageb]=useState();
    const[hasImage,setHasImage]=useState(false);
    async function theSG(){
        try {
            const res=await mysgAPI.getSG_joined(id);
            setSdetails([res.name,res.desc]);
            
            //const STRING_CHAR = String.fromCharCode.apply(null, res.img.data.data);
            // const base64String1 = btoa(STRING_CHAR);//DEPRECATED
            const base64String1 = Buffer.from(res.img.data.data).toString('base64')
            setImageb('data:image/gif; base64,'+base64String1)
            if(base64String1){
                setHasImage(true)
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

    useEffect(()=>{
        theSG();
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
                            width:'100%'
                        }}
                    >
                    Hello
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    yo
                    </Box>
                </Box>
            </CssBaseline>
            </ThemeProvider>
            
        </Fragment>
    )
}