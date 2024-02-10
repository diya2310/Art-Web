import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Shared/firebase'
import useAuth from '../../custom-hooks/useAuth'
import { toast } from 'react-toastify'

const ChatSearch = () => {

	const { currentUser } = useAuth();

	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [err, setErr] = useState(false);
	const [zero, setZero] = useState(false);

	useEffect(() => {
		if (username === '') {
			setUser(null)
			setZero(false)
		}
	}, [username])

	const handleSearch = async () => {

		const q = query(collection(db, 'users'), where("name", "==", username));

		try {
			const querySnapshot = await getDocs(q);
			querySnapshot.empty ? setZero(true) : setZero(false)
			querySnapshot.forEach((doc) => { setUser(doc.data()) })
		} catch (error) {
			setErr(true);
		}

	}

	// Handles Once the Enter key is pressed and Search Function i Trigered
	const handleKey = e => e.code === "Enter" && handleSearch();

	const handleSelect = async () => {

		// Check whether the group (chats in firestore) exists, if not create one.
		const combinedId =
			currentUser.uid > user.uid
				? currentUser.uid + user.uid
				: user.uid + currentUser.uid

		try {
			const res = await getDoc(doc(db, 'chats', combinedId))

			if (!res.exists()) {

				// Create Chat in Chats Collection
				await setDoc(doc(db, 'chats', combinedId), { messages: [] });

				// create user chats for currentUser
				await updateDoc(doc(db, 'userChats', currentUser.email), {
					[combinedId + ".userInfo"]: {
						uid: user.uid,
						name: user.name,
						photoURL: user.photoURL,
						email: user.email
					},
					[combinedId + ".date"]: serverTimestamp()
				});
				
				// create user chats for other User
				await updateDoc(doc(db, 'userChats', user.email), {
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

		setUser(null);
		setUsername('');

	}

	return (

		<div className="gsearch">

			<div className="gsearchForm">
				<input
					type="text"
					placeholder='Find a user...'
					value={username}
					onKeyDown={handleKey}
					onChange={e => setUsername(e.target.value)}
				/>
			</div>
			{err && <span>User not found!</span>}

			{
				zero === true
					? <span className='text-white pl-2.5'>User not found!</span>
					: user && <div className="guserChat" onClick={handleSelect}>
						<img src={user.photoURL} alt="User" />
						<div className="guserChatInfo">
							<span>{user.name}</span>
						</div>
					</div>
			}

		</div>

	)

}

export default ChatSearch