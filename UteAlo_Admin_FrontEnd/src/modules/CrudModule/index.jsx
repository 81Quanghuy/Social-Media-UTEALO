import React, { useLayoutEffect, useState } from 'react';
import { Row, Col, Button, Upload, notification, message } from 'antd';

import CreateForm from '@/components/CreateForm';
import UpdateForm from '@/components/UpdateForm';
import DeleteModal from '@/components/DeleteModal';
import ReadItem from '@/components/ReadItem';
import SearchItem from '@/components/SearchItem';

import { useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';

import { CrudLayout } from '@/layout';

import CrudDataTable from './CrudDataTable';
import { UploadOutlined } from '@ant-design/icons';
import UserApi from '../../api/profile/user/UserApi';
import { token as tokenCookies } from '@/auth';
function SidePanelTopContent({ config, formElements }) {
	return (
		<>
			<ReadItem config={config} />
			<UpdateForm config={config} formElements={formElements} />
		</>
	);
}

function FixHeaderPanel({ config }) {
	const [fileList, setFileList] = useState([]);
	const [uploading, setUploading] = useState(false);

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('file', fileList[0]);
		console.log('fileList[0]', fileList[0]);
		console.log(formData);
		setUploading(true);
		const res = await UserApi.uploadExcel({ data: fileList[0], token: tokenCookies.get() });
		console.log('res', res);
		if (res?.data?.success) {
			notification.success({
				message: 'Tải lên thành công',
				description: res?.data.message,
				placement: 'topRight',
			});
		} else {
			notification.error({
				message: 'Tải lên thất bại',
				description: res,
				placement: 'topRight',
			});
		}

		setFileList([]);

		setUploading(false);
	};

	const isExcelFile = (file) => {
		return (
			file.type === 'application/vnd.ms-excel' || // for older Excel formats
			file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		); // for newer Excel formats
	};
	const props = {
		onRemove: () => {
			setFileList([]);
		},
		beforeUpload: (file) => {
			if (!isExcelFile(file)) {
				notification.error({
					message: 'Không hợp lệ',
					description: 'Chỉ cho phép tải lên các tệp tin Excel!',
					placement: 'topRight',
				});
			} else {
				setFileList([file]);
			}
			return false;
		},
		fileList,
		maxCount: 1,
	};
	return (
		<div className="box">
			<Row gutter={12}>
				<Col className="gutter-row" span={21}>
					<h1 style={{ fontSize: 20, marginBottom: 20 }}>{config.panelTitle}</h1>
				</Col>
			</Row>
			<Row gutter={8}>
				<Col className="gutter-row" span={24}>
					<SearchItem config={config} />
				</Col>
			</Row>
			{config.uploadFile && (
				<>
					<Row gutter={12}>
						<Col className="gutter-row" span={21}>
							<h1 style={{ fontSize: 16, marginTop: 20, marginBottom: 8 }}>
								Thêm thông tin người dùng bằng file excel
							</h1>
						</Col>
					</Row>
					<Row gutter={8}>
						<Col className="gutter-row" span={12}>
							<Upload {...props}>
								<Button icon={<UploadOutlined />}>Chọn file</Button>
							</Upload>
						</Col>
						<Col className="gutter-row" span={12}>
							<Button
								type="primary"
								onClick={handleUpload}
								disabled={fileList?.length === 0}
								loading={uploading}
							>
								{uploading ? 'Đang tải lên' : 'Tải lên '}
							</Button>
						</Col>
					</Row>
				</>
			)}
		</div>
	);
}

export default function CrudModule({ config, createForm, updateForm }) {
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		dispatch(crud.resetState());
	}, []);

	return (
		<CrudLayout
			config={config}
			fixHeaderPanel={<FixHeaderPanel config={config} />}
			sidePanelBottomContent={<CreateForm config={config} formElements={createForm} />}
			sidePanelTopContent={<SidePanelTopContent config={config} formElements={updateForm} />}
		>
			<CrudDataTable config={config} />
			<DeleteModal config={config} />
		</CrudLayout>
	);
}
