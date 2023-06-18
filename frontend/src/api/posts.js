import api from './api';
import axios from 'axios';

const Posts={
    async create(title,content,sg_id){
        try {
            const res= await api.post('/api/posts/create',{body:{title,content,sg_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

export default Posts;