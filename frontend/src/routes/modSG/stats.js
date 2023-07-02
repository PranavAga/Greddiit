import {Box} from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactEcharts from "echarts-for-react"; 
// import { ECharts } from 'echarts';
import {Theme} from '../util/ColorTheme.js';
import mysgAPI from '../../api/sg';

// var myChart = ECharts.init(dom, null, {
//     renderer: 'canvas',
//     useDirtyRect: false
// });

export default function Stats(){
    const params=useParams();
    const id=params.id;
    const theme=Theme;
    const navigate=useNavigate();

    const[userG,setUserG]=useState([])
    const[postG,setPostG]=useState([])
    const[visitorG,setVisitorG]=useState([])
    const[reports,setReports]=useState([])

    async function getUserG(){
        try {
            const res=await mysgAPI.getStats(id);
            setUserG(res.user);
            setPostG(res.post);
            setVisitorG(res.vis);
            setReports(res.report);
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
        getUserG();
    },[])

    return(
        <main>
            <ThemeProvider theme={theme}>
            <CssBaseline>
                <Box
                sx={{
                    borderRadius:2,
                    backgroundColor:'white',
                    display:'flex',
                    flexDirection: 'column',
                    alignItems:"center",
                    justifyContent:"center"
                }}
                >
                    <ReactEcharts option={(
                        {
                            title: [
                                {
                                  left: '20%',top:'5%',
                                  text: 'Daily joinned users'
                                },
                                {
                                  right: '20%',top:'5%',
                                  text: 'Daily added posts'
                                }
                                ,
                                {
                                  left: '20%',bottom:'47%',
                                  text: 'Daily visitors'
                                },
                                {
                                  right: '20%',bottom:'47%',
                                  text: 'Reports: total: '+(reports?.total)
                                }
                            ],
                            tooltip: {
                              trigger: 'item'
                            },
                            legend:{
                              data:['total users','added posts','visitors']
                            },
                            xAxis: [{
                              type: 'category',
                              data: userG.map(a => a.time)

                            }
                            ,
                            {
                                type: 'category',
                                data: postG.map(a => a.time),
                                gridIndex: 1
                            },
                            {
                                type: 'category',
                                data: visitorG.map(a => a.time),
                                gridIndex: 2
                            }
                            ],
                            yAxis: [
                                {
                            },
                            {
                                gridIndex: 1
                            }
                            ,
                            {
                                gridIndex: 2
                            }
                            ],
                            grid: [
                                { left: '7%', top: '7%', width: '38%', height: '38%' },
                                { right: '7%', top: '7%', width: '38%', height: '38%' },
                                { left: '7%', bottom: '7%', width: '38%', height: '38%' },
                                { right: '7%', bottom: '7%', width: '38%', height: '38%' }
                            ],
                            series: [
                              {
                                name:'total users',
                                data: userG.map(a => a.count),
                                type: 'line'
                              },
                              {
                                name: 'added posts',
                                data: postG.map(a => a.count),
                                type: 'line',
                                xAxisIndex: 1,
                                yAxisIndex: 1
                              },
                              {
                                name:'visitors',
                                data: visitorG.map(a => a.count),
                                type: 'line',
                                xAxisIndex: 2,
                                yAxisIndex: 2
                              },
                              {
                                type: 'pie',
                                center: ['73%','73%'],
                                radius:'40%',
                                data:[
                                  {value:(reports?.deleted),name: "Deleted"},
                                  {value:(reports?.total-reports?.deleted),name: "Other"}
                                ]
                              }
                            ]
                        }
                    )} style={{ width: "1200px", height: "1500px" }}/>
                </Box>
            </CssBaseline>
            </ThemeProvider>
        </main>
    )
}