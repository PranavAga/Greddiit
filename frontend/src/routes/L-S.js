import React,{Fragment,useState, useEffect} from 'react';
import {Navigate, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TabPanel } from '@mui/lab';
import TabContext from "@mui/lab/TabContext";
import {Box} from '@mui/system';
import {Theme} from './util/ColorTheme.js';
import { ThemeProvider } from '@mui/material/styles';
import loginAPI from '../api/login';
import regAPI from '../api/reg';
import axios from 'axios';
export default function App(){
    const theme=Theme;
    const [ tab,setTab]=useState('login');
    const navigate=useNavigate();
    //Essential login params
    const [usname,setUsname]=useState('');
    const [pword,setPword]=useState('');
    const [ldisable,setLdisable]=useState(true);

    //Essesntial registration params
    const [nusname,setNusname]=useState('');
    const [npswd,setNpswd]=useState('');
    const [nfname,setNfname]=useState('');
    const [nemail,setNemail]=useState('');
    const [nage,setNage]=useState();
    const [nlname,setNlname]=useState();
    const [ncont,setNcont]=useState();
    const [rdisable,setRdisable]=useState(true);
    
    //prevent form->submit from reloading page
    const lform=document.getElementById('login');
    function handleLform(e){e.preventDefault()};
    lform?.addEventListener('submit',handleLform);
    const rform=document.getElementById('reg');
    function handleRform(e){e.preventDefault()};
    rform?.addEventListener('submit',handleRform);
    
    
    //LOGIN BUTTON
    const SubmitLogin=()=>{
        return <button type='submit' disabled={ldisable}>Submit</button>
    }
    //REG BUTTON
    const SubmitReg=()=>{
        return <button type='submit' disabled={rdisable}>Register</button>
    }
    //Tab change
    function handleTChange(event,newValue){
        setTab(newValue);// event is the prop of onChange
    }
    const loginSucess=(token)=>{
        localStorage.setItem('token',token);
        localStorage.setItem('isAuth','true');
        axios.defaults.headers.common['x-auth-token']=token;
        // console.log('login sucess');
        navigate('/');
    }
    //Handle submitted data
    const  handleLogin =async(e)=>{
        const prev=ldisable;
        setLdisable(true);
        const check_sp=/\s/;
        const uname=document.getElementById('username').value
        const pswd=document.getElementById('pswd').value
        if (check_sp.test(uname)){
            alert('Invalid Username')
        }
        else{
            try {
                const res=await loginAPI.login(uname,pswd);
                loginSucess(res.token);
                /*navigate to Home Page */
            } catch (error) {
                // console.log(error);
                if (error.errors[0]){
                    alert(error.errors[0].msg);
                }
                else{
                console.error(error);
                }
            }
        }
        setLdisable(prev);
        // else if (uname==='admin'&& pswd==='admin') {
        //     localStorage.setItem('logged','true');
        //     navigate('/MyProfile');
        //     e.preventDefault();
    
    }
    const handleReg=async(e)=>{
        const prev=rdisable;
        setRdisable(true);
        const uname=document.getElementById('nusername')?.value;
        const fname=document.getElementById('nfname').value;
        const lname=document.getElementById('nlname').value;
        const pswd=document.getElementById('npswd').value;
        const contact=document.getElementById('ncontact').value;
        const age=document.getElementById('nage').value;
        const email=document.getElementById('nemail').value;
        // console.log(uname,pswd,fname,email,lname,age,contact);
        try {
            const res= await regAPI.reg(uname,pswd,fname,email,lname,age,contact);
            loginSucess(res.token);
        } catch (error) {
            if (error.errors[0]){
                alert(error.errors[0].msg);
            }
            else{
             console.error(error);   
            }
        }
        setRdisable(prev);
    }

    //check login params
    useEffect(()=>{
        const check_sp=/\s/;
        // const check_char=/\w/;
        if (pword?.trim() && !check_sp.test(pword)
            && usname?.trim() && !check_sp.test(usname)
            ){
            setLdisable(false);
        }
        else{
            setLdisable(true);
        }
    },[pword,usname]);

    //check reg params
    useEffect(()=>{
        const check_sp=/\s/;
        const email=document.getElementById('nemail');
        // const age=document.getElementById('nage');
        const cont=document.getElementById('ncontact');

        const isEmailvalid=email?.checkValidity();
        const isContValid=cont?.checkValidity();
        // const isAgeValid=age?.checkValidity();

        if(isEmailvalid
            && nfname?.trim() && !check_sp.test(nfname)
            && npswd?.trim() && !check_sp.test(npswd)
            && nusname?.trim() && !check_sp.test(nusname)
            && (isContValid||!cont)
            ){
            setRdisable(false);
        }
        else{
            setRdisable(true);
        }
    },[nemail,nfname,npswd,nusname,nage,ncont,nlname]);

    let logged=localStorage.getItem('isAuth');
    if (logged==='true'){
        return <Navigate to='/'/>
    }
    else{
        return(
            <Fragment>
                <ThemeProvider theme={theme}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundImage: "url('/logo.png')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}>
                
            <Box
                sx={{
                    border: 2,
                    borderColor: '#eb5834',
                    backgroundColor:'#f7eeeb' ,
                    opacity: 0.95,
                    borderRadius:1
                }}
            >
                {/* <img src='logo.png' alt='Logo'></img> */}
                <h1 >&nbsp; Welcome to Greddiit !&nbsp;</h1>
                
                <br></br>
                <TabContext value={tab}>
                <Box sx={{mx: 'auto'}}>                
                    <Tabs textColor='primary' value={tab} onChange={handleTChange} aria-label="Sign-up/Log-in">
                    <Tab label="Login" value ="login"></Tab>
                    <Tab label="Registration" value="reg"></Tab>
                    </Tabs>
                </Box>
                <TabPanel value='reg'>
                    <div>
                        <form id='reg' 
                        onSubmit={handleReg}
                        >
                        <table border ="0">
                            <tbody>
                                <tr>
                                    <td>
                                    First Name* :
                                    </td>
                                    <td>
                                    <input type='text'onChange={(e)=>setNfname(e.target.value)} required id='nfname' ></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Last Name:
                                    </td>
                                    <td>
                                    <input onChange={(e)=>setNlname(e.target.value)} type='text' id='nlname'></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Email ID* :
                                    </td>
                                    <td>
                                        <input type='email' id='nemail' required onChange={(e)=>setNemail(e.target.value)}></input>
                                    </td>
                                </tr>
                            <tr>
                                <td>Username* :</td>
                                <td><input type='text'onChange={(e)=>setNusname(e.target.value)} required id='nusername' ></input></td>
                            </tr>
                            <tr>
                                <td>Password* :</td>
                                <td><input type='password'onChange={(e)=>setNpswd(e.target.value)} required id='npswd' ></input></td>   
                            </tr>
                            <tr>
                                    <td>
                                    Age:
                                    </td>
                                    <td>
                                        <input type='number' id='nage' min='1' placeholder='Select a number' onChange={(e)=>setNage(e.target.value)} ></input>
                                    </td>
                            </tr>
                            <tr>
                                    <td>
                                        Contact:
                                    </td>
                                    <td>
                                        <input onChange={(e)=>setNcont(e.target.value)} type='tel' id='ncontact' 
                                        pattern="^[\+][0-9]{2}-[0-9]{10}$" 
                                        placeholder='+01-2345678910'></input>
                                    </td>
                            </tr>
                            <tr><td colSpan={2}>Space is only accepted in Last Name <br></br>*Required</td></tr>
                            <tr>
                                <td ><SubmitReg/></td>
                            </tr>
                            </tbody>
                        </table>
                    </form>
                    </div>
                </TabPanel>
                <TabPanel value='login'>
                    <div>
                    <form id='login' onSubmit={handleLogin}>
                        <table border ="0">
                            <tbody>
                            <tr>
                                <td>Username:</td>
                                <td><input type='text' required id='username' onChange={(event)=>setUsname(event.target.value)}></input></td>
                            </tr>
                            <tr>
                                <td>Password:</td>
                                <td><input type='password' required id='pswd' onChange={(event)=>setPword(event.target.value)}></input></td>   
                            </tr>
                            <tr>
                                <td ><SubmitLogin/></td>
                                {/* style={{display: 'flex',justifyContent: 'center' }} colSpan={2} */}     
                            </tr>
                            </tbody>
                        </table>
                    </form>
                    </div>
                </TabPanel>
                </TabContext>
            </Box>
            </div>
            </ThemeProvider>
            </Fragment>
        )
        }
}

