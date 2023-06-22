import api from './api';
import axios from 'axios';
const mySG={
    async create(formData){
        try {
            const res=await axios.post('http://localhost:4000/api/sg/create',formData,
            {headers:{'Content-Type': 'multipart/form-data'}}
            );
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
            await api.post('/api/sg/del',{body:{id}});
            return
        } catch (error) {
            throw error.response.data;
        }
    },
    async acceptUser(id,user_id){
        try {
            const res=await api.post('/api/sg/mod/accept',{body:{id,user_id}});
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    }, 
    async rejectUser(id,user_id){
        try {
            await api.post('/api/sg/mod/reject',{body:{id,user_id}});
            return
        } catch (error) {
            throw error.response.data;
        }
    }, 
    async joinSG(sg_id){
        try {
            await api.post('/api/sg/request',{body:{sg_id}});
            return;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getSG_mod(id){
        try {
            const res= await api.post('/api/sg/mod',{body:{id}});
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getSG_joined(id){
        try {
            const res= await api.post('/api/sg/joined',{body:{id}});
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
    async getReqs(id){
        try {
            const res= await api.post('/api/sg/mod/reqs',{
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
    },
    async leaveSG(sg_id){
        try {
            await api.post('/api/sg/sgs/leave',{body:{sg_id}});
            return;
        } catch (e) {
            throw e.response.data;
        }
    }
}
export default mySG; 