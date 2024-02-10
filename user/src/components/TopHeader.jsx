import React, { useEffect, useState } from 'react'
import { HiSearch } from 'react-icons/hi'
import { RiFilter3Fill } from 'react-icons/ri'
import { FiSun, FiMoon } from 'react-icons/fi'
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../custom-hooks/useAuth'
import { AppLogo } from '../custom-hooks/useImage';
import LoginModal from './Modals/LoginModal';
import FilterModal from './Modals/FilterModal';
import { toast } from 'react-toastify';
import { db } from '../Shared/firebase';
import { doc, getDoc } from 'firebase/firestore';

const TopHeader = () => {

	const { currentUser } = useAuth();
	const [searchQuery, setSearchQuery] = useState('');
	const [userInfo, setUserInfo] = useState();
	const nav = useNavigate();

	useEffect(() => {
		if (currentUser?.email) {
			getUserInfo(currentUser.email);
		}
	})

	const getUserInfo = async (userId) => {

		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document Data: ", docSnap.data());
			setUserInfo(docSnap.data())
		} else {
			toast.error('Failed to load Profile Document')
		}

	}

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.length !== 0) {
			nav(`/search?ls=${searchQuery}`)
			setSearchQuery('');
		}
		else toast('Please enter some values to search')
	}

	return (

		<div className='flex justify-between gap-3 md:gap-2 items-center p-6'>

			{/* App Logo Image */}
			<img src={AppLogo} alt='App Logo' width={60} height={60} className='hover:bg-gray-300 p-2 rounded-full cursor-pointer' />

			{/* Home and Post Buttons */}
			<button className='bg-black text-white p-2 px-4 rounded-full text-[20px]
			hidden md:block dark:bg-gray-300 dark:text-black'>
				<Link to={'/'}>Home</Link>
			</button>
			<button className='font-semibold p-2 px-4 rounded-full text-[20px]'
				onClick={() => currentUser ? null : window.loginModal.showModal()}
			>
				{
					currentUser ? <Link to={'/post-pin'}>Post</Link> :
						'Post'
				}
			</button>

			{/* Search Icon and Input */}
			<div className='bg-[#e9e9e9] p-2 px-6 gap-3 items-center rounded-full w-full hidden md:flex dark:bg-gray-300'>
				<HiSearch className='text-[25px] text-gray-500' />
				<form onSubmit={handleSearch} className='text-black text-[23px] w-full'>
					<input type="text"
						placeholder='Search'
						className='bg-transparent outline-none w-full'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</form>
			</div>

			{/* <FiSun className='text-[16px] md:text-[60px] text-gray-500 cursor-pointer px-2' onClick={handleTheme}/> */}

			<RiFilter3Fill className='text-[20px] md:text-[60px] text-gray-500 cursor-pointer px-2' onClick={() => window.filterModal.showModal()} />

			{/* Checking if User logged in, Showing Profile Image or Login Button */}
			{
				userInfo ?

					<Link to={`/profile/${currentUser?.email}`} className='dark:text-white'>
						<img src={userInfo.photoURL} alt='' width={80} height={80} className='hover:bg-gray-300 p-2 rounded-full cursor-pointer ' />
					</Link> :

					<button className='font-semibold p-2 px-4 rounded-full'>
						<Link to={'/login'}>Login</Link>
					</button>

			}

			<dialog id="loginModal" className="modal modal-bottom sm:modal-middle">
				<form method="dialog" className="modal-box">
					<LoginModal title={'publish your post'} />
				</form>
			</dialog>

			<dialog id="filterModal" className="modal modal-bottom sm:modal-middle">
				<FilterModal />
			</dialog>

		</div>
	)
}

export default TopHeader