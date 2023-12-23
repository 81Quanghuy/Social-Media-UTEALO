import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostApi from '../api/post/PostApi';
import { Image, Skeleton } from 'antd';
import classnames from 'classnames';
import { BugReport, Public } from '@material-ui/icons';
import moment from 'moment';
import '@/pages/css/PostDetail.css';
function PostDetail() {
	function formatTime(time) {
		const postTime = moment(time);
		const timeDifference = moment().diff(postTime, 'minutes');

		let formattedTime;

		if (timeDifference < 60) {
			formattedTime = `${timeDifference} phút trước`;
		} else if (timeDifference < 1440) {
			const hours = Math.floor(timeDifference / 60);
			formattedTime = `${hours} giờ trước`;
		} else {
			formattedTime = postTime.format('DD [tháng] M [lúc] HH:mm');
		}

		return formattedTime;
	}
	const [post, setPost] = useState();
	const params = useParams();
	const auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
	const currentUser = auth?.current;
	const classNameUser = [post?.postGroupId && 'hasGroup'];
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await PostApi.findById({ user: currentUser, reportId: params.reportId });
				setPost(res);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [params.reportId]);
	return (
		<>
			<div className="post">
				{post === null ? (
					<Skeleton
						style={{ marginTop: '30px' }}
						active
						avatar
						paragraph={{
							rows: 2,
						}}
					/>
				) : (
					<div className="postWrapper">
						<div className="postTop">
							<div className="postTopLeft">
								<div className="post--header--left">
									{post?.postGroupName && (
										<span className="postGroupname">{post?.postGroupName}</span>
									)}

									<div className="post--header--left--item">
										<img src={post?.avatarUser} alt="" className="postProfileImg" />

										<div className="postNameAndDate">
											<span className={classnames('postUsername', classNameUser)}>
												{post?.roleName === 'SinhVien'
													? 'Sinh viên: '
													: post?.roleName === 'GiangVien'
													? 'Giảng viên: '
													: post?.roleName === 'PhuHuynh'
													? 'Phụ huynh: '
													: post?.roleName === 'NhanVien'
													? 'Nhân viên: '
													: post?.roleName === 'Admin'
													? 'Quản trị viên: '
													: null}
												{post?.userName}
											</span>
											<span className="postDateShare">{formatTime(post?.updateAt)}</span>
										</div>
									</div>
								</div>
								{post?.privacyLevel &&
									(post?.privacyLevel === 'CONTRIBUTE' ? (
										<div className="postPrivacyLevel">
											<Public />
											<span>Đóng góp </span>
										</div>
									) : post?.privacyLevel === 'BUG' ? (
										<div className="postPrivacyLevel">
											<BugReport />
											<span>Lỗi hệ thống</span>
										</div>
									) : null)}
							</div>
						</div>

						<div className="postCenter">
							{post?.content && <span className="postText">{post?.content}</span>}
							{post?.photos && (
								<Image
									width="100%"
									className="postImg"
									src={post?.photos} // Sử dụng selectedPost.photos thay vì cố định URL như bạn đã đề cập
									alt={post?.content}
									style={{ objectFit: 'cover' }}
								/>
							)}
							{post?.files && post?.files.toLowerCase().endsWith('.txt') && (
								<div className="postFile">
									<a href={post?.files} target="_blank" rel="noopener noreferrer">
										{post?.files.substr(post?.files.lastIndexOf('/') + 1).length > 20
											? post?.files.substr(post?.files.lastIndexOf('/') + 1).substring(0, 20) +
											  '...'
											: post?.files.substr(post?.files.lastIndexOf('/') + 1)}
									</a>
								</div>
							)}
							{post?.files && post?.files.toLowerCase().endsWith('.docx') && (
								<div className="postFile">
									<a href={post?.files} target="_blank" rel="noopener noreferrer">
										{post?.files.substr(post?.files.lastIndexOf('/') + 1).length > 20
											? post?.files.substr(post?.files.lastIndexOf('/') + 1).substring(0, 20) +
											  '...'
											: post?.files.substr(post?.files.lastIndexOf('/') + 1)}
									</a>
								</div>
							)}
							{post?.files && post?.files.toLowerCase().endsWith('.pdf') && (
								<div className="postFile">
									<a href={post?.files} target="_blank" rel="noopener noreferrer">
										{post?.files.substr(post?.files.lastIndexOf('/') + 1).length > 20
											? post?.files.substr(post?.files.lastIndexOf('/') + 1).substring(0, 20) +
											  '...'
											: post?.files.substr(post?.files.lastIndexOf('/') + 1)}
									</a>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
}
export default PostDetail;
