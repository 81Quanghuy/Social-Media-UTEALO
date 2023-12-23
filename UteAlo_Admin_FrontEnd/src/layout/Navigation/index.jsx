import React, { useEffect, useState } from 'react';
import adver4 from '@/assets/images/adver4.jpg';
import { Link } from 'react-router-dom';
import { Badge, Button, Layout, List, Menu, Typography, notification } from 'antd';
import {
	SettingOutlined,
	UserOutlined,
	FileTextOutlined,
	FileSyncOutlined,
	DashboardOutlined,
	ShareAltOutlined,
	PieChartOutlined,
	LogoutOutlined,
} from '@ant-design/icons';
import { Group, GroupAdd } from '@material-ui/icons';
import { useWebSocket } from '@/context/WebSocketContext';
import { Popover } from '@material-ui/core';
import notificationApi from '../../api/profile/user/NotificationApi';
import classnames from 'classnames';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
function Navigation() {
	const history = useHistory();
	const auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
	const currentUser = auth?.current;
	const [collapsed, setCollapsed] = useState(false);
	const { notifications } = useWebSocket();
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [listNotification, setListNotification] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [hasMore, setHasMore] = useState(false);
	const { Sider } = Layout;
	const { SubMenu } = Menu;

	const onCollapse = () => {
		setCollapsed(!collapsed);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};
	const classParent = ['notification--item'];
	useEffect(() => {
		console.log('notification', notifications);
		if (notifications) {
			// unshift thêm vào đầu mảng
			setListNotification([notifications, ...listNotification]);
		}
	}, [notifications]);
	useEffect(() => {
		console.log('currentUser', currentUser);
		const fetchNotifications = async () => {
			setLoading(true);
			const res = await notificationApi.getNotifications({ user: currentUser, page: page, size: 10 });
			if (res.success) {
				console.log(res.data);
				// thêm vào cuối mảng
				setListNotification([...listNotification, ...res.result]);
				if (res.result.length < 10) {
					setHasMore(false);
				} else {
					setHasMore(true);
				}
			} else {
				throw new Error(res.message);
			}
		};

		fetchNotifications();
		setLoading(false);
		console.log('page', page);
	}, [page]);
	const handleReadNotification = async (item) => {
		const res = await notificationApi.readNotification({ user: currentUser, notificationId: item.notificationId });

		if (res.success) {
			console.log(res.data);
			setAnchorEl(null);

			history.push(`${item.link}`);
		} else {
			notification.error({
				message: 'Thông báo',
				description: res?.message,
			});
		}
		//Chỉnh thông báo đó là đã đọc
		const newListNotification = listNotification.map((notification) => {
			if (notification.notificationId === item.notificationId) {
				return { ...notification, isRead: true };
			}
			return notification;
		});
		setListNotification(newListNotification);
	};
	const unReadAllNotification = async () => {
		const res = await notificationApi.unReadAllNotification({ user: currentUser });
		if (res.success) {
			//chỉnh tất cả thông báo là đã đọc
			const newListNotification = listNotification.map((notification) => {
				return { ...notification, isRead: true };
			});
			setListNotification(newListNotification);
		} else {
			notification.error({
				message: 'Thông báo',
				description: res?.message,
			});
		}
	};
	return (
		<>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={onCollapse}
				style={{
					zIndex: 1000,
				}}
			>
				<div className="logo" style={{ display: 'flex' }}>
					<div className="button-right">
						<Badge
							// chỉ tính những thông báo chưa đọc
							count={listNotification.filter((item) => item.isRead === false).length}
							aria-describedby="simple-popover"
							onClick={(e) => handleClick(e)}
						>
							<Typography.Title style={{ color: '#fff' }}> UTEALO </Typography.Title>
						</Badge>
						<Popover
							id="simple-popover"
							open={Boolean(anchorEl)}
							className="popper--member"
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
						>
							<div className="notification--container">
								<div className="notification--header">
									<Typography.Text strong>Thông báo</Typography.Text>

									<Typography.Text
										style={{ color: '#1e90ff', cursor: 'pointer' }}
										onClick={unReadAllNotification}
									>
										Đánh dấu tất cả đã đọc
									</Typography.Text>
								</div>
								<div className="notification--body">
									{listNotification.length > 0 ? (
										<List
											itemLayout="horizontal"
											dataSource={listNotification}
											loadMore={
												<div
													style={{
														textAlign: 'center',
														marginTop: 12,
														height: 32,
														lineHeight: '32px',
														marginBottom: 12,
													}}
												>
													<Button
														disabled={!hasMore}
														type="primary"
														onClick={() => setPage((pre) => pre + 1)}
														loading={loading}
													>
														Xem thêm
													</Button>
												</div>
											}
											renderItem={(item) => (
												<List.Item
													className={classnames(item.isRead ? 'read' : 'unread', classParent)}
													onClick={() => handleReadNotification(item)}
												>
													<List.Item.Meta
														avatar={
															<img
																src={item.photo || adver4}
																alt="avatarGroup"
																className="notification--item-avatar"
															></img>
														}
														description={
															<div style={{ display: 'flex', flexDirection: 'column' }}>
																<span className="notification--item-content">
																	{item.content}
																</span>
																<span className="notification--item-time">
																	Thời gian:{' '}
																	{moment(item.createdAt).format('DD/MM/YYYY')}
																</span>
															</div>
														}
													/>
												</List.Item>
											)}
										/>
									) : (
										<div className="notification--item">
											<img
												src={adver4}
												alt="avatarGroup"
												className="notification--item-avatar"
											></img>
											<div className="notification--item-content">
												<Typography.Text>
													<span className="notification--item-content-content">
														Bạn không có thông báo nào
													</span>
												</Typography.Text>
											</div>
										</div>
									)}
								</div>
							</div>
						</Popover>
					</div>
				</div>
				<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
					<Menu.Item key="1" icon={<DashboardOutlined />}>
						<Link to="/" />
						Trang chủ
					</Menu.Item>
					<Menu.Item key="2" icon={<UserOutlined />}>
						<Link to="/user">Người dùng</Link>
					</Menu.Item>
					<Menu.Item key="21" icon={<FileTextOutlined />}>
						<Link to="/lead" />
						Bài viết
					</Menu.Item>
					<Menu.Item key="3" icon={<FileSyncOutlined />}>
						<Link to="/product" />
						Bình luận
					</Menu.Item>
					<Menu.Item key="4" icon={<GroupAdd />}>
						<Link to="/group">Nhóm</Link>
					</Menu.Item>
					<Menu.Item key="24" icon={<ShareAltOutlined />}>
						<Link to="/share">Bài chia sẻ</Link>
					</Menu.Item>
					<Menu.Item key="32" icon={<SettingOutlined />}>
						<Link to="/setting" />
						Cài đặt
					</Menu.Item>
					<Menu.Item icon={<LogoutOutlined />} key="34" onClick={() => dispatch(logout())}>
						Đăng xuất
					</Menu.Item>
				</Menu>
			</Sider>
		</>
	);
}
export default Navigation;
