import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import PageLoader from '@/components/PageLoader';

const Dashboard = lazy(() => import(/*webpackChunkName:'DashboardPage'*/ '@/pages/Dashboard'));
const Admin = lazy(() => import(/*webpackChunkName:'AdminPage'*/ '@/pages/Admin'));

const Customer = lazy(() => import(/*webpackChunkName:'CustomerPage'*/ '@/pages/Customer'));

const Group = lazy(() => import(/*webpackChunkName:'CustomerPage'*/ '@/pages/Group'));

const SelectCustomer = lazy(() => import(/*webpackChunkName:'SelectCustomerPage'*/ '@/pages/SelectCustomer'));

const Lead = lazy(() => import(/*webpackChunkName:'LeadPage'*/ '@/pages/Lead'));
const Comment = lazy(() => import(/*webpackChunkName:'ProductPage'*/ '@/pages/Comment'));

const Logout = lazy(() => import(/*webpackChunkName:'LogoutPage'*/ '@/pages/Logout'));
const NotFound = lazy(() => import(/*webpackChunkName:'NotFoundPage'*/ '@/pages/NotFound'));
const Setting = lazy(() => import(/*webpackChunkName:'DashboardPage'*/ '@/pages/Setting'));
const ChangePassword = lazy(() => import(/*webpackChunkName:'DashboardPage'*/ '@/pages/ChangePassword'));
const Share = lazy(() => import(/*webpackChunkName:'DashboardPage'*/ '@/pages/Share'));
const UserStatistics = lazy(() => import(/*webpackChunkName:'CustomerPage'*/ '@/pages/UserStatistics'));
const PostDetail = lazy(() => import(/*webpackChunkName:'CustomerPage'*/ '@/pages/PostDetail'));
export default function AppRouter() {
	const location = useLocation();
	return (
		<Suspense fallback={<PageLoader />}>
			<AnimatePresence exitBeforeEnter initial={false}>
				<Switch location={location} key={location.pathname}>
					<PrivateRoute path="/" component={Dashboard} exact />
					<PrivateRoute component={Customer} path="/user" exact />
					<PrivateRoute component={SelectCustomer} path="/selectcustomer" exact />
					<PrivateRoute component={Lead} path="/lead" exact />
					<PrivateRoute component={Comment} path="/product" exact />
					<PrivateRoute component={Group} path="/group" exact />
					<PrivateRoute component={Admin} path="/admin" exact />
					<PrivateRoute component={Setting} path="/setting" exact />
					<PrivateRoute component={ChangePassword} path="/changePassword" exact />
					<PrivateRoute component={Share} path="/share" exact />
					<PrivateRoute component={UserStatistics} path="/userStatistics/:userId" exact />
					<PrivateRoute component={PostDetail} path="/report/:reportId" exact />
					<PrivateRoute component={Logout} path="/logout" exact />
					<PublicRoute path="/login" render={() => <Redirect to="/" />} />
					<Route path="*" component={NotFound} render={() => <Redirect to="/notfound" />} />
				</Switch>
			</AnimatePresence>
		</Suspense>
	);
}
