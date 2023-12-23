import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectUpdatedItem } from '@/redux/crud/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';
import { useWebSocket } from '../../context/WebSocketContext';

export default function UpdateForm({ config, formElements }) {
	let { entity } = config;
	const dispatch = useDispatch();
	const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
	const { stompClient } = useWebSocket();
	const { state, crudContextAction } = useCrudContext();
	const { panel, collapsedBox, readBox } = crudContextAction;

	const [form] = Form.useForm();

	const onSubmit = async (fieldsValue) => {
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
					birthday: fieldsValue['date'].format('DD/MM/YYYY'),
				};
			}
		}
		console.log('fieldsValue', fieldsValue);
		const id = current.userId;
		const createdData = await dispatch(crud.update(entity, id, fieldsValue));
		// 	console.log('Created data:', createdData);
		// 	console.log('entity', entity);
		// 	console.log('fieldsValue', fieldsValue);
		// 	if (entity === 'v1/admin/userManager') {
		// 		console.log('notify');
		// 		const notify = {
		// 			content: `Có một thông báo mới từ quản trị viên hệ thống`,
		// 			link: `/post/${createdData?.postId}`,
		// 			isRead: false,
		// 		};
		// 		stompClient.send('/app/adminNotify', {}, JSON.stringify(notify));
		// 	}
		// };
	};
	useEffect(() => {
		if (current) {
			if (current.birthday) {
				current.birthday = dayjs(current.birthday);
			}
			if (current.date) {
				current.date = dayjs(current.date);
			}
			form.setFieldsValue(current);
		}
	}, [current]);

	useEffect(() => {
		if (isSuccess) {
			readBox.open();
			collapsedBox.open();
			panel.open();
			form.resetFields();
			dispatch(crud.resetAction('update'));
			dispatch(crud.list(entity));
		}
	}, [isSuccess]);

	const { isEditBoxOpen } = state;

	const show = isEditBoxOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
	return (
		<div style={show}>
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
		</div>
	);
}
