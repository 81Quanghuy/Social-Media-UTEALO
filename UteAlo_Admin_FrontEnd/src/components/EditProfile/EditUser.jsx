import { Button, DatePicker, Form, Input, Radio } from 'antd';
import moment from 'moment';
import { useCallback } from 'react';

export default function EditUser({ profileUser, updateUser, setVisibleModalUpdate }) {
	console.log(profileUser);
	const [form] = Form.useForm();
	const style = {
		border: `1px solid #1890ff`,
		borderRadius: '50%',
	};

	return (
		<Form
			layout="vertical"
			form={form}
			initialValues={{
				userName: profileUser?.userName,
				address: profileUser?.address,
				gender: profileUser?.gender,
				phone: profileUser?.phone,
				// dayOfBirth: new Date(),
			}}
			name="info"
			onFinish={() => {
				updateUser(form.getFieldsValue());
				setVisibleModalUpdate({ visible: false, type: '' });
			}}
		>
			<Form.Item
				label="Họ và tên"
				name="userName"
				rules={[
					{
						required: true,
						message: 'Vui lòng nhập họ và tên!',
					},
				]}
			>
				<Input allowClear />
			</Form.Item>
			<Form.Item label="Địa chỉ" name="address">
				<Input allowClear />
			</Form.Item>
			<Form.Item
				label="Giới tính"
				name="gender"
				rules={[
					{
						required: true,
						message: 'Vui lòng chọn giới tính!',
					},
				]}
			>
				<Radio.Group>
					<Radio value="MALE">Nam</Radio>
					<Radio value="FEMALE">Nữ</Radio>
					<Radio value="OTHER">Khác</Radio>
				</Radio.Group>
			</Form.Item>
			<Form.Item
				label="Số điện thoại"
				name="phone"
				rules={[
					{
						required: true,
						message: 'Vui lòng nhập số điện thoại!',
					},
					{
						pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
						message: 'Số điện thoại không hợp lệ!',
					},
				]}
			>
				<Input allowClear />
			</Form.Item>
			<Form.Item label="Ngày sinh" name="dateOfBirth">
				<DatePicker format={'DD/MM/YYYY'} />
			</Form.Item>
			<div>
				<Button className="button--cancel" onClick={() => setVisibleModalUpdate({ visible: false, type: '' })}>
					Hủy
				</Button>
				<Button type="primary" htmlType="submit" style={{ float: 'right' }}>
					Lưu
				</Button>
			</div>
		</Form>
	);
}
