import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline } from "@mui/material";

import mysgAPI from '../api/sg';
import { useEffect } from 'react';


export default function Subgreddiits(){
    const theme=Theme;


    const getSGs=async()=>{
        try {
            const res=await mysgAPI.getSGs();
            console.log(res.joined_sg);
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
        getSGs()
    },[])

    return(
        <main>
            <ThemeProvider theme={theme}>
                <CssBaseline>
            {/* Search Bar */}
                <Box 
                sx={{
                    border: 2,
                    borderColor: 'secondary.main',
                    borderStyle:'dotted',
                    borderRadius: 3,
                    display:'flex',
                flexDirection: 'column',
                alignItems:"center",
                justifyContent:"center"}}
                >
                    <h2>Search Bar</h2>
                </Box>

            {/* Joined Subgrediits */}
                <Box 
                    sx={{
                        border: 2,
                        borderColor: 'secondary.main',
                        borderStyle:'dotted',
                        borderRadius: 3,
                        p: 2
                        }}
                    >
                        <h2>Joined Subgreddiits</h2>

                    </Box>

            {/* Other Subgrediits */}
                <Box 
                    sx={{
                        border: 2,
                        borderColor: 'secondary.main',
                        borderStyle:'dotted',
                        borderRadius: 3,
                        p: 2
                        }}
                    >
                        <h2>Others</h2>

                </Box>
                </CssBaseline>
            </ThemeProvider>


        </main>
    )
}