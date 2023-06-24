import {Box} from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {Theme} from '../util/ColorTheme.js';
import mysgAPI from '../../api/sg';


export default function JoinRequests(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;
    const navigate=useNavigate();

    const [reqs,setReqs]=useState(null);

    const loadReq =async ()=>{
        try {
            const res=await mysgAPI.getReqs(id);
            setReqs(res.req_users);
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    const acceptUser=async(user_id)=>{
        try {
            await mysgAPI.acceptUser(id,user_id);
            loadReq();
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
            console.error(error);   
            }
        }
    }
    const rejectUser=async(user_id)=>{
        try {
            await mysgAPI.rejectUser(id,user_id);
            loadReq();
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
        loadReq();
    },[]);
    return(  
        <main>
            <ThemeProvider theme={theme}><CssBaseline>
                <Box sx={{
                    p: 2
                    }}>
                    { 
                    (!reqs?.length==0)?(
                        reqs?.map((elem)=>
                        <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: 'secondary.main',
                            p:2
                        }}
                        >
                        <h3>{elem.fname}{elem.lname}</h3>
                        {elem.uname}<br></br>
                        <button type='button' onClick={()=>acceptUser(elem._id)}>Accept</button>
                        <button type='button' onClick={()=>rejectUser(elem._id)}>Reject</button>
                        </Box>)
                    ):(<h3>No requests found</h3>)
                    }
                </Box>
            </CssBaseline></ThemeProvider>
        </main>
    )
}