import { useState } from 'react';
import {Box} from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '@mui/lab';
import TabContext from "@mui/lab/TabContext";
import { ThemeProvider } from '@mui/material/styles';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import BookIcon from '@mui/icons-material/Book';

import {Theme} from './util/ColorTheme.js';
import axios from 'axios';

import MyProfile from './MyProfile.js';
import MySG from './MySG.js';
import SG from './listSG.js'
import Top from './util/top';

export default function Home(){
    const theme=Theme;
    const token=localStorage.getItem('token');
    if (token){
        axios.defaults.headers.common['x-auth-token']=token;
    }

    const [tab,setTab]=useState('msg');


    function handleTChange(e,newval){
        setTab(newval);
    }

    return(
        <main>
            
            <Top/>
            <Box>
            <h1>HOME</h1>
            <ThemeProvider theme={theme}> 
            <br></br>
            <Box sx={{
                    border: 2,
                    borderColor: '#eb5834',
                    backgroundColor:'#f7eeeb' ,
                    opacity: 0.95,
                    borderRadius:1
                }}>
            <TabContext value={tab}>
                <Box sx={{
                    mx: 'auto'
                }}>           
                    <Tabs centered textColor='primary' value={tab} onChange={handleTChange} aria-label="Sign-up/Log-in">
                <Tab icon={<AllInboxIcon/>} label="Subgreddiits" value ="sg"></Tab>
                    <Tab icon={<BackupTableIcon/>}label="My Subgreddiits" value="msg"></Tab>
                    <Tab icon={<AccountCircleIcon/>} label="My Profile" value="mp"></Tab>
                    <Tab icon={<BookIcon/>}label="Saved" value="saved"></Tab>
                    </Tabs>             
                </Box>
                {/* Panels */}
                <TabPanel value="sg">
                    <SG/>
                </TabPanel>
                <TabPanel value='mp'>   
                    <MyProfile/>
                </TabPanel>
                <TabPanel value='msg'>
                    <MySG/>
                </TabPanel>
            </TabContext>
            </Box>
            <br></br>
            </ThemeProvider>
            </Box>
        </main>
    )
}