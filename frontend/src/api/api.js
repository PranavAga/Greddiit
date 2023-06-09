import axios from 'axios';

const getData=(payload)=>{
    if (payload){
        return {'Content-Type':'application/json'};
    }
    return {};
}
const api ={
    get(uri){
        return axios.get("http://localhost:4000"+uri);
    },
    post(uri,payload){
        return axios.post("http://localhost:4000"+uri,payload.body,getData(payload));
    },
    postFrom(uri,payload){
        return axios.post("http://localhost:4000"+uri,payload);
    },
    delete(uri,payload){
        return axios.delete("http://localhost:4000"+uri,payload);
        // return axios.get()
    } ,
    // getuser  
}
export default api;