import React, { useState } from 'react'
import Helmet from '../components/Helmet';
import Loader from '../components/Loader';
import AuthLayout from '../layout/AuthLayout';
import styles from '../styles/Form.module.css'
import { HiAtSymbol } from "react-icons/hi";
import { FaFingerprint } from 'react-icons/fa'
import { auth, provider, db } from '../Shared/firebase';
import { signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleSvg } from '../custom-hooks/useImage';

function Login() {

	const [show, setShow] = useState(false);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const loginIn = async (e) => {

		e.preventDefault()
		setLoading(true)

		try {

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			)

			const user = userCredential.user

			console.log(user)
			setLoading(false)
			toast.success('Succesfully Logged In')
			navigate('/')

		} catch (error) {
			setLoading(false)
			toast.error(error.message)
		}
	}

	const loginWithGoogle = () => {

		setLoading(true);

		try {
			signInWithPopup(auth, provider)
				.then(async (res) => {

					const user = res.user;

					//Update profile
					await updateProfile(user, {
						displayName: user.displayName,
						photoURL: user.photoURL,
					});

					await setDoc(doc(db, 'users', user.email), {
						uid: user.uid,
						name: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
						number: '',
						contactModal: false,
						shareContact: false,
						followers: [],
						following: [],
					})

					//create empty user chats on firestore
					await setDoc(doc(db, "userChats", user.email), {})
						.then(() => {
							setLoading(false)
							toast.success('Successfully Looged In')
							navigate(`/profile/${user.email}`)
						})
						.catch((error) => {
							setLoading(false)
							toast.error(error.message)
						})
				})
				.catch((err) => {
					setLoading(false)
					toast.error(err.message)
				})
		} catch (error) {
			setLoading(false)
			toast.error(error.message)
		}

	}

	return (

		<Helmet title="Login">

			<AuthLayout>

				{
					loading ? <Loader /> :

						<section className='w-90% mx-auto flex flex-col px-8'>

							<div className="title">
								<h2 className='text-gray-800 text-[30px] font-bold pb-4'>
									Login With Artsyquest
								</h2>
								{/* <p className='w-3/4 mx-auto text-gray-400'>Login with your Artsyquest Account or create One!</p> */}
							</div>

							{/* form */}
							<form className='flex flex-col gap-5' onSubmit={loginIn}>
								<div className={styles.input_group}>
									<input
										type="email"
										name='email'
										placeholder='Email'
										autoComplete='off'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className={styles.input_text}
									/>
									<span className='icon flex text-gray-600 items-center px-4'>
										<HiAtSymbol size={25} />
									</span>
								</div>
								<div className={styles.input_group}>
									<input
										type={`${show ? "text" : "password"}`}
										name='password'
										placeholder='Password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className={styles.input_text}
									/>
									<span className='icon flex text-gray-600 items-center px-4' onClick={() => setShow(!show)}>
										<FaFingerprint size={25} />
									</span>
								</div>

								{/* login buttons */}
								<div className="input-button">
									<button type='submit' className={
										'w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-blue-500 hover:text-gray-700 hover:border'
									}>
										Login
									</button>
								</div>
								<div className="input-button">
									<button type='button' className={styles.button_custom}
										onClick={loginWithGoogle} >
										<img src={GoogleSvg} width="20" alt='Google Svg' height={20} className='mr-2'></img>Sign In with Google
									</button>
								</div>
							</form>

							{/* bottom */}
							<p className='text-center text-gray-400 mt-5'>
								Don't have an account yet? <Link to={'/register'} className='text-blue-700'>Sign Up</Link>
							</p>

						</section>

				}

			</AuthLayout>

		</Helmet>

	);

}

export default Login