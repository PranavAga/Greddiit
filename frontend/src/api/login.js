import api from './api';

const logIN={
    async login(uname,password){
        try {
            const res=await api.post('/api/login',{body: {uname,password}});
            return res.data;
        } catch (e) {
            throw e.response.data;
            //axios thing
        }
    }
}
export default logIN;