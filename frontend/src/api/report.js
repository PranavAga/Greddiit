import api from './api';

const Report={
    async reportPost(post_id,concern){
        try {
            await api.post('/api/report/create',{body:{post_id,concern}});
        } catch (error) {
            throw error.response.data;
        }
    },
    async getReports(id){
        try {
            const res=await api.get('/api/report/getallreports/'+id);
            return res?.data;
        } catch (e) {
            throw e.response.data;
        }
    },
    async block(report_id,sg_id){
        try {
            await api.post('/api/report/block',{body:{report_id,sg_id}});
        } catch (error) {
            throw error.response.data;
        }
    },
    async delete(report_id,sg_id){
        try {
            await api.post('/api/report/delete',{body:{report_id,sg_id}});
        } catch (error) {
            throw error.response.data;
        }
    },
    async ignore(report_id,sg_id){
        try {
            await api.post('/api/report/ignore',{body:{report_id,sg_id}});
        } catch (error) {
            throw error.response.data;
        }
    }
}

export default Report