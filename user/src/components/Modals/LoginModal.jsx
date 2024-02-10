import React, { useState } from 'react'
import { AppLogo, GoogleSvg } from '../../custom-hooks/useImage';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../../Shared/firebase';

function LoginModal({title}) {

	const navigate = useNavigate()

	const loginWithGoogle = () => {

		// setLoading(true);
		signInWithPopup(auth,provider)
		.then( async (res) => {
			
			const user = res.user;

			await setDoc(doc(db, 'users', user.email),{
				uid: user.uid,
				name: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
				followers: [],
				following: [],
			})
			.then(() => {
				// setLoading(false)
				toast.success('Successfully Looged In')
				navigate('/')
			})
			.catch ((error) => {
				// setLoading(false)
				toast.error(error.message)
			})
		})
		.catch((err) => {
			// setLoading(false)
			toast.error(err.message)
		})

	}
  
	return (
		
		<>
			
			<div className='flex mb-0 justify-end'>
				<button className="text-4xl float-right">&times;</button>
			</div>

			<div className='flex flex-col mt-0 pt-0 items-center'>

			<img src={AppLogo} alt='App Logo' width={70} height={70} className='p-2'/>
			
				<h2 className='mt-3 text-2xl font-semibold' >Join Artsyquest to {title}</h2>

				<p className='mt-3 text-sm'>Unlimited free access to the world's best art works</p>

				<button className='blueBtn mt-5 w-full'>
					<Link to={'/register'}>Continue with Email</Link>
				</button>

				<div className="w-full mt-4">
					<button className='w-full dark:border-gray-300 rounded-lg py-2.5 flex justify-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral border border-neutral' onClick={loginWithGoogle}>
						<img src={GoogleSvg} width="20" alt='Google Svg' height={20} className='mr-2'></img>Sign In with Google
					</button>
				</div>

				<p className='mt-6'>Already a Member? <span className='font-bold text-lg cursor-pointer'><Link to={'/login'}>Log in</Link></span></p>

			</div>

		</>
	);

}

export default LoginModal