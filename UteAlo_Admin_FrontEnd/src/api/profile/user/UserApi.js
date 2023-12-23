import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
const UserApi = {
	uploadExcel: async ({ data, token }) => {
		console.log('data', data);
		console.log('token', token);
		const formData = new FormData();
		formData.append('file', data);
		try {
			const config = {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.post(`${API_BASE_URL}v1/admin/userManager/uploadExcel`, formData, config);	
			return res;
		} catch (err) {
			return err.response ? err.response.data.message : err.message;
		}
	},
};
export default UserApi;
