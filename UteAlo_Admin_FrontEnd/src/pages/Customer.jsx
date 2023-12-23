import React from 'react';
import { Tag, Button, Table, Dropdown, AutoComplete } from 'antd';

import CrudModule from '@/modules/CrudModule';
import CustomerForm from '@/forms/CustomerForm';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { EllipsisOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/serverApiConfig';
import axios from 'axios';
import { Label } from 'recharts';
import { Link, useHistory } from 'react-router-dom';
function Customer() {
	const history = useHistory();
	const entity = 'v1/admin/userManager';
	const searchConfig = {
		displayLabels: ['userName', 'phone', 'email'],
		searchFields: 'userName,phone,email',
		outputValue: 'userId',
	};
	const panelTitle = 'Quản lý người dùng';
	const dataTableTitle = 'Danh sách người dùng';
	const entityDisplayLabels = ['userName'];

	const readColumns = [
		{
			title: 'Họ và tên',
			dataIndex: 'userName',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dayOfBirth',
			render: (dayOfBirth) => {
				const date = new Date(dayOfBirth);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			},
		},
		{
			title: 'Giới tính',
			dataIndex: 'gender',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'address',
		},
		{
			title: 'Vai trò',
			dataIndex: 'roleName',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isActive',
		},
	];

	const [searchText, setSearchText] = useState('');

	const handleSearch = (selectedKeys, confirm) => {
		confirm();
		setSearchText(selectedKeys[0]);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const handleUserClick = (userId) => {
		history.push(`/userStatistics/${userId}`);
	};

	const dataTableColumns = [
		{
			title: 'Họ và tên',
			dataIndex: 'userName',
			key: 'userName',
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }}>
					<input
						placeholder="Tìm kiếm"
						value={selectedKeys[0] || searchText}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => handleSearch(selectedKeys, confirm)}
						style={{ width: 188, marginBottom: 8, display: 'block' }}
					/>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90, marginRight: 8 }}
					>
						Tìm
					</Button>
					<Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Đặt lại
					</Button>
				</div>
			),
			filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
			onFilter: (value, record) => record.userName.toLowerCase().includes(value.toLowerCase()),
			onFilterDropdownVisibleChange: (visible, node) => {
				if (visible && node) {
					setTimeout(() => {
						const input = node.querySelector('input');
						if (input) {
							input.focus();
						}
					}, 100);
				}
			},
			render: (text, record) => (
				<Link to={`/userStatistics/${record.userId}`} onClick={() => handleUserClick(record.userId)}>
					{searchText ? (
						<span>
							{text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) =>
								fragment.toLowerCase() === searchText.toLowerCase() ? (
									<span key={i} className="highlight">
										{fragment}
									</span>
								) : (
									fragment
								)
							)}
						</span>
					) : (
						text
					)}
				</Link>
			),
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dayOfBirth',
			render: (dayOfBirth) => {
				const date = new Date(dayOfBirth);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			},
			sorter: (a, b) => {
				const dateA = new Date(a.dayOfBirth);
				const dateB = new Date(b.dayOfBirth);
				return dateA - dateB;
			},
		},
		{
			title: 'Giới tính',
			dataIndex: 'gender',
			render: (gender) => {
				if (!gender) {
					return 'Không có';
				}
				return gender;
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isActive',
			// Sử dụng Tag của Ant Design và CSS để thêm màu sắc
			render: (text, record) => ({
				children: <Tag color={text === 'Bị khóa' ? 'red' : 'green'}>{text}</Tag>,
			}),
		},
	];

	const ADD_NEW_ENTITY = 'Thêm người dùng mới';
	const DATATABLE_TITLE = 'customers List';
	const ENTITY_NAME = 'customer';
	const CREATE_ENTITY = 'Create customer';
	const UPDATE_ENTITY = 'Update customer';
	const config = {
		entity,
		panelTitle,
		dataTableTitle,
		ENTITY_NAME,
		CREATE_ENTITY,
		ADD_NEW_ENTITY,
		UPDATE_ENTITY,
		DATATABLE_TITLE,
		readColumns,
		dataTableColumns,
		searchConfig,
		entityDisplayLabels,
		uploadFile: true,
	};

	const [listUserToDay, setListUserToDay] = useState([]);
	const [listUser7Days, setListUser7Days] = useState([]);
	const [listUser1Month, setListUser1Month] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState('');

	const fetchUserToDay = async () => {
		try {
			const res = await axios.get(`${API_BASE_URL}v1/admin/userManager/filterByDate?action=today`);
			setListUserToDay(res.data);
			return res.data;
		} catch (error) {
			console.error(`Error fetching data:`, error);
		}
	};

	const fetchUser7Days = async () => {
		try {
			const res = await axios.get(`${API_BASE_URL}v1/admin/userManager/filterByDate?action=7days`);
			setListUser7Days(res.data);
			return res.data;
		} catch (error) {
			console.error(`Error fetching data:`, error);
		}
	};

	const fetchUser1Month = async () => {
		try {
			const res = await axios.get(`${API_BASE_URL}v1/admin/userManager/filterByDate?action=month`);
			setListUser1Month(res.data);
			return res.data;
		} catch (error) {
			console.error(`Error fetching data:`, error);
		}
	};

	useEffect(() => {
		fetchUser1Month();
		fetchUser7Days();
		fetchUserToDay();
	}, []);

	console.log('listUserToDay', listUserToDay);
	console.log('listUser7Days', listUser7Days);
	console.log('listUser1Month', listUser1Month);

	const handleTodayClick = () => {
		setSelectedPeriod('today');
	};

	const handle7DaysClick = () => {
		setSelectedPeriod('7days');
	};

	const handle1MonthClick = () => {
		setSelectedPeriod('1month');
	};

	function RecentTable({ ...props }) {
		let { entity, dataTableColumns } = props;
		dataTableColumns = [...dataTableColumns];

		const asyncList = () => {
			return request.list(entity);
		};

		const { result, isLoading, isSuccess } = useFetch(asyncList);

		const firstFiveItems = () => {
			if (selectedPeriod === 'today') {
				return listUserToDay.slice(0, 5);
			} else if (selectedPeriod === '7days') {
				return listUser7Days.slice(0, 5);
			} else if (selectedPeriod === '1month') {
				return listUser1Month.slice(0, 5);
			}
			if (isSuccess && result) {
				return result.slice(0, 5);
			}
			return [];
		};
		return (
			<>
				<Table
					columns={dataTableColumns}
					rowKey={(item) => item._id}
					dataSource={isSuccess && firstFiveItems()}
					pagination={false}
					loading={isLoading}
				/>
			</>
		);
	}

	return (
		<>
			<CrudModule
				createForm={<CustomerForm />}
				updateForm={<CustomerForm isUpdateForm={true} />}
				config={config}
			/>
			<div className="container" style={{ width: '80%', margin: 'auto' }}>
				{' '}
				<div className="whiteBox shadow" style={{ marginBottom: '40px' }}>
					<div className="pad20">
						<h3 style={{ color: '#22075e', marginBottom: 5 }}>Người dùng mới</h3>
						<Button onClick={handleTodayClick}>Trong ngày hôm nay</Button>
						<Button onClick={handle7DaysClick}>Trong 7 ngày</Button>
						<Button onClick={handle1MonthClick}>Trong 1 tháng</Button>
					</div>
					<RecentTable entity={'v1/admin/userManager'} dataTableColumns={dataTableColumns} />
				</div>
			</div>
		</>
	);
}

export default Customer;
