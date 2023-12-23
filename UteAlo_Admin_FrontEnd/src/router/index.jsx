// export { default as AuthRouter } from "./AuthRouter";
// export { default as AppRouter } from "./AppRouter";
import React, { useEffect } from 'react';

import AuthRouter from './AuthRouter';
import AppRouter from './AppRouter';

import { Layout } from 'antd';
import Navigation from '@/layout/Navigation';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { useWebSocket } from '../context/WebSocketContext';

export default function Router() {
	const { isLoggedIn } = useSelector(selectAuth);
	const { connectWebSocket, disconnectWebSocket } = useWebSocket();
	const auth = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : null;
	useEffect(() => {
		if (isLoggedIn) {
			connectWebSocket(auth?.current);
		} else {
			disconnectWebSocket(auth?.current);
		}
	}, [isLoggedIn]);

	if (isLoggedIn === false)
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<AuthRouter />
			</Layout>
		);
	else
		return (
			<Layout style={{ minHeight: '100vh' }}>
				<Navigation />
				<Layout style={{ minHeight: '100vh' }}>
					<AppRouter />
				</Layout>
			</Layout>
		);
}

// export default App;
