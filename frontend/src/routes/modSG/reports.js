import {Box} from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { useEffect, useState,createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

import {Theme} from '../util/ColorTheme.js';
import reportAPI from '../../api/report.js';

const BlockButtonContext = createContext();
const BlockButton = () => {
    const navigate=useNavigate();

    const { id, report,setReports } = useContext(
      BlockButtonContext
    );
    const [isBlocked, setIsBlocked] = useState(false);
    const [countdown, setCountdown] = useState(3);
  
    useEffect(() => {
      let timerId;
  
      if (isBlocked) {
        timerId = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
      }
  
      return () => {
        clearInterval(timerId);
      };
    }, [isBlocked]);
  
    useEffect(() => {
      if (countdown === 0) {
        handleBlock(report._id);
      }
    }, [countdown,report]);
  
    const handleBlockClick = () => {
      setIsBlocked(true);
    }
    const handleCancelClick = () => {
      setIsBlocked(false);
      setCountdown(3);
    }

    async function handleBlock(report_id){
        try {
            await reportAPI.block(report_id,id)
            getAllReports()
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    async function getAllReports(){
        try {
            const res=await reportAPI.getReports(id)
            setReports(res)
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    return (
      <div>
        {!isBlocked ? (
          <button onClick={handleBlockClick}>Block</button>
        ) : (
          <button onClick={handleCancelClick}>
            Cancel in {countdown} secs
          </button>
        )}
      </div>
    );
  };

export default function Reports(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;
    const navigate=useNavigate();

    const[reports,setReports]=useState([])
    
    async function getAllReports(){
        try {
            const res=await reportAPI.getReports(id)
            setReports(res)
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    
    async function handleDelete(report_id){
        try {
            await reportAPI.delete(report_id,id)
            getAllReports()
        } catch (error) {
            if (error.errors[0]){
                return navigate('/');
            }
            else{
             console.error(error);   
            }
        }
    }
    async function handleIgnore(report_id){
        try {
            await reportAPI.ignore(report_id,id)
            getAllReports()
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
        getAllReports()
    },[])
    
    return(
        <ThemeProvider theme={theme}>
            <CssBaseline>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:"center"
                }}
            > 
                {
                reports?.map((report)=>(
                    <Box 
                    sx={{
                        border:1,
                        borderRadius:2,
                        borderColor:'secondary.main',
                        backgroundColor:'white',
                        p:2,
                        m:1
                    }}>
                        <i>Reported by {report.reporter.uname}</i><br></br>
                        <b>Post Creator:&nbsp;</b> {report.post.creator.uname} <br></br>
                        <p>
                        <b>Post Content:</b><br></br>
                        {report.post.content}</p>
                        <b>Concern:</b>{report.concern} <br></br><br></br>
                        {
                            report.status.value===0?//not handled
                            <div>
                                <BlockButtonContext.Provider
                                value={{id, report,setReports }}
                                >
                                    <BlockButton />
                                </BlockButtonContext.Provider>                                
                                <button onClick={()=>handleDelete(report._id)} disabled={false}>Delete</button>&nbsp;
                                <button onClick={()=>handleIgnore(report._id)} disabled={false}>Ignore</button>
                            </div>
                            :
                            report.status.value===3?//ignored
                            <div>
                                <b>Status:&nbsp;</b>Ignored
                            </div>
                            :
                            report.status.value===1?//blocked
                            <div>
                                <b>Status:&nbsp;</b>Blocked the creator
                            </div>
                            :
                            <div>
                                <b>Status:&nbsp;</b>Post deleted
                            </div>
                        }
                    </Box>
                ))
                }

            </Box>
            </CssBaseline>
        </ThemeProvider>
    )

}