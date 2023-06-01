import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline } from "@mui/material";
import { useNavigate } from 'react-router-dom';

import mysgAPI from '../api/sg.js';
import { useEffect, useState } from 'react';


export default function Subgreddiits(){
    const theme=Theme;
    const navigate=useNavigate();
    const [all_joinedSG,setAll_joinedSG]=useState()
    const [all_otherSG,setAll_otherSG]=useState()


    const getSGs=async()=>{
        try {
            const res=await mysgAPI.getSGs();
            setAll_joinedSG(res.joined_sg);
            setAll_otherSG(res.other_sg);
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
    }
    const joinSG=async(sg_id)=>{
        try {
            await mysgAPI.joinSG(sg_id);
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
    }

    const gotoSG=(id)=>{
        navigate('/joinedSG/'+id)
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
                        {
                            all_joinedSG?.map((elem)=><>
                            <Box
                                sx={{
                                backgroundColor: 'white',

                                    borderTop:1,
                                    borderBottom:1,
                                    borderColor: 'secondary.main',
                                    p: 2
                                }}
                                onClick={()=>gotoSG(elem._id)}
                                >
                                <h3>{elem.name}</h3>
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
                            </>)
                        }
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
                        {
                            all_otherSG?.map((elem)=><>
                            <Box
                                sx={{
                                backgroundColor: 'white',

                                    borderTop:1,
                                    borderBottom:1,
                                    borderColor: 'secondary.main',
                                    p: 2
                                }}>
                                <h3>{elem.name}</h3>
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
                                <br></br>
                                <button type='button' onClick={()=>joinSG(elem._id)}>Join</button>
                            </Box>
                            </>)
                        }

                </Box>
                </CssBaseline>
            </ThemeProvider>


        </main>
    )
}