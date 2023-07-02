import { useNavigate } from "react-router-dom";
import CheckStatus from './checkStatus';
import {Theme} from './ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import styled from "@mui/styled-engine";
// import { useEffect, useState } from "react";
import axios from "axios";


export default function Top(){
    const theme=Theme;
    const navigate=useNavigate();
    // const [logout,setLogout]=useState(false);
    function remValues(){
        localStorage.removeItem('token');
        localStorage.removeItem('isAuth');
        delete axios.defaults.headers.common['x-auth-token']
    }
    function logOut(){
        remValues();
        navigate('/LS');
    }
    const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);
    const lightbg=theme.palette.primary.light;
    return(
        <>
            <CheckStatus/>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                <Box sx={{display:'flex', flexGrow:1}}>
                    <AppBar component="nav">
                        <Toolbar>
                            <Box onClick={()=>navigate('/')}>
                            <img src='/logo.png' alt='Logo' style={{
                            height: '40px',
                            objectFit: 'cover'
                            }}>
                            </img>
                            <h1 style={{display: 'inline', color: ''}}>Greddiit</h1>
                            </Box>
                        <button style={{position: 'absolute' ,top:20 ,right:15 }} onClick={logOut}>Logout</button>
                        </Toolbar>
                    </AppBar>
                    <Offset/>
                </Box>
                </CssBaseline>
            </ThemeProvider>
        </>
    )
}