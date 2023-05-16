import {useEffect} from 'react';


export default function Authrem(){
    useEffect(()=>{
        localStorage.removeItem('isAuth');
        console.log('removing isAuth');
      },[]);
}
