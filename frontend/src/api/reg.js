import api from './api';

const regiSTER={
    async reg(uname,password,fname,email,lname,age,contact){
        try {
            const res=await api.post('/api/reg',{body: {uname,password,fname,email,lname,age,contact}});
            // console.log('res reg',res);
            return res.data;
        } catch (e) {
            throw e.response.data;
        }
    }
}
export default regiSTER;