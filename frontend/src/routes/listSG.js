import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline, Select, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';

import mysgAPI from '../api/sg.js';
import { useEffect, useState } from 'react';


export default function Subgreddiits(){
    const theme=Theme;
    const navigate=useNavigate();

    const [all_joinedSG,setAll_joinedSG]=useState()
    const [all_otherSG,setAll_otherSG]=useState()
    const [skimmed_joinedSG,setSkimmed_joinedSG]=useState()
    const [skimmed_otherSG,setSkimmed_otherSG]=useState()
    const [userID,setUserID]=useState()
    const [tags,setTags]=useState()
    const [filterT,setFilterT]=useState(()=>[])

    const search_joined= new Fuse(all_joinedSG, { 
        keys: ["name"]    
    });
    const search_other= new Fuse(all_otherSG, { 
        keys: ["name"]    
    });

    const getSGs=async()=>{
        try {
            const res=await mysgAPI.getSGs();
            const joined=res.joined_sg
            const other=res.other_sg
            setAll_joinedSG(res.joined_sg);
            setAll_otherSG(res.other_sg);
            setSkimmed_joinedSG(res.joined_sg);
            setSkimmed_otherSG(res.other_sg);
            setUserID(res.userID);
            getTags(other.concat(joined))
        } catch (error) {
            if (error?.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
    }
    const getTags=(sgs)=>{
        const t=[]
        for(let i=0;i<sgs?.length;i++){
            for(let j=0;j<sgs[i].tags?.length;j++){
                if(!t.includes(sgs[i].tags[j])){
                    t.push(sgs[i].tags[j])
                }
            }
        }
        setTags(t)
        setFilterT(t)
    }
    const setSearchSG=(searchKey)=>{
        if (searchKey?.trim()){
            setSkimmed_joinedSG(search_joined.search(searchKey))
            setSkimmed_otherSG(search_other.search(searchKey))
        }
        else{
            setSkimmed_joinedSG(all_joinedSG);
            setSkimmed_otherSG(all_otherSG);
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
    const leaveSG=async(sg_id)=>{
        try {
            await mysgAPI.leaveSG(sg_id);
            getSGs();
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
    const handleFilter = (event, newFormats) => {
        setFilterT(newFormats);
        console.log('tags reset')
      };
    
    function hasTag(sg_t){
        console.log(sg_t)
        console.log(tags)
        for(let i=0;i<sg_t.length;i++){
            if(filterT.includes(sg_t[i])){
                console.log('true')
                return true;
            }
        }
        console.log('false')
        return false;
    }
    useEffect(()=>{
        getSGs();
    },[])

    return(
        <main>
            <ThemeProvider theme={theme}>
                <CssBaseline>
            {/* Search and Filters */}
                <Box 
                sx={{
                    // border: 2,
                    // borderColor: 'secondary.main',
                    // borderStyle:'dotted',
                    // borderRadius: 3,
                    display:'flex',
                flexDirection: 'column',
                alignItems:"center",
                justifyContent:"center"}}
                >
                    <TextField size='large' placeholder="Search a subgreddiit by it's name" onChange={(e)=>setSearchSG(e.target.value)} sx={{width: 270}}></TextField>
                    <br></br><h3>Filter by Tag</h3>
                    <ToggleButtonGroup
                    value={filterT}
                    onChange={handleFilter}
                    sx={{fontFamily: 'sans-serif'}}
                    aria-label='select or deselect a tag'
                    >
                        {
                        tags?.map((tag)=>
                        <ToggleButton value={tag} onClick={()=>{console.log(filterT)}}>
                            {tag}
                        </ToggleButton>
                        )
                        }
                    </ToggleButtonGroup>
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
                            skimmed_joinedSG?.map((elem)=><>
                            {
                            (hasTag((elem.item?elem.item:elem).tags))&&
                            <Box
                                sx={{
                                    backgroundColor: 'white',
                                    borderTop:1,
                                    borderBottom:1,
                                    borderColor: 'secondary.main',
                                    p: 2
                                }}
                                >
                                <Box onClick={()=>gotoSG((elem.item?elem.item:elem)._id)}>
                                <h3>{(elem.item?elem.item:elem).name}</h3>
                                <p>{(elem.item?elem.item:elem).desc}</p>
                                <ul>
                                    <li>Followers: {(elem.item?elem.item:elem).followers?.length||0}</li>
                                    <li>Posts:{(elem.item?elem.item:elem).posts?.length||0}</li>
                                    <li>Banned words: &nbsp;
                                        {
                                        (elem.item?elem.item:elem).banned?.join(', ')
                                        }
                                    </li>
                                </ul>
                                </Box>
                                <button type='submit' onClick={()=>leaveSG((elem.item?elem.item:elem)._id)} disabled={(elem.item?elem.item:elem).mod===userID}>Leave</button>
                            </Box>}
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
                            skimmed_otherSG?.map((elem)=><>
                            {(hasTag((elem.item?elem.item:elem).tags))&&
                            <Box
                                sx={{
                                backgroundColor: 'white',

                                    borderTop:1,
                                    borderBottom:1,
                                    borderColor: 'secondary.main',
                                    p: 2
                                }}>
                                <h3>{(elem.item?elem.item:elem).name}</h3>
                                <p>{(elem.item?elem.item:elem).desc}</p>
                                <ul>
                                    <li>Followers: {(elem.item?elem.item:elem).followers?.length || 0}</li>
                                    <li>Posts:{(elem.item?elem.item:elem).posts?.length || 0}</li>
                                    <li>Banned words: &nbsp;
                                        {
                                        (elem.item?elem.item:elem).banned?.join(', ')
                                        }
                                    </li>
                                </ul>
                                <br></br>
                                <button type='button' onClick={()=>joinSG((elem.item?elem.item:elem)._id)}>Join</button>
                            </Box>}
                            </>)
                        }

                </Box>
                </CssBaseline>
            </ThemeProvider>


        </main>
    )
}