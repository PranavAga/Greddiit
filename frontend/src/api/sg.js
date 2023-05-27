import api from './api';

const mySG={
    async create(name,desc,tags,banned){
        try {
            const res=await api.post('/api/sg/create',{body:{name,desc,tags,banned}});
            return res.data;
        } catch (e) {
            throw e.response.data;
        }
    },
    async getmy(){
        try {
            const res=await api.get('/api/sg/mysgs');
            return res.data;
        } catch (e) {
            throw e.response.data;
        }
    },
    async delSG(id){
        try {
            const res=await api.post('/api/sg/del',{body:{id}});
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getSG_mod(id){
        try {
            const res= await api.post('/api/sg/mod',{body:{id}});
            // console.log('getSg api',res);
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getUsers(id){
        try {
            const res= await api.post('/api/sg/mod/users',{
                body:{id}
            });
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getSGs(){
        try {
            const res=await api.get('/api/sg/sgs');
            return res.data;
        } catch (e) {
            throw e.response.data;
        }
    }
}
export default mySG; 