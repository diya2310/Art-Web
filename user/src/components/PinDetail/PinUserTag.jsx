import React, { useState, useEffect } from 'react'
import FailedActivity from '../Activity/FailedActivity'
import { NavLink, useNavigate } from 'react-router-dom'
import { db } from '../../Shared/firebase';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import useAuth from '../../custom-hooks/useAuth';
import EditPin from '../Modals/Edit-Pin';
import LoginModal from '../Modals/LoginModal';

function PinUserTag({ user, pin }) {

	const [userInfo, setUserInfo] = useState();
	const [currUserInfo, setCurrUserInfo] = useState();
	const [followed, setFollowed] = useState(false);
	const [selectedPin, setSelectedPin] = useState([]);
	const ids = user.email;

	const { currentUser } = useAuth();
	const nav = useNavigate()

	useEffect(() => {
		if (ids) {
			getUserInfo(ids);
		}
		if (currentUser?.email) getCurrUserInfo(currentUser?.email)
	}, [ids])

	const getUserInfo = async (userId) => {

		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document Data: ", docSnap.data());
			setUserInfo(docSnap.data());
		} else {
			toast.error('Failed to load Profile Document')
		}

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

	// Method for showing the Modal
	const showEditModal = () => { window.my_modal_4.showModal(); setSelectedPin(pin) }
	const showDeleteModal = () => { window.deleteModal.showModal(); setSelectedPin(pin) }
	const showLoginModal = () => window.my_modal_1.showModal();

	// Method for Deleting the Post
	const delPost = async () => {
		await deleteDoc(doc(db, 'pins', pin.id))
			.then(() => {
				toast('Post has been deleted successfully')
				nav(`/profile/${pin.email}`)
			}).catch(() => {
				toast('Something went wrong');
			})
	}

	return (

		<>
			{
				user
					? <div className='flex gap-40 items-center justify-between'>

						<NavLink to={`/profile/${ids}`}>
							<div className='flex gap-3 items-center'>
								<img src={user.photoURL} alt='userImage' width={45} height={45} className='rounded-full' />

								<div>
									<h2 className='text-[16px] font-medium'>
										{user.displayName}
									</h2>
									<h2 className='text-[14px]'>{user.email}</h2>
								</div>
							</div>
						</NavLink>

						<div className='float-right'>

							{
								currentUser?.email === ids
									? <div className="dropdown dropdown-hover">
										<label tabIndex={0} className="btn m-1">Actions</label>
										<ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
											<li onClick={() => currentUser ? showEditModal() : null}>
												<a>Edit</a>
											</li>
											<li onClick={() => currentUser ? showDeleteModal() : null}>
												<a>Delete</a>
											</li>
										</ul>
									</div>

									: <button className='blueBtn'
										onClick={() => currentUser ? followUser(userInfo) : showLoginModal()}
									>
										{
											userInfo
												? getFollowStatus(userInfo.followers)
													? 'Following'
													: 'Follow'
												: null
										}
									</button>
							}

						</div>

					</div>
					: <FailedActivity mssg={'No Such User Exists'} />
			}

			<dialog id="deleteModal" className="modal modal-bottom sm:modal-middle">
				<form method="dialog" className="modal-box">
					<h3 className="font-bold text-3xl">{pin.title}</h3>
					<h3 className="py-4">Are you sure, you want to delete this post?</h3>
					<div className="modal-action">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn">Close</button>
						<button className="saveBtn" onClick={() => delPost()}>Delete</button>
					</div>
				</form>
			</dialog>

			<dialog id="my_modal_4" className="modal">
				<EditPin pin={selectedPin} />
			</dialog>

			<dialog id="my_modal_1" className="modal modal-bottom sm:modal-middle">
				<form method="dialog" className="modal-box">
					<LoginModal title={`follow ${pin.userName}`} />
				</form>
			</dialog>

		</>

	)

}

export default PinUserTag