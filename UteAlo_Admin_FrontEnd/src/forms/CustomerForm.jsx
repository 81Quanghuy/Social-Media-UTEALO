import React from 'react';
import { Button, Form, Input, Select } from 'antd';
import { DatePicker } from '@/components/CustomAntd';

export default function CustomerForm({ isUpdateForm = false }) {
	const { Option } = Select;

	return (
		<>
			{isUpdateForm && (
				<>
					<Form.Item
						label="Họ và tên"
						name="userName"
						rules={[
							{
								required: true,
								message: 'Please input your company name!',
							},
						]}
					>
						<Input disabled />
					</Form.Item>

					<Form.Item
						name="phone"
						label="Số điện thoại"
						rules={[
							{
								pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
								message: 'Số điện thoại không hợp lệ!',
							},
						]}
					>
						<Input disabled />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!',
							},
							{
								required: true,
								message: 'Please input your E-mail!',
							},
						]}
					>
						<Input disabled />
					</Form.Item>
					<Form.Item
						name="roleName"
						label="Vai trò"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn vai trò!',
							},
						]}
					>
						<Select disabled>
							<Option value="SinhVien">Sinh viên</Option>
							<Option value="GiangVien">Giảng viên</Option>
							<Option value="Admin">Quản trị viên</Option>
							<Option value="PhuHuynh">Phụ huynh</Option>
							<Option value="NhanVien">Nhân viên</Option>
						</Select>
					</Form.Item>
				</>
			)}

			{!isUpdateForm && (
				<>
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
						<Input />
					</Form.Item>
					<Form.Item
						label="Ngày sinh"
						name="dayOfBirth"
						style={{
							display: 'inline-block',
							width: 'calc(50%)',
							paddingRight: '5px',
						}}
					>
						<input type="date" name="dayOfBirth" placeholder="dd/mm/yyyy" />
					</Form.Item>
					<Form.Item
						label="Giới tính"
						name="gender"
						style={{
							display: 'inline-block',
							width: 'calc(50%)',
							paddingLeft: '5px',
						}}
					>
						<Select>
							<Option value="Nam">Nam</Option>
							<Option value="Nữ">Nữ</Option>
							<Option value="Khác">Khác</Option>
						</Select>
					</Form.Item>
					<Form.Item name="phone" label="Số điện thoại">
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="Email"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập email!',
							},
							{
								type: 'email',
								message: 'Email không hợp lệ!',
							},
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="roleName"
						label="Vai trò"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn vai trò!',
							},
							// Kiểm tra nếu email là @student.hcmute.edu.vn thì mới có thể là  sinh viên và không thể là giảng viên
							// Kiểm tra nếu email là @hcmute.edu.vn thì không ko được là sinh viên
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!getFieldValue('email').includes('@student.hcmute.edu.vn')) {
										if (getFieldValue('roleName') == 'SinhVien') {
											return Promise.reject('Email không thể là ' + value + '!');
										}
										return Promise.resolve();
									}
									if (!getFieldValue('email').includes('@hcmute.edu.vn')) {
										if (getFieldValue('roleName') == 'GiangVien') {
											return Promise.reject('Email không thể là giảng viên!');
										}
										return Promise.resolve();
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<Select>
							<Option value="SinhVien">Sinh viên</Option>
							<Option value="GiangVien">Giảng viên</Option>
							<Option value="Admin">Quản trị viên</Option>
							<Option value="PhuHuynh">Phụ huynh</Option>
							<Option value="NhanVien">Nhân viên</Option>
						</Select>
					</Form.Item>
				</>
			)}

			<Form.Item
				name="isActive"
				label="Trạng thái"
				rules={[
					({ getFieldValue }) => ({
						validator(_, value) {
							if (getFieldValue('isActive') == 'Hoạt động' || getFieldValue('isActive') == 'Bị khóa') {
								return Promise.reject('Vui lòng chọn trạng thái!');
							}
							return Promise.resolve();
						},
					}),
				]}
			>
				<Select defaultValue={true}>
					<Option value={false}>Bị khóa</Option>
					<Option value={true}>Hoạt động</Option>
				</Select>
			</Form.Item>
		</>
	);
}
