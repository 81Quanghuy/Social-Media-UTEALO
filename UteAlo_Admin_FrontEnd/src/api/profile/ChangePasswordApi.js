import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
const ChangePasswordApi = {
	changePassword: async (data, token) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.put(`${API_BASE_URL}v1/user/change-password`, data, config);

			if (res.data.success) {
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		} catch (err) {
			throw new Error(err.response ? err.response.data.message : err.message);
		}
	},
};
export default ChangePasswordApi;
