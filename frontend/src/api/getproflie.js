import api from './api';

const getProfile={
    async default(){
        try {
            const res=await api.get('/api/profile');
            return res.data;
        } catch (e) {
            throw e.response.data;
        }
    },
    async update(uname,oldpassword,newpassword,fname,email,lname,age,contact){
        try {
            const res=await api.post('/api/profile',{body: {uname,oldpassword,newpassword,fname,email,lname,age,contact}});
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getFollowers(){
        try {
            const res=await api.get('/api/profile/getfollowers');
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getFollowing(){
        try {
            const res=await api.get('/api/profile/getfollowing');
            return res.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async remFollower(id){
        try {
            await api.post('/api/profile/remfollower',{body:{id}});
        } catch (error) {
            throw error.response.data;
        }
    }
}
export default getProfile; 