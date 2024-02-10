import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ChatRoute'
import PostPin from '../pages/PostPin';
import MyProfile from '../pages/MyProfile';
import PinDetail from '../pages/PinDetail';
import FilterPage from '../pages/FilterPage';
import SearchPage from '../pages/SearchPage';
import ChatHome from '../Chat/Home';

const Routers = () => {
	return (
		<Routes>

			<Route path='/' element={<Navigate to='home' />} />
			<Route path='home' element={<Home />} />
			<Route path='login' element={<Login />} />
			<Route path='register' element={<Register />} />
			<Route path='pin/:id' element={<PinDetail />} />
			<Route path='profile/:id' element={<MyProfile />} />
			<Route path='post-pin' element={<PostPin />} />
			<Route path='filter-result/:id' element={<FilterPage />} />
			<Route path='search' element={<SearchPage />} />
			<Route path='chat' element={<ChatHome />} />
			

			<Route path='/*' element={<ProtectedRoute />}>
			</Route>

		</Routes>
	);
};

export default Routers;