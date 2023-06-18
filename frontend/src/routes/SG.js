import { Fragment } from "react";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
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

    const[sname,setSname]=useState();
    const[imageb,setImageb]=useState();
    async function theSG(){
        try {
            const res=await mysgAPI.getSG_joined(id);
            setSname(res.name);
            
            //const STRING_CHAR = String.fromCharCode.apply(null, res.img.data.data);
            // const base64String1 = btoa(STRING_CHAR);//DEPRECATED
            const base64String1 = Buffer.from(res.img.data.data).toString('base64')
            setImageb('data:image/gif; base64,'+base64String1)
            
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
                <br></br><br></br><br></br><br></br>
            <img src={imageb} alt="lol"></img>
            </CssBaseline>
            </ThemeProvider>
            
        </Fragment>
    )
}