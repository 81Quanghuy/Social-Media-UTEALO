import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Card, Statistic, Row, Col, Table, Image, Button, Tag, Modal, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie } from 'recharts';
import { UserOutlined } from '@ant-design/icons';
import sampleProPic from '@/assets/images/user.png';
import '../pages/css/UserStatistics.css';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import { token as tokenCookies } from '@/auth';
import Frame from '../assets/icon/frame.png';
import AvatarFrame from '../assets/icon/avatar.png';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import RecentTable from '@/components/RecentTable';
import { EditOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const UserStatistics = () => {
	const params = useParams();
	const authData = JSON.parse(localStorage.getItem('auth'));
	//const userId = authData.current.userId;
	const userId = params.userId;
	console.log('userId', userId);

	const [profileUser, setProfileUser] = useState(null);
	const [isBackgroundDark, setIsBackgroundDark] = useState(true);
	const [isBackgroundDark2, setIsBackgroundDark2] = useState(true);
	const [isBackgroundDark3, setIsBackgroundDark3] = useState(true);
	const [isBackgroundDark4, setIsBackgroundDark4] = useState(true);
	const [isBackgroundDark5, setIsBackgroundDark5] = useState(true);
	const [isBackgroundDark6, setIsBackgroundDark6] = useState(true);
	const [countPostDateMonthInYear, setCountPostDateMonthInYear] = useState([]);
	const [countCommentsByMonthInYear, setCountCommentsByMonthInYear] = useState([]);
	const [countShareByMonthInYear, setConutShareByMonthInYear] = useState([]);
	const [countPostCommentShareOfUser, setCountPostCommentShareOfUser] = useState([]);
	const [listPostInMonth, setListPostInMonth] = useState([]);
	const [listShareInMonth, setListShareInMonth] = useState([]);
	const [listCommentInMonth, setListCommentInMonth] = useState([]);
	const [listGroup, setListGroup] = useState([]);
	const [isOnline, setIsOnline] = useState();

	const handleBackgroundChange = () => {
		setIsBackgroundDark(!isBackgroundDark);
	};

	const handleBackgroundChange2 = () => {
		setIsBackgroundDark2(!isBackgroundDark2);
	};

	const handleBackgroundChange3 = () => {
		setIsBackgroundDark3(!isBackgroundDark3);
	};

	const handleBackgroundChange4 = () => {
		setIsBackgroundDark4(!isBackgroundDark4);
	};

	const fetchListGroup = async () => {
		try {
			const res = await axios.get(`${API_BASE_URL}v1/admin/groupManager/combinedGroups/${userId}`);
			setListGroup(res.data.result);
		} catch (error) {
			console.error(`Error fetching count:`, error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = tokenCookies.get();
				const config = {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				};
				const res = await axios.get(`${API_BASE_URL}v1/user/profile/${userId}`, config);
				setProfileUser(res.data.result);
			} catch (error) {
				console.error(`Error fetching`, error);
			}
		};
		const fetchCountPostDateMonthInYear = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/postManager/countPostsByMonthInYear/${userId}`);
				setCountPostDateMonthInYear(res.data);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchCountCommentsByMonthInYear = async () => {
			try {
				const res = await axios.get(
					`${API_BASE_URL}v1/admin/commentManager/countCommentsByMonthInYear/${userId}`
				);
				setCountCommentsByMonthInYear(res.data);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchConutShareByMonthInYear = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/shareManager/countSharesByMonthInYear/${userId}`);
				setConutShareByMonthInYear(res.data);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchDataCountPostCommentShareOfUser = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/userManager/getCountPostShareComment/${userId}`);
				setCountPostCommentShareOfUser(res.data);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchListPostInMonth = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/postManager/listPostInMonth/${userId}`);
				setListPostInMonth(res.data.result.content);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchListShareInMonth = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/shareManager/listShareInMonth/${userId}`);
				setListShareInMonth(res.data.result.content);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchListCommentInMonth = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/commentManager/listCommentInMonth/${userId}`);
				setListCommentInMonth(res.data.result.content);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		const fetchIsOnline = async () => {
			try {
				const res = await axios.get(`${API_BASE_URL}v1/admin/userManager/getIsOnline/${userId}`);
				setIsOnline(res.data);
			} catch (error) {
				console.error(`Error fetching count:`, error);
			}
		};
		fetchIsOnline();
		fetchListGroup();
		fetchListCommentInMonth();
		fetchListShareInMonth();
		fetchListPostInMonth();
		fetchDataCountPostCommentShareOfUser();
		fetchConutShareByMonthInYear();
		fetchCountCommentsByMonthInYear();
		fetchCountPostDateMonthInYear();
		fetchData();
	}, []);

	const appointDeputyGroup = async ({ postGroupId }) => {
		const data = {
			userId: [userId],
			postGroupId: postGroupId,
		};
		console.log('Data', data);
		try {
			const token = tokenCookies.get();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.post(`${API_BASE_URL}v1/groupPost/appoint-deputy`, data, config);
			if (res.data.success) {
				fetchListGroup();
				Modal.destroyAll(); // Đóng tất cả các Modal đang mở
				message.success('Thành công');
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				console.log(res.data);
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const removeDeputyGroup = async ({ postGroupId }) => {
		const data = {
			userId: [userId],
			postGroupId: postGroupId,
		};
		console.log('Data', data);
		try {
			const token = tokenCookies.get();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.post(`${API_BASE_URL}v1/groupPost/remove-deputy`, data, config);
			if (res.data.success) {
				fetchListGroup();
				Modal.destroyAll(); // Đóng tất cả các Modal đang mở
				message.success('Thành công');
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				console.log(res.data);
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const removeMemberInGroup = async ({ postGroupId }) => {
		const data = {
			userId: [userId],
			postGroupId: postGroupId,
		};
		console.log('Data', data);
		try {
			const token = tokenCookies.get();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.post(`${API_BASE_URL}v1/groupPost/delete/member`, data, config);
			if (res.data.success) {
				fetchListGroup();
				Modal.destroyAll(); // Đóng tất cả các Modal đang mở
				message.success('Thành công');
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				console.log(res.data);
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const appointAdminGroup = async ({ postGroupId }) => {
		try {
			const token = tokenCookies.get();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};
			const res = await axios.post(
				`http://localhost:8089/api/v1/groupPost/addAdmin?groupId=${postGroupId}&userId=${userId}`,
				null,
				config
			);
			if (res.data.success) {
				fetchListGroup();
				Modal.destroyAll(); // Đóng tất cả các Modal đang mở
				message.success('Thành công');
				console.log(res.data);
				return res.data; // Trả về dữ liệu từ thành công
			} else {
				console.log(res.data);
				throw new Error(res.data.message);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const postColumns = [
		{
			title: 'Nội dung',
			dataIndex: 'content',
			render: (content, record) => {
				if (content) {
					return content;
				} else if (record.photos) {
					return <img src={record.photos} alt="Ảnh" style={{ maxWidth: '100px', maxHeight: '100px' }} />;
				} else if (record.files) {
					const decodedUrl = decodeURIComponent(record.files);
					return (
						<a href={decodedUrl} download>
							Tải xuống tệp
						</a>
					);
				} else {
					return 'Không có';
				}
			},
		},
		{
			title: 'Ngày đăng',
			dataIndex: 'postTime',
			render: (postTime) => {
				const date = new Date(postTime);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			},
		},
		{
			title: 'Quyền riêng tư',
			dataIndex: 'privacyLevel',
			render: (privacyLevel) => {
				switch (privacyLevel) {
					case 'PUBLIC':
						return 'Công khai';
					case 'PRIVATE':
						return 'Chỉ mình tôi';
					case 'FRIENDS':
						return 'Bạn bè';
					case 'GROUP_MEMBERS':
						return 'Nhóm';
					case 'ADMIN':
						return 'Hệ thống';
					default:
						return 'Không xác định';
				}
			},
		},
	];

	const shareColumns = [
		{
			title: 'Nội dung',
			dataIndex: 'content',
			render: (content) => {
				if (!content) {
					return 'Không có';
				}
				return content;
			},
		},
		{
			title: 'Ngày chia sẻ',
			dataIndex: 'createAt',
			render: (createAt) => {
				const date = new Date(createAt);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			},
		},
		{
			title: 'Quyền riêng tư',
			dataIndex: 'privacyLevel',
			render: (privacyLevel) => {
				switch (privacyLevel) {
					case 'PUBLIC':
						return 'Công khai';
					case 'PRIVATE':
						return 'Chỉ mình tôi';
					case 'FRIENDS':
						return 'Bạn bè';
					case 'GROUP_MEMBERS':
						return 'Nhóm';
					case 'ADMIN':
						return 'Hệ thống';
					default:
						return 'Không xác định';
				}
			},
		},
	];

	const commentColumns = [
		{
			title: 'Nội dung',
			dataIndex: 'content',
			render: (content) => {
				if (!content) {
					return 'Không có';
				}
				return content;
			},
		},
		{
			title: 'Ngày chia sẻ',
			dataIndex: 'createTime',
			render: (createTime) => {
				const date = new Date(createTime);
				const day = date.getDate().toString().padStart(2, '0');
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const year = date.getFullYear();
				return `${day}/${month}/${year}`;
			},
		},
	];

	const groupColumns = [
		{
			title: 'Tên nhóm',
			dataIndex: 'postGroupName',
			render: (postGroupName) => {
				if (!postGroupName) {
					return 'Không có';
				}
				return postGroupName;
			},
		},
		{
			title: 'Vai trò trong nhóm',
			dataIndex: 'role',
			render: (role, record) => {
				let color;
				let displayRoleName;
				let actionButton;

				switch (role) {
					case 'Admin':
						color = 'green';
						displayRoleName = 'Quản trị viên';

						actionButton = <></>;
						break;
					case 'Member':
						color = 'red';
						displayRoleName = 'Thành viên';
						actionButton = (
							<>
								<Button
									className="btn-appointDeputyGroup"
									onClick={() => appointDeputyGroup({ postGroupId: record.postGroupId })}
								>
									Thêm quyền phó quản trị viên
								</Button>
								<Button
									className="btn-appointAdminGroup"
									onClick={() => appointAdminGroup({ postGroupId: record.postGroupId })}
								>
									Thêm quyền quản trị viên
								</Button>
								<Button
									className="btn-appointAdminGroup"
									onClick={() => removeMemberInGroup({ postGroupId: record.postGroupId })}
								>
									Xóa khỏi nhóm
								</Button>
							</>
						);
						break;
					case 'Deputy':
						color = 'orange';
						displayRoleName = 'Phó nhóm';
						actionButton = (
							<>
								<Button
									className="btn-removeDeputyGroup"
									onClick={() => removeDeputyGroup({ postGroupId: record.postGroupId })}
								>
									Xóa quyền phó quản trị viên
								</Button>
								<Button
									className="btn-appointAdminGroup"
									onClick={() => appointAdminGroup({ postGroupId: record.postGroupId })}
								>
									Thêm quyền quản trị viên
								</Button>
								<Button
									className="btn-appointAdminGroup"
									onClick={() => removeMemberInGroup({ postGroupId: record.postGroupId })}
								>
									Xóa khỏi nhóm
								</Button>
							</>
						);
						break;
					default:
						color = 'volcano';
						displayRoleName = role;
						actionButton = (
							<Button
								className="btn-appointAdminGroup"
								onClick={() => appointAdminGroup({ postGroupId: record.postGroupId })}
							>
								Thêm quyền quản trị viên
							</Button>
						);
						break;
				}

				const handleUpdateRole = () => {
					Modal.info({
						cancelButtonProps: {
							children: 'Hủy',
						},
						title: `Cập nhật vai trò cho ${record.postGroupName}`,
						content: <div>{actionButton}</div>,
						onCancel() {},
					});
				};

				return (
					<div>
						<Tag color={color}>{displayRoleName}</Tag>
						{record.role !== 'Admin' && (
							<Button
								type="primary"
								onClick={() => {
									handleUpdateRole();
								}}
							>
								<EditOutlined />
							</Button>
						)}
					</div>
				);
			},
		},
	];

	const formattedDate = profileUser?.dayOfBirth ? moment(profileUser.dayOfBirth).format('YYYY/MM/DD') : '';
	console.log('profileUser', profileUser);

	// Chuyển đổi object thành mảng để sử dụng map
	const countPostArray = Object.keys(countPostDateMonthInYear).map((month) => ({
		[month]: countPostDateMonthInYear[month],
	}));

	// Kiểm tra và sử dụng dữ liệu nếu không phải là null hoặc undefined
	const chartDataq = countPostArray.map((count, index) => {
		const monthKey = Object.keys(count)[0]; // Lấy key của tháng
		const postData = count[monthKey]; // Dữ liệu bài viết của tháng
		const shareData = countShareByMonthInYear[index] ? countShareByMonthInYear[index][monthKey] : 0; // Dữ liệu chia sẻ của tháng (nếu tồn tại)
		const commentData = countCommentsByMonthInYear[index] ? countCommentsByMonthInYear[index][monthKey] : 0; // Dữ liệu bình luận của tháng (nếu tồn tại)

		return {
			name: monthKey, // Tên tháng
			'Bài viết': postData,
			'Chia sẻ': shareData || 0, // Sử dụng dữ liệu hoặc mặc định là 0 nếu không tồn tại
			'Bình luận': commentData || 0, // Sử dụng dữ liệu hoặc mặc định là 0 nếu không tồn tại
		};
	});

	const data = [
		{ name: 'Bài viết', value: countPostCommentShareOfUser.postCount, fill: '#82ca9d' },
		{ name: 'Chia sẻ', value: countPostCommentShareOfUser.shareCount, fill: '#ffc658' },
		{ name: 'Bình luận', value: countPostCommentShareOfUser.commentCount, fill: '#ff7300' },
	];

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<Content
				className="site-layout-background"
				style={{
					padding: 24,
					margin: 0,
					minHeight: 280,
				}}
			>
				<Row gutter={16} style={{ height: '200px' }}>
					<Col span={6}>
						<div
							className="profile-avatar"
							style={{
								display: 'flex',
								margin: 'auto',
								alignItems: 'center',
								justifyContent: 'center',
								height: '210px',
								width: '210px',
								backgroundImage: `url(${AvatarFrame})`,
								backgroundSize: 'cover',
							}}
						>
							<Image src={profileUser?.avatar} width={190} />
						</div>
					</Col>
					<Col span={18}>
						<Row gutter={16} style={{ height: '200px' }}>
							<Col span={12}>
								<Card style={{ height: '100%' }} className="card-information-one">
									<img className="frame-design top-left" src={Frame} alt="Frame Design Icon" />
									<img className="frame-design top-right" src={Frame} alt="Frame Design Icon" />
									<img className="frame-design bottom-left" src={Frame} alt="Frame Design Icon" />
									<img className="frame-design bottom-right" src={Frame} alt="Frame Design Icon" />
									<Statistic title="Tên" value={profileUser?.userName} />
									<Statistic title="Chức vụ" value={profileUser?.roleName} />
									<Statistic title="Ngày sinh" value={formattedDate} />
								</Card>
							</Col>
							<Col span={12}>
								<Card style={{ height: '100%' }} className="card-information-one">
									<img className="frame-design top-left" src={Frame} alt="Frame Design Icon" />
									<img className="frame-design top-right" src={Frame} alt="Frame Design Icon" />
									<img className="frame-design bottom-left" src={Frame} alt="Frame Design Icon" />
									<img className="frame-design bottom-right" src={Frame} alt="Frame Design Icon" />
									<Statistic
										title="Giới tính"
										value={profileUser?.gender === 'MALE' ? 'Nam' : 'Nữ'}
									/>
									<Statistic title="Số điện thoại" value={profileUser?.phone} />
									<Statistic title="Email" value={profileUser?.email} />
								</Card>
							</Col>
						</Row>
					</Col>
				</Row>
				<div className="space30"></div>
				<Row gutter={16}>
					<Col span={24}>
						<Card>
							<Statistic
								title={
									<span>
										<Tag
											className="title"
											color={isOnline ? 'green' : 'red'}
											style={{ fontSize: '18px' }}
										>
											{isOnline ? 'Online' : 'Offline'}
										</Tag>
									</span>
								}
								value={112893}
								loading
								className={isOnline ? 'greenLoading' : 'redLoading'}
							/>
						</Card>
					</Col>
				</Row>
				<div className="space30"></div>
				<Row gutter={16}>
					<Col span={12}>
						<Card
							className={`container-line-chart ${
								isBackgroundDark ? 'dark-background' : 'light-background'
							}`}
						>
							<Button type="primary" onClick={handleBackgroundChange}>
								{isBackgroundDark ? 'Trắng' : 'Đen'}
							</Button>
							<LineChart width={500} height={300} data={chartDataq}>
								<XAxis dataKey="name" />
								<YAxis />
								<CartesianGrid stroke="#eee" strokeDasharray="5 5" />
								<Tooltip />
								<Legend />
								<Line type="monotone" dataKey="Bài viết" stroke="#8884d8" />
								<Line type="monotone" dataKey="Chia sẻ" stroke="#82ca9d" />
								<Line type="monotone" dataKey="Bình luận" stroke="#ffc658" />
							</LineChart>
						</Card>
					</Col>
					<Col span={12}>
						<Card
							className={`container-line-chart ${
								isBackgroundDark2 ? 'dark-background' : 'light-background'
							}`}
						>
							<Button type="primary" onClick={handleBackgroundChange2}>
								{isBackgroundDark2 ? 'Trắng' : 'Đen'}
							</Button>
							<PieChart width={600} height={300}>
								<Pie dataKey="value" data={data} cx={300} cy={130} outerRadius={100} label>
									{data.map((entry, index) => (
										<Pie key={`pie-${index}`} dataKey="value" nameKey="name" fill={entry.fill} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</Card>
					</Col>
				</Row>
				<div className="space30"></div>
				<Row gutter={16}>
					<Col span={12}>
						<Card
							className={`container-list-item ${
								isBackgroundDark3 ? 'light-background' : 'dark-background'
							}`}
						>
							<div className="container-list--item-header">
								<Statistic
									title={
										<span>
											<Tag className="title" color="#82ca9d">
												Bài viết trong tháng
											</Tag>
										</span>
									}
									value={countPostCommentShareOfUser.postCount}
								/>
								<Button type="primary" onClick={handleBackgroundChange3}>
									{isBackgroundDark3 ? 'Trắng' : 'Đen'}
								</Button>
							</div>
							<Table dataSource={listPostInMonth} columns={postColumns} pagination={{ pageSize: 3 }} />
						</Card>
					</Col>
					<Col span={12}>
						<Card
							className={`container-list-item ${
								isBackgroundDark4 ? 'light-background' : 'dark-background'
							}`}
						>
							<div className="container-list--item-header">
								<Statistic
									title={
										<span>
											<Tag className="title" color="#ffc658">
												Chia sẻ trong tháng
											</Tag>
										</span>
									}
									value={countPostCommentShareOfUser.shareCount}
								/>
								<Button type="primary" onClick={handleBackgroundChange4}>
									{isBackgroundDark4 ? 'Trắng' : 'Đen'}
								</Button>
							</div>
							<Table dataSource={listShareInMonth} columns={shareColumns} pagination={{ pageSize: 3 }} />
						</Card>
					</Col>
				</Row>
				<div className="space30"></div>
				<Row gutter={16}>
					<Col span={12}>
						<Card className="container-list-item">
							<Statistic
								title={
									<span>
										<Tag className="title" color="#ff7300">
											Bình luận trong tháng
										</Tag>
									</span>
								}
								value={countPostCommentShareOfUser.commentCount}
							/>
							<Table
								dataSource={listCommentInMonth}
								columns={commentColumns}
								pagination={{ pageSize: 3 }}
							/>
						</Card>
					</Col>
					<Col span={12}>
						<Card className="container-list-item">
							<Statistic
								title={
									<span>
										<Tag className="title" color="#b1e7f9">
											Nhóm tham gia và quản lý
										</Tag>
									</span>
								}
								value={listGroup && listGroup.length}
							/>
							<Table dataSource={listGroup} columns={groupColumns} pagination={{ pageSize: 3 }} />
						</Card>
					</Col>
				</Row>
			</Content>
		</Layout>
	);
};

export default UserStatistics;
