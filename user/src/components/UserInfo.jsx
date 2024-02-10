import React, { useRef, useState, useEffect } from 'react'
import useAuth from '../custom-hooks/useAuth'
import { signOut } from 'firebase/auth';
import { toast } from "react-toastify";
import { auth, db } from '../Shared/firebase';
import { useNavigate } from 'react-router-dom';
import { arrayRemove, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import LoginModal from './Modals/LoginModal';
import { BsThreeDots } from 'react-icons/bs'
import { MdChat } from 'react-icons/md'
import FollowModal from './Modals/FollowModal';
import ContactModal from './Modals/ContactModal';

function UserInfo({ userInfo }) {

	// const id = userInfo.email ? userInfo.email : "";
	const nav = useNavigate();
	const [open, setOpen] = useState(false);
	const menuRef = useRef();

	const { currentUser } = useAuth();
	const [currUserInfo, setCurrUserInfo] = useState();
	const [followed, setFollowed] = useState(false);
	const followingLen = userInfo.following.length;
	const followersLen = userInfo.followers.length;

	useEffect(() => {
		let handler = (e) => {
			if (!menuRef.current.contains(e.target)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handler);
		if (currentUser?.email) getCurrUserInfo(currentUser?.email)
		return () => {
			document.removeEventListener("mousedown", handler);
		}
	});

	const onLogoutClick = () => {
		signOut(auth).then(() => {
			toast.success('Logged out Successfully')
			nav('/')
			window.location.reload();
		}).catch(err => {
			toast.error(err.message)
		})
	}

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

	// Getting the Following Status of the Profile
	const getFollowStatus = followers => {
		let status = false;
		followers.map(item => {
			if (item.userId === currentUser?.email) {
				status = true;
			} else {
				status = false;
			}
			return null
		});
		return status;
	}

	// Logic for Following Button
	const followUser = async item => {

		let tempFollowers = item.followers;
		let tempFollowing = [];

		// Logic for Updating Following list in Current User Side
		await getDoc(doc(db, "users", currentUser.email))
			.then(snapshot => {
				tempFollowing = snapshot.data().following;
				// console.log("TEMPFOLLOWING", tempFollowing)

				if (tempFollowing.length > 0) {
					tempFollowing.map(item2 => {
						if (item2.userId === item.email) {
							// Unfollow Process
							updateDoc(doc(db, 'users', currUserInfo.email), {
								following: arrayRemove({
									name: item.name,
									userId: item.email,
									userImg: item.photoURL,
								})
							})
								.then(resp => { })
								.catch((error) => {
									toast.error(error.message)
								})
						} else {
							updateDoc(doc(db, 'users', currUserInfo.email), {
								following: arrayUnion({
									name: item.name,
									userId: item.email,
									userImg: item.photoURL,
								})
							})
								.then(resp => { })
								.catch((error) => {
									toast.error(error.message)
								})
						}
						return null;
					});
				} else {
					updateDoc(doc(db, 'users', currUserInfo.email), {
						following: arrayUnion({
							name: item.name,
							userId: item.email,
							userImg: item.photoURL,
						})
					})
						.then(resp => { })
						.catch((error) => {
							toast.error(error.message)
						})
				}

				// Logic for Updating Followers list in User Side
				if (tempFollowers.length > 0) {
					tempFollowers.map(item1 => {
						if (item1.userId === currentUser.email) {
							// Unfollow Process
							updateDoc(doc(db, 'users', item.email), {
								followers: arrayRemove({
									name: currUserInfo.name,
									userId: currentUser?.email,
									userImg: currUserInfo.photoURL
								})
							})
								.then(resp => {
									window.location.reload()
									setFollowed(false);
									const mssg = followed ? "You unfollowed" : "You started following"
									toast.success(`${mssg} ${item.name}`)
								}).catch((error) => {
									toast.error(error.message)
								})
						} else {
							updateDoc(doc(db, 'users', item.email), {
								followers: arrayUnion({
									name: currUserInfo.name,
									userId: currentUser?.email,
									userImg: currUserInfo.photoURL
								})
							})
								.then(resp => {
									window.location.reload()
									setFollowed(true);
									const mssg = followed ? "You unfollowed" : "You started following"
									toast.success(`${mssg} ${item.name}`)
								}).catch((error) => {
									toast.error(error.message)
								})
						}
						return null;
					});
				} else {
					updateDoc(doc(db, 'users', item.email), {
						followers: arrayUnion({
							name: currUserInfo.name,
							userId: currentUser?.email,
							userImg: currUserInfo.photoURL
						})
					})
						.then(resp => {
							window.location.reload()
							setFollowed(true);
							const mssg = followed ? "You unfollowed" : "You started following"
							toast.success(`${mssg} ${item.name}`)
						}).catch((error) => {
							toast.error(error.message)
						})
				}

			})
			.catch(error => {
				console.log(error);
				toast(error)
			})

	}

	function handleUserMenu() {
		setOpen(!open)
		if (userInfo.email !== currentUser?.email) {
			window.location.href = `mailto:${userInfo.email}`;
		} else window.contactModal.showModal();
	}

	const handleWhatsapp = () => {
		setOpen(!open)
		window.location.href = `https://wa.me/${userInfo.number}`;
	}

	const handleSelect = async () => {

		if (!currentUser) {
			showLoginModal();
		} else {

			if (currentUser.email !== userInfo.email) {

				// Check whether the group (chats in firestore) exists, if not create one.
				const combinedId =
					currentUser.uid > userInfo.uid
						? currentUser.uid + userInfo.uid
						: userInfo.uid + currentUser.uid

				try {
					const res = await getDoc(doc(db, 'chats', combinedId))

					if (!res.exists()) {

						// Create Chat in Chats Collection
						await setDoc(doc(db, 'chats', combinedId), { messages: [] });

						// create user chats for currentUser
						await updateDoc(doc(db, 'userChats', currentUser.email), {
							[combinedId + ".userInfo"]: {
								uid: userInfo.uid,
								name: userInfo.name,
								photoURL: userInfo.photoURL,
								email: userInfo.email
							},
							[combinedId + ".date"]: serverTimestamp()
						});

						// create user chats for other User
						await updateDoc(doc(db, 'userChats', userInfo.email), {
							[combinedId + ".userInfo"]: {
								uid: currentUser.uid,
								name: currentUser.displayName,
								photoURL: currentUser.photoURL,
								email: currentUser.email,
							},
							[combinedId + ".date"]: serverTimestamp()
						});
					}
				} catch (err) { toast(err.message) }

				nav(`/chat`)

			} else nav('/chat')
		}

	}

	// Method for showing the Modal
	const showLoginModal = () => window.my_modal_11.showModal();
	const showFollowersModal = () => window.followersModal.showModal();
	const showFollowingModal = () => { window.followingModal.showModal(); }

	return (

		<div className='flex flex-col items-center'>

			<img src={userInfo.photoURL}
				alt='userImage'
				width={80}
				height={80}
				className='rounded-full'
			/>

			<h2 className='text-[30px] font-semibold mt-2'>
				{userInfo.name}
			</h2>
			<h2 className='text-gray-400'>@{userInfo.email}</h2>

			<div className='flex gap-2 mt-4'>
				<h3 className='cursor-pointer font-semibold lg:text-[20px] md:text-[18px]' onClick={() => showFollowersModal()}>
					{
						followersLen > 1 ? `${followersLen} Followers`
							: `${followersLen} Follower`
					}
				</h3>
				<h3> . </h3>
				<h3 className='cursor-pointer font-semibold lg:text-[20px] md:text-[18px]' onClick={() => showFollowingModal()}>
					{followingLen} Following
				</h3>
			</div>

			<div className='flex gap-6 mt-4'>

				<button className=' hover:bg-gray-200 py-2 px-3 font-bold rounded-full dark:hover:bg-gray-400 text-3xl dark:hover:text-black duration-500'
					onClick={handleSelect}
				>
					<MdChat />
				</button>

				{
					currentUser
						? 	// Checking if user logged in, then show logout Button
						currentUser.email === userInfo.email
							? <button className='blueBtn' onClick={() => onLogoutClick()}>
								Logout
							</button>
							: <button className='blueBtn'
								onClick={() => currentUser ? followUser(userInfo) : null}
							>
								{
									getFollowStatus(userInfo.followers) ? 'Following' : 'Follow'
								}
							</button>
						: <button className='blueBtn'
							onClick={() => currentUser ? followUser(userInfo) : showLoginModal()}
						>
							{
								getFollowStatus(userInfo.followers) ? 'Following' : 'Follow'
							}
						</button>
				}

				<div className='' ref={menuRef}>

					<BsThreeDots
						className='dark:hover:bg-gray-400 pinDetailBtn dark:hover:text-black'
						onClick={() => setOpen(!open)}
					/>
					{
						open &&
						<div className='bg-white dark:bg-[#272727] dark:text-gray-200 p-4 w-52 shadow-lg absolute rounded-md z-10'>
							<ul>
								<li className='mt-2 p-2 text-md cursor-pointer rounded hover:bg-blue-100 dark:hover:bg-[#2b2b2b]' onClick={() => handleUserMenu()}>
									{
										userInfo.email === currentUser?.email
											? `Settings` : `Contact with Email`
									}

								</li>
							</ul>
							{
								userInfo.email === currentUser?.email ? null :
									userInfo.shareContact === true ?
										<ul>
											<li className='mt-2 p-2 text-md cursor-pointer rounded hover:bg-blue-100 dark:hover:bg-[#2b2b2b]' onClick={() => handleWhatsapp()}>
												Contact Whatsapp
											</li>
										</ul>
										: null
							}
						</div>
					}
				</div>

			</div>

			{/* Modals */}
			<dialog id="my_modal_11" className="modal modal-bottom sm:modal-middle">
				<form method="dialog" className="modal-box">
					<LoginModal title={`follow ${userInfo.name}`} />
				</form>
			</dialog>

			<dialog id="followersModal" className="modal modal-bottom sm:modal-middle">
				<FollowModal list={userInfo.followers}
					title={
						followersLen > 1 ? `${followersLen} Followers`
							: `${followersLen} Follower`
					}
				/>
			</dialog>

			<dialog id="followingModal" className="modal modal-bottom sm:modal-middle">
				<FollowModal list={userInfo.following}
					title={`Following`}
				/>
			</dialog>

			<dialog id="contactModal" className="modal modal-bottom sm:modal-middle">
				<ContactModal item={currentUser?.email} />
			</dialog>

		</div>
	)
}

export default UserInfo