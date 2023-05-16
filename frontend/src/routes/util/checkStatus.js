import {useNavigate} from 'react-router-dom';
import React, { useEffect } from 'react';
export default function IsAuth(){
    
    const navigate=useNavigate();
    useEffect(()=>{
        
        const isAuth=localStorage.getItem('isAuth');
        if (!isAuth){
            navigate('/LS');
        }
    },[])
    
}