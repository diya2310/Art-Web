import AuthLayout from '../layout/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import { HiAtSymbol, HiOutlineUser } from "react-icons/hi";
import { FaFingerprint } from 'react-icons/fa'
import { useState } from 'react';
import Helmet from '../components/Helmet';
import { auth, db } from '../Shared/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'
import { toast } from "react-toastify";
import Loader from '../components/Loader';

export default function Register() {

    const [show, setShow] = useState({ password: false });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const signup = async (e) => {

        e.preventDefault()
        setLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )

            try {

                const user = userCredential.user

                //Update profile
                await updateProfile(user, {
                    displayName: username,
                    photoURL: process.env.REACT_APP_USER_URL,
                });

                // Store user data in firestore
                setDoc(doc(db, 'users', user.email), {
                    uid: user.uid,
                    name: username,
                    email: email,
                    photoURL: process.env.REACT_APP_USER_URL,
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
                        toast.success('Account Created Successfully')
                        navigate(`/profile/${user.email}`)
                    })
            } catch (error) {
                setLoading(false)
                toast.error(error.message)
            }

        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    }

    return (

        <Helmet title={'Register'}>

            <AuthLayout>

                {
                    loading ? <Loader /> :

                        <section className='w-90% mx-auto flex flex-col px-8'>

                            <div className="title">
                                <h2 className='text-gray-800 text-[30px] font-bold pb-4'>
                                    Start your Journey
                                </h2>
                            </div>

                            {/* form */}
                            <form className='flex flex-col gap-5' onSubmit={signup}>
                                <div className={styles.input_group}>
                                    <input
                                        type="text"
                                        name='Username'
                                        placeholder='Fullname'
                                        autoComplete='off'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={styles.input_text}
                                    />
                                    <span className='icon flex items-center px-4'>
                                        <HiOutlineUser size={25} />
                                    </span>
                                </div>
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
                                    <span className='icon flex items-center px-4'>
                                        <HiAtSymbol size={25} />
                                    </span>
                                </div>
                                <div className={styles.input_group}>
                                    <input
                                        type={`${show.password ? "text" : "password"}`}
                                        name='password'
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={styles.input_text}
                                    />
                                    <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password })}>
                                        <FaFingerprint size={25} />
                                    </span>
                                </div>

                                {/* login buttons */}
                                <div className="input-button">
                                    <button
                                        type='submit'
                                        className={
                                            'w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md py-3 text-gray-50 text-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-blue-500 hover:text-gray-700 hover:border'
                                        }
                                        onClick={signup}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </form>

                            {/* bottom */}
                            <p className='text-center text-gray-400 mt-5'>
                                Have an account? <Link to={'/login'} className='text-blue-700'>
                                    Sign In
                                </Link>
                            </p>

                        </section>

                }

            </AuthLayout>

        </Helmet>
    )
}