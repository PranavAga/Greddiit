import {Box} from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '@mui/lab';
import TabContext from "@mui/lab/TabContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Top from './util/top';
import {Theme} from './util/ColorTheme.js';
import mysgAPI from '../api/sg';


export default function ModSG(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;
    const navigate=useNavigate();
    const token=localStorage.getItem('token');
    if (token){
        axios.defaults.headers.common['x-auth-token']=token;
    }

    const [tab,setTab]=useState('users');
    const [valchange,setValchange]=useState();
    const[sname,setSname]=useState();
    const [checking,setChecking]=useState(true);
    const [users,setUsers]=useState();
    const [reqs,setReqs]=useState(null);

    async function theSG(){
        try {
            const res=await mysgAPI.getSG_mod(id);
            setSname(res.name);
            setChecking(false);
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    async function theDetails(){
        try {
            const res=await mysgAPI.getDetails(id);
            setUsers(res.users);
            setReqs(res.reqs);
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
            await mysgAPI.acceptUser(user_id);
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
            await mysgAPI.rejectUser(user_id);
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
            console.error(error);   
            }
        }
    }
    //diff API class for updating diff parts
    useEffect(()=>{
        theSG();
        theDetails();
    },[]);
    if(checking){
        return <h1>Loading</h1>
    }
    return(  
        <main>
            {/* {if} */}
            <Top/>
            <ThemeProvider theme={theme}><CssBaseline>
            <Box>
                <h1>{sname}</h1>
                <button onClick={()=>{navigate('/')}}>MySGs</button>
                <Box>
                    <TabContext value={tab}>
                        <Tabs centered value={tab} textColor='primary' onChange={(e,nval)=>setTab(nval)}>
                            <Tab label='Users' value='users'></Tab>
                            <Tab label='Joining Requests' value='jr'></Tab>
                            <Tab label='Stats' value='stats'></Tab>
                            <Tab label='Reported' value='Reported'></Tab>
                        </Tabs>
                        <TabPanel value='users'>
                        <ul>
                            <h3>Current users:</h3>
                        {
                            // console.log(users)
                            users?.map((elem)=>
                                // console.log(elem.uname)
                                <li>{elem.uname}</li>
                            )
                        }
                        </ul>
                        </TabPanel>
                        <TabPanel value='jr'>
                            <Box sx={{p: 2}}>
                                { 
                                !reqs.length==0?(
                                    reqs?.map((elem)=>
                                    <>
                                    <h3>{elem.fname}{elem.lname}</h3>
                                    <p>{elem.uname}</p>
                                    <button type='button' onClick={()=>acceptUser(elem._id)}>Accept</button>
                                    <button type='button' onClick={()=>rejectUser(elem._id)}>Reject</button>
                                    </>)
                                ):(<h3>No requests found</h3>)
                                }
                            </Box>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
            </CssBaseline></ThemeProvider>
        </main>
    )
}