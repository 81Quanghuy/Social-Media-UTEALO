import React, { useEffect } from 'react';
import { Avatar, Popover, Image } from 'antd';
import InfoCircleFilled from '@ant-design/icons/InfoCircleFilled';
import Trophy from '../assets/icon/trophy.png';
import LaurelWreath from '../assets/icon/laurel-wreath.png';
import Ribbon from '../assets/icon/ribbon.png';
import FloralDesign from '../assets/icon/floral-design.png';
import SliverMedal from '../assets/icon/silver-medal.png';
import GoldMedal from '../assets/icon/badge.png';
import BronzeMedal from '../assets/icon/bronze.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import history from "@/utils/history";
import { API_BASE_URL } from '@/config/serverApiConfig';
import '../pages/css/TopThree.css';

const TopThree = () => {
	const [topThree, setTopThree] = React.useState([]);
	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get(`${API_BASE_URL}v1/admin/userManager/top3UserAwards`);
			setTopThree(res.data);
		};
		fetchData();
	}, []);

	let defaultTopThreeData = [
		{
			id: 1,
			name: 'SliverMedal',
			avatar: SliverMedal,
			medal: SliverMedal,
		},
		{
			id: 2,
			name: 'GoldMedal',
			avatar: GoldMedal,
			medal: GoldMedal,
		},
		{
			id: 3,
			name: 'BronzeMedal',
			avatar: BronzeMedal,
			medal: BronzeMedal,
		},
	];

	// Kiểm tra và sử dụng dữ liệu mặc định nếu topThree không có dữ liệu
	let topThreeData =
		topThree.length === 0
			? defaultTopThreeData
			: [
					{
						id: topThree[1].userId,
						name: topThree[1].userName,
						avatar: topThree[1].avatar,
						medal: SliverMedal,
					},
					{
						id: topThree[0].userId,
						name: topThree[0].userName,
						avatar: topThree[0].avatar,
						medal: GoldMedal,
					},
					{
						id: topThree[2].userId,
						name: topThree[2].userName,
						avatar: topThree[2].avatar,
						medal: BronzeMedal,
					},
			  ];

	const handleUserClick = (userId) => {
		history.push(`/userStatistics/${userId}`);
	};

	return (
		<>
			<div className="main">
				<div className="list-user" style={{ marginTop: '62px' }}>
					<h3 className="title">
						<Popover
							content={'Doanh thu từ người dùng đã bao gồm phí vận chuyển từ các đơn hàng'}
							trigger="hover"
							// className={('kpi')}
						>
							<span
								style={{
									marginRight: '8px',
									// cursor: 'pointer',
									fontSize: '16px',
								}}
							>
								<InfoCircleFilled />
							</span>
						</Popover>{' '}
						Người dùng ưu tú tháng {new Date().getMonth() + 1}
					</h3>
					<div className="content_user">
						{topThree.map((user, index) => (
							<div className={'user'} key={index}>
								<div className={'index'}>
									<div
										className={'frame'}
										style={{
											backgroundColor:
												index === 0
													? '#f44336'
													: index === 1
													? '#ff9800'
													: index === 2
													? '#ffc107'
													: '#4caf50',
										}}
									>
										{index + 1}
									</div>
								</div>
								<Link style={{display:'flex'}}
									to={`/userStatistics/${user.userId}`}
									onClick={() => handleUserClick(user.userId)}
								>
									<div
										className={'avatar'}
										style={{
											cursor: 'pointer',
										}}
										// onClick={() => {
										//     navigate('/admin/user/1');
										// }}
									>
										<div className={'img'}>
											<Image
												src={user.avatar}
												preview={false}
												style={{
													margin: 'auto',
												}}
											/>
										</div>
									</div>
									<div
										className={'name'}
										style={{
											cursor: 'pointer',
										}}
										// onClick={() => {
										//     navigate('/admin/user/2');
										// }}
									>
										{user.userName}
									</div>
								</Link>
								<div className={'value'}>{user.total} lần</div>
							</div>
						))}
					</div>
				</div>
				<div className="top-three-container">
					<img className="left-image" src={Trophy} alt="Trophy Icon" />
					{topThreeData.map((item, index) => (
						<div className={`top-three-item ${index === 1 ? 'center-item' : ''}`} key={item.id}>
							<Avatar className={`top-three-avatar ${index === 1 ? 'large' : ''}`} src={item.avatar} />
							<div className="medal-container">
								<img className="medal" src={item.medal} alt="Medal Icon" />
							</div>
							<img className="laurel-wreath" src={LaurelWreath} alt="Laurel Wreath Icon" />
							<p>{item.name}</p>
						</div>
					))}
					<img className="right-image" src={Trophy} alt="Trophy Icon" />
					<img className="floral-design top-left" src={FloralDesign} alt="Floral Design Icon" />
					<img className="floral-design top-right" src={FloralDesign} alt="Floral Design Icon" />
					<img className="floral-design bottom-left" src={FloralDesign} alt="Floral Design Icon" />
					<img className="floral-design bottom-right" src={FloralDesign} alt="Floral Design Icon" />
				</div>
			</div>
			<div className="banner">
				<span>Đóng góp nhiều nhất</span>
				<img className="ribbon" src={Ribbon} alt="Ribbon Icon" />
			</div>
		</>
	);
};

export default TopThree;
