import React, { useEffect,useState } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import {Box} from '@mui/system';
import { CssBaseline } from "@mui/material";

import profileAPI from '../api/getproflie';
/*
1. First Name
2. Last Name
3. User Name
4. Email [Unique]
5. Age
6. Contact Number
7. Password
Follow, Followers
Subgreddits owned?
Posts?
*/
export default function MyProfile(){
    const theme=Theme;
    const [lock,setLock]=useState(true);
    const [openfs,setOpenfs]=useState(false);
    const [openfg,setOpenfg]=useState(false);
    const [wronginp,setWronginp]=useState(false);    
    
    //User data
    const [nusname,setNusname]=useState();
    const [npswd,setNpswd]=useState();
    const [opswd,setOpswd]=useState();
    const [nfname,setNfname]=useState();
    const [nemail,setNemail]=useState(  );
    const [nage,setNage]=useState();
    const [nlname,setNlname]=useState();
    const [ncont,setNcont]=useState();
    const [nfollowers,setNfollowers]=useState('');
    const [nfollowing,setNfollowing]=useState('');
    const [following,setFollowin]=useState();
    const [followers,setFollowers]=useState();
        //previous values
    const [puname,setPuname]=useState();
    const [pfname,setPfname]=useState();
    const [plname,setPlname]=useState();
    const [pemail,setPemail]=useState();
    const [page,setPage]=useState();
    const [pcont,setPcont]=useState();
    const []=useState();
    const []=useState();
    const []=useState();

    // let pname,pemail,page,pcont,plname,pfname;

    const prevValues=async(e)=>{
        //set buttons disable
        try {
            const user=await profileAPI.default();
            // console.log(user);
            // document.getElementById('nuname').value=user.uname
            setNusname(user.uname);setPuname(user.uname);
            setNfname(user.fname);setPfname(user.fname);
            setNemail(user.email);setPemail(user.email);
            setNlname(user.lname);setPlname(user.lname);
            setNage(user.age);setPage(user.age);
            setNcont(user.contact);setPcont(user.contact);
        } catch (error) {
            console.error(error);
        }
    }
    const getFollowers=async()=>{
        try {
            const res= await profileAPI.getFollowers();
            // console.log(res);
            setFollowers(res);
            setNfollowers(res.length);
            return
        } catch (error) {
            console.error(error);
        }
    }
    const getFollowing=async()=>{
        try {
            const res= await profileAPI.getFollowing();
            setFollowin(res);
            setNfollowing(res.length)
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        prevValues();
        getFollowers();
        getFollowing();
    },[]);

    //checking new input format
    useEffect(()=>{
        const check_sp=/\s/;
        const email=document.getElementById('nemail');
        const cont=document.getElementById('ncontact');
        const isEmailvalid=email?.checkValidity();
        const isContValid=cont?.checkValidity();
        // console.log('checking valid',isContValid)
        if(isEmailvalid
            && nfname?.trim() && !check_sp.test(nfname)
            && nusname?.trim() && !check_sp.test(nusname)
            && (isContValid||!cont)
            && (
                (
                !opswd 
                && !npswd
                ) 
                || 
                (
                opswd?.trim() && !check_sp.test(opswd) 
                && npswd?.trim() && !check_sp.test(npswd)
                )
                )
        ){
            // if ()
            setWronginp(false); 
        }
        else{
            setWronginp(true);
        }
    },[nemail,nfname,nusname,nage,ncont,nlname,opswd,npswd])
    function editable(){
        setLock(curr=>! curr);
    }
    const savechanges=async(e)=>{
        const prev=wronginp;
        setWronginp(true);
        const uname=document.getElementById('nusername').value;
        const fname=document.getElementById('nfname').value;
        const lname=document.getElementById('nlname').value;
        const contact=document.getElementById('ncontact').value;
        const age=document.getElementById('nage').value;
        const email=document.getElementById('nemail').value;
        const oldpassword=document.getElementById('opswd').value;
        const npassword=document.getElementById('npswd').value;
        // console.log(uname,fname,lname,contact,age,email,oldpassword,npassword);
        try {
            const res= await profileAPI.update(uname,oldpassword,npassword,fname,email,lname,age,contact);
            prevValues();
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
        setWronginp(prev);
        setLock(true);
    }
    const revertChanges=(e)=>{
        setNlname(plname);
        setNfname(pfname)
        setNusname(puname);
        setNcont(pcont);
        setNage(page);
        setNemail(pemail);
        setNpswd("");
        setOpswd("");
        setLock(true);
    }
    function openFollowers(){
        setOpenfs(true);
    }
    function closeFs(){
        setOpenfs(false);
    };
    function openFollowing(){
        setOpenfg(true);
    }
    function closeFg(){
        setOpenfg(false);
    };
    async function remFollower(id){
        try {
            await profileAPI.remFollower(id);
            getFollowers();
            getFollowing();
            setOpenfs(false);
            setOpenfg(false);
        } catch (error) {
            if (error.errors?.[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
    }
        return(
            <>
            <ThemeProvider theme={theme}>
                <CssBaseline>
            <h2>Profile</h2>
            {
            (lock)&&
            <button onClick={editable}>Edit</button>}
            {
                
                (!lock)&&<>
                <button type="submit" onClick={savechanges} disabled={wronginp}>Save</button>
                <button onClick={revertChanges} >Back</button>
                </>
            }
            <br></br><br></br>
            
            <form>
                <label>Name</label><br></br>
                <label>*</label><br></br>
                <input type='text' id='nfname' value={nfname} disabled={lock} onChange={(e)=>setNfname(e.target.value)}></input>
                <input id='nlname' value={nlname} disabled={lock} type='text' onChange={(e)=>setNlname(e.target.value)}></input><br></br>
                <br></br>
                <label>User Name*</label><br></br>
                <input type='text' value={nusname }
                onChange={(e)=>setNusname(e.target.value)} required id='nusername' disabled={lock}></input><br></br>
                <br></br>
                <label>Email ID*</label><br></br>
                <input type='email' id='nemail' value={nemail}
                required onChange={(e)=>setNemail(e.target.value)} disabled={lock}></input><br></br>
                <br></br>
                <label>Age</label><br></br>
                <input id='nage' disabled={lock} value={nage}
                type='number' min='1' placeholder='Select a number' onChange={(e)=>setNage(e.target.value)} ></input><br></br>
                <br></br>
                <label>Contact Number</label><br></br>
                <input id='ncontact' disabled={lock} value={ncont}
                onChange={(e)=>setNcont(e.target.value)} type='tel' 
                pattern="^[\+][0-9]{2}-[0-9]{10}$" 
                placeholder='+01-2345678910'></input><br></br>
                <p>Password*</p>
                
                <br></br>
                <p>To change password enter:</p>
                <label>Current password</label>
                <input id='opswd' value={opswd} disabled={lock} type='password' onChange={(e)=>setOpswd(e.target.value)} ></input>
                <br></br>
                <label>New password</label>
                <input id='npswd' value={npswd} disabled={lock} type='password' onChange={(e)=>setNpswd(e.target.value)} ></input>                
                <br></br><br></br>
                <p>Space is only accepted in Last Name <br></br>*Required</p>

                {/* <label> Follow</label>
                <input id='' defaultValue='' disabled={lock}></input><br></br>
                <label> Followers</label>
                <input id='' defaultValue='' disabled={lock}></input><br></br>
                <label> Posts</label>
                <input id='' defaultValue='' disabled={lock}></input><br></br>                 */}
            </form>
            <br></br>
            <button onClick={openFollowers}>Followers: {nfollowers}</button>
            <Menu
                id="followers"
                open={openfs}
                onClose={closeFs}
            >
                {
                    followers?.map((elem)=>
                        <MenuItem >{elem.name} &nbsp;
                        <button onClick={()=>remFollower(elem.id)}>Remove</button>
                        </MenuItem>
                    )
                }
            </Menu>

            <button onClick={openFollowing}>Following: {nfollowing}</button>
            <Menu
                id="following"
                open={openfg}
                onClose={closeFg}
            >
                {
                    following?.map((elem)=>
                        <MenuItem >{elem.name} &nbsp;
                        <button onClick={()=>remFollower(elem.id)}>Unfollow</button>
                        </MenuItem>
                    )
                }
            </Menu>
                {/* <Input></Input> */}
            {/* <br></br><br></br> */}
            
            {/* </Box> */}
            </CssBaseline>
            </ThemeProvider>
            </>
        )
    
}