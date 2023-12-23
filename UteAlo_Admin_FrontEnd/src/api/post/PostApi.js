import axios from 'axios';
import Api from '../Api';
import { API_BASE_URL } from '@/config/serverApiConfig';
const PostApi = {
	findById: async ({ user, reportId }) => {
		console.log('reportId', reportId);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.accessToken}`,
				},
			};
			const res = await axios.get(`${API_BASE_URL}v1/report/get/${reportId}`, config);
			return res.data.result;
		} catch (error) {
			throw new Error(error?.response ? error.response.data.message : error.message);
		}
	},
};
export default PostApi;
