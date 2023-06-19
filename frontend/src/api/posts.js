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
    },
    async getAll(sg_id){
        try {
            const res= await api.get('/api/posts/getall/'+sg_id);
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async upVote(post_id,sg_id){
        try {
            const res= await api.post('/api/posts/upvote',{body:{post_id,sg_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async remupVote(post_id,sg_id){
        try {
            const res= await api.post('/api/posts/remupvote',{body:{post_id,sg_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async downVote(post_id,sg_id){
        try {
            const res= await api.post('/api/posts/downvote',{body:{post_id,sg_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async remdownVote(post_id,sg_id){
        try {
            const res= await api.post('/api/posts/remdownvote',{body:{post_id,sg_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

export default Posts;