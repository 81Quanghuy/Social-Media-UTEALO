import React, { useState, useEffect } from 'react';
import { Button, message, Image, Space, Collapse, Modal, Tooltip } from 'antd';
import { token as tokenCookies } from '@/auth';
import { API_BASE_URL } from '@/config/serverApiConfig';
import { Camera, Cancel, Edit, Settings } from '@material-ui/icons';
import { Helmet } from 'react-helmet';
import noCover from '@/assets/images/noCover.jpg';
import sampleProPic from '@/assets/images/user.png';
import EditUser from '@/components/EditProfile/EditUser';
import ChangePassword from '@/components/EditProfile/ChangePassword';
import Moment from 'react-moment';
import '@/components/EditProfile/types/EditProfile.css';
import axios from 'axios';
import moment from 'moment';
const Setting = () => {
	const authData = JSON.parse(localStorage.getItem('auth'));
	const userId = authData.current.userId;
	const [profileUser, setProfileUser] = useState(null);
	const [photosUrl, setPhotosUrl] = useState();
	const [photos, setPhotos] = useState(null);
	const [loading, setLoading] = useState(false);
	const [targetPhoto, setTargetPhoto] = useState(null);
	const { Panel } = Collapse;
	const openModalUpdate = (e) => {
		setVisibleModalUpdate({ visible: true, type: e });
	};
	const items = [
		{
			key: '1',
			label: (
				<div className="title--collapse">
					<span>Thông tin cá nhân của bạn</span>
					<Tooltip title="Chỉnh sửa thông tin cá nhân" placement="top">
						<Settings
							htmlColor="#65676B"
							className="icon--setting"
							onClick={(e) => {
								openModalUpdate('infor');
								e.stopPropagation(); // Dừng truyền sự kiện click
							}}
						/>
					</Tooltip>
				</div>
			),
			children: (
				<div className="collapse--content">
					<span>Tên người dùng: {profileUser?.userName}</span>
					<span>Địa chỉ: {profileUser?.address || 'Chưa có thông tin'}</span>
					<span>
						Giới tính:{' '}
						{profileUser?.gender === 'MALE'
							? 'Nam giới'
							: profileUser?.gender === 'FEMALE'
							? 'Nữ giới'
							: 'Khác'}
					</span>
					<span>Số điện thoại: {profileUser?.phone || 'Chưa có thông tin'}</span>
					<span>
						Ngày sinh:
						{profileUser?.dayOfBirth === null ? (
							'Chưa có thông tin'
						) : (
							<Moment format="DD/MM/YYYY">{profileUser?.dayOfBirth}</Moment>
						)}
					</span>
				</div>
			),
		},
		{
			key: '2',
			label: (
				<div className="title--collapse">
					<span>Thông tin tài khoản của bạn</span>
					<Tooltip title="Đổi mật khẩu" placement="top">
						<Settings
							htmlColor="#65676B"
							className="icon--setting"
							onClick={(e) => {
								openModalUpdate('pwd');
								e.stopPropagation(); // Dừng truyền sự kiện click
							}}
						/>
					</Tooltip>
				</div>
			),
			children: (
				<div className="collapse--content">
					<span>Địa chỉ email: {profileUser?.email}</span>
				</div>
			),
		},
	];
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
		fetchData();
	}, []);

	const [visibleModalUpdate, setVisibleModalUpdate] = useState({
		visible: false,
		type: '',
	});

	const editUser = async ({ fullName, about, address, phone, gender, dateOfBirth }) => {
		try {
			const token = tokenCookies.get();
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data } = await axios.put(
				`${API_BASE_URL}v1/user/update`,
				{ fullName, about, address, phone, gender, dateOfBirth },
				config
			);

			return data;
		} catch (error) {
			return error;
		}
	};
	const changePassword = async ({ data, token }) => {
		console.log(data);
		console.log(token);
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			};

			const { data: res } = await axios.put(`${API_BASE_URL}v1/user/change-password`, data, config);
			return res;
		} catch (error) {
			return error;
		}
	};
	const updateUser = async (data) => {
		message.loading({ content: 'Đang xử lý...', key: 'updateUser' });
		try {
			const updatedData = await editUser({
				fullName: data.name,
				address: data.address,
				phone: data.phone,
				gender: data.gender,
				dateOfBirth: moment(data.dateOfBirth).toDate(),
			});
			console.log(updatedData);
			if (updatedData != 'Error: Request failed with status code 500') {
				message.success({ content: 'Cập nhật thông tin thành công!', key: 'updateUser' });
				setProfileUser(updatedData.result);
			} else {
				message.error({ content: 'Ngày sinh bị lỗi ', key: 'updateUser' });
			}
		} catch (err) {
			console.log(err);
			message.error({ content: 'Cập nhật thông tin thất bại!', key: 'updateUser' });
		}
	};
	const updatePassword = async (data) => {
		message.loading({ content: 'Đang xử lý...', key: 'updatePassword' });
		const token = tokenCookies.get();
		try {
			const res = await changePassword({ data: data, token: token });
			if (res.success) {
				message.success({ content: 'Đổi mật khẩu thành công!', key: 'updatePassword' });
				setVisibleModalUpdate({ visible: false, type: '' });
				setTimeout(() => {
					message.success({ content: 'Đăng xuất sau 3 giây!', key: 'updatePassword' });
				}, 1000);
				setTimeout(() => {
					localStorage.removeItem('auth');
					localStorage.removeItem('x-auth-token');
					window.location.href = '/login';
				}, 4000);
			}
		} catch (err) {
			message.error({ content: 'Đổi mật khẩu thất bại!', key: 'updatePassword' });
		}
	};
	const openModal = (e) => {
		const file = e.target.files[0];
		setTargetPhoto(e.target.id);
		if (file === undefined) {
			toast.error('Please Select an Image!');
			return;
		}
		if (file.type === 'image/jpeg' || file.type === 'image/png') {
			setPhotos(file);
			setPhotosUrl(URL.createObjectURL(file));
		} else {
			toast.error('Please select an image with png/jpg type');
		}
	};
	const hanldeEditPhoto = async () => {
		if (targetPhoto === 'fileAvatar') {
			try {
				// trong quá trình thực thi thì không cho phép tác động gì hết
				setLoading(true);
				await updateUserAvatar(photos);

				setProfileUser({ ...profileUser, avatar: photosUrl });
				setPhotos(null);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}

		if (targetPhoto === 'fileBackgroup') {
			try {
				setLoading(true);
				await updateUserBackground(photos);

				setProfileUser({ ...profileUser, background: photosUrl });
				setPhotos(null);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		}
	};
	const updateUserAvatar = async (photos) => {
		const token = tokenCookies.get();
		console.log(token);
		console.log(photos);
		const formData = new FormData();
		formData.append('imageFile', photos);
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const res = await axios.put(`${API_BASE_URL}v1/user/avatar`, formData, config);
		return res;
	};
	const updateUserBackground = async (photos) => {
		const token = tokenCookies.get();
		const formData = new FormData();
		console.log(token);
		console.log(photos);
		formData.append('imageFile', photos);
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		const res = await axios.put(`${API_BASE_URL}v1/user/background`, formData, config);
		return res;
	};

	return (
		<>
			<Helmet title="Edit profile | UTEALO" />
			<div className="container" style={{ margin: '70px' }}>
				<Helmet title="Edit profile | UTEALO" />
				{profileUser && (
					<div>
						<div className="header--group">
							<div className="groupCover">
								{profileUser?.background !== null ? (
									<Image
										hoverable
										cover
										width="100%"
										className="ManagerGroup--groupCoverImg"
										src={profileUser?.background}
										alt={'backgroup'}
										style={{ objectFit: 'cover' }}
									/>
								) : (
									<img className="groupCoverImg" src={noCover} alt="..." />
								)}
								<div className="contaner--avatar">
									{profileUser?.avatar !== null ? (
										<Image
											hoverable
											cover
											width="100%"
											className="groupUserImg"
											src={profileUser?.avatar} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
											alt={'backgroup'}
											style={{
												objectFit: 'cover',
												top: '-55px',
											}}
										/>
									) : (
										<img className="groupUserImg" src={sampleProPic} alt="..." />
									)}
									<label htmlFor="fileAvatar" className="edit--group--avatar">
										<Camera htmlColor="#65676B" />
										<input
											style={{ display: 'none' }}
											type="file"
											id="fileAvatar"
											accept=".png, .jpeg, .jpg"
											onChange={openModal}
										/>
									</label>
								</div>

								<div className="edit--group--cover">
									<label
										htmlFor="fileBackgroup"
										className="button--edit"
										style={{ cursor: 'pointer' }}
									>
										<Edit htmlColor="#65676B" className="icon--edit" />
										<span>Chỉnh sửa</span>
										<input
											style={{ display: 'none' }}
											type="file"
											id="fileBackgroup"
											accept=".png, .jpeg, .jpg"
											onChange={openModal}
										/>
									</label>
								</div>
							</div>
							<div className="group--contanier--top--edit--profle">
								<div className="group--detail">
									<span className="group--name">{profileUser?.userName}</span>
								</div>
							</div>
							{photos && (
								<Modal
									title="Chỉnh sửa ảnh"
									visible={photos}
									onCancel={() => setPhotos(null)}
									footer={[
										<Button key="back" onClick={() => setPhotos(null)}>
											Hủy
										</Button>,
										<Button key="submit" type="primary" onClick={hanldeEditPhoto} loading={loading}>
											Lưu
										</Button>,
									]}
								>
									<img src={photosUrl} alt="..." style={{ width: '100%' }} />
								</Modal>
							)}
						</div>
						<div className="update--user">
							<Collapse className="collapse--update" defaultActiveKey={['1']}>
								{items.map((item) => (
									<Panel header={item.label} key={item.key}>
										{item.children}
									</Panel>
								))}
							</Collapse>
						</div>
					</div>
				)}
				{visibleModalUpdate?.visible && (
					<Modal
						title={visibleModalUpdate?.type === 'infor' ? 'Chỉnh sửa thông tin cá nhân' : 'Đổi mật khẩu'}
						visible={visibleModalUpdate?.visible}
						onCancel={() => setVisibleModalUpdate({ visible: false, type: '' })}
						footer={null}
						width={visibleModalUpdate?.type === 'infor' ? 600 : 400}
					>
						<>
							{visibleModalUpdate.type === 'infor' ? (
								<EditUser
									profileUser={profileUser}
									updateUser={updateUser}
									setVisibleModalUpdate={setVisibleModalUpdate}
								/>
							) : (
								<ChangePassword
									updatePassword={updatePassword}
									setVisibleModalUpdate={setVisibleModalUpdate}
								/>
							)}
						</>
					</Modal>
				)}
			</div>
		</>
	);
};

export default Setting;
