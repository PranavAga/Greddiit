import api from './api';

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
    async upVote(post_id){
        try {
            const res= await api.post('/api/posts/upvote',{body:{post_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async remupVote(post_id){
        try {
            const res= await api.post('/api/posts/remupvote',{body:{post_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async downVote(post_id){
        try {
            const res= await api.post('/api/posts/downvote',{body:{post_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async remdownVote(post_id){
        try {
            const res= await api.post('/api/posts/remdownvote',{body:{post_id}});
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async addComment(comment,post_id){
        try {
            await api.post('/api/posts/addcomment',{body:{comment,post_id}});
            return
        } catch (error) {
            throw error.response.data;
        }
    },
    async getAllComments(post_id){
        try {
            const res= await api.get('/api/posts/getallcomments/'+post_id);
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async savePost(post_id){
        try {
            const res=await api.post('/api/posts/savepost',{body:{post_id}});
            return res?.data
        } catch (error) {
            throw error.response.data;
        }
    },
    async unsavePost(post_id){
        try {
            const res=await api.post('/api/posts/unsavepost',{body:{post_id}});
            return res?.data
        } catch (error) {
            throw error.response.data;
        }
    },
    async getSavedPosts(sg_id){
        try {
            const res= await api.get('/api/posts/getsavedposts/'+sg_id);
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    async getUserSavedPosts(){
        try {
            const res= await api.get('/api/posts/getusersavedposts');
            return res?.data;
        } catch (error) {
            throw error.response.data;
        }
    },
}

export default Posts;