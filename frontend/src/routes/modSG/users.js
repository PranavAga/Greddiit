import {Box} from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Top from '../util/top';
import {Theme} from '../util/ColorTheme.js';
import mysgAPI from '../../api/sg';

export default function Users(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;
    const navigate=useNavigate();
    
    const [users,setUsers]=useState();

    async function loadUsers(){
        try {
            const res=await mysgAPI.getUsers(id);
            setUsers(res.users);
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
        loadUsers();
    },[]);
    return(  
        <main>
            {/* {if} */}
            <Top/>
            <ThemeProvider theme={theme}><CssBaseline>
                <ul>
                    <h3>Current users:</h3>
                {
                    users?.map((elem)=>
                        <li>{elem.uname}</li>
                    )
                }
                </ul>
            </CssBaseline></ThemeProvider>
        </main>
    )
}