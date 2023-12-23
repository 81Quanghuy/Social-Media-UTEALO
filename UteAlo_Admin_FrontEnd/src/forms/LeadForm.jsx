import { Form, Input, Select } from 'antd';
import vietnamProvinces from '../../src/utils/vietnamProvinces.json';
import TextArea from 'antd/lib/input/TextArea';

export default function LeadForm({ isUpdateForm = false }) {
	const { Option } = Select;
	return (
		<>
			<Form.Item label="Vị trí" name="location">
				<Select placeholder="Chọn địa điểm">
					{vietnamProvinces.map((location) => (
						<Option key={location.id} value={location.name}>
							{location.name}
						</Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				name="content"
				label="Nội dung"
				rules={[
					({ getFieldValue }) => ({
						validator(_, value) {
							const filesValue = getFieldValue('files');
							const photosValue = getFieldValue('photos');
							if (!value && !filesValue && !photosValue) {
								return Promise.reject(
									new Error('Xin hãy nhập nội dung hoặc chọn ít nhất một trường khác!')
								);
							}
							return Promise.resolve();
						},
					}),
				]}
			>
				<TextArea />
			</Form.Item>

			{/* <Form.Item
				name="files"
				label="Tệp"
				rules={[
					({ getFieldValue }) => ({
						validator(_, value) {
							const contentValue = getFieldValue('content');
							const photosValue = getFieldValue('photos');
							if (!contentValue && !photosValue && !value) {
								return Promise.reject(new Error('Xin hãy chọn tệp hoặc chọn ít nhất một trường!'));
							}
							return Promise.resolve();
						},
					}),
				]}
			>
				<input type="file" accept=".pdf,.doc,.docx,.txt" />
			</Form.Item> */}

			{/* <Form.Item
				label="Hình ảnh"
				name="photos"
				rules={[
					({ getFieldValue }) => ({
						validator(_, value) {
							const contentValue = getFieldValue('content');
							const filesValue = getFieldValue('files');
							if (!contentValue && !filesValue && !value) {
								return Promise.reject(new Error('Xin hãy chọn hình ảnh hoặc chọn ít nhất một trường!'));
							}
							return Promise.resolve();
						},
					}),
				]}
			>
				<input type="file" accept="image/*" />
			</Form.Item> */}
		</>
	);
}
