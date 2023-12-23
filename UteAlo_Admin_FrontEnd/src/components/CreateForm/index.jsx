import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectCreatedItem } from '@/redux/crud/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';
import { useWebSocket } from '../../context/WebSocketContext';
export default function CreateForm({ config, formElements }) {
	let { entity } = config;
	const { stompClient } = useWebSocket();
	const dispatch = useDispatch();
	const { isLoading, isSuccess } = useSelector(selectCreatedItem);
	const { crudContextAction } = useCrudContext();
	const { panel, collapsedBox, readBox } = crudContextAction;
	const [form] = Form.useForm();
	const onSubmit = async (fieldsValue) => {
		try {
			if (fieldsValue) {
				if (fieldsValue.birthday) {
					fieldsValue = {
						...fieldsValue,
						birthday: fieldsValue['birthday'].format('DD/MM/YYYY'),
					};
				}
				if (fieldsValue.date) {
					fieldsValue = {
						...fieldsValue,
						date: fieldsValue['date'].format('DD/MM/YYYY'),
					};
				}
			}

			const createdData = await dispatch(crud.create(entity, fieldsValue));
			console.log('Created data:', createdData);
     // kiểm tra fieldsValue là mảng bao gồm 2 giá trị là location và content
     
			if (entity === 'v1/admin/postManager') {
				console.log('notify');
				const notify = {
					content: `Có một thông báo mới từ quản trị viên hệ thống`,
					link: `/post/${createdData?.postId}`,
					isRead: false,
				};
				stompClient.send('/app/adminNotify', {}, JSON.stringify(notify));
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isSuccess) {
			readBox.open();
			collapsedBox.open();
			panel.open();
			form.resetFields();
			dispatch(crud.resetAction('create'));
			dispatch(crud.list(entity));
		}
	}, [isSuccess]);

	return (
		<Loading isLoading={isLoading}>
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				{formElements}
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</Loading>
	);
}
