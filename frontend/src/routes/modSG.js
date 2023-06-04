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
import JoinRequests from './modSG/joinreq';
import Users from './modSG/users';


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
    const[sname,setSname]=useState();
    const [checking,setChecking]=useState(true);

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
    useEffect(()=>{
        theSG();
    },[]);
    if(checking){
        return <h1>Loading</h1>
    }
    return(  
        <main>
            {/* {if} */}
            <Top/>
            <ThemeProvider theme={theme}><CssBaseline>
            <Box
            sx={{
                p:2
            }}
            >
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
                            <Users/>
                        </TabPanel>
                        <TabPanel value='jr'>
                            <JoinRequests/>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Box>
            </CssBaseline></ThemeProvider>
        </main>
    )
}