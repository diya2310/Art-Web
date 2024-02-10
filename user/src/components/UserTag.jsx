import React, { useEffect, useState } from 'react'
import FailedActivity from './Activity/FailedActivity'
import { NavLink } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Shared/firebase';
import { toast } from 'react-toastify';

function UserTag({ id }) {

	const [currUserInfo, setCurrUserInfo] = useState();

	useEffect(() => {
		if (id.email) getCurrUserInfo(id.email)
	})

	const getCurrUserInfo = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document Data: ", docSnap.data());
			setCurrUserInfo(docSnap.data());
		} else {
			toast.error('Failed to load Profile Document')
		}
	}

	return (

		<NavLink to={`/profile/${id.email}`}>
			{
				currUserInfo
					? <div className='flex gap-3 items-center'>
						<img src={currUserInfo.photoURL} alt='userImage' width={45} height={45} className='rounded-full' />

						<div>
							<h2 className='text-[14px] font-medium'>
								{currUserInfo.name}
							</h2>
							<h2 className='text-[12px]'>{currUserInfo.email}</h2>
						</div>

					</div>
					: <FailedActivity mssg={'No Such User Exists'} />
			}
		</NavLink>

	)

}

export default UserTag