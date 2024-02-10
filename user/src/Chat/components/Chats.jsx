import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react'
import { db } from '../../Shared/firebase';
import useAuth from '../../custom-hooks/useAuth'
import { ChatContext } from '../../custom-hooks/ChatContext'

const Chats = () => {

	const { dispatch } = useContext(ChatContext)
	const { currentUser } = useAuth();
	const [chats, setChats] = useState([]);

	useEffect(() => {

		const getChats = () => {
			const unsub = onSnapshot(doc(db, 'userChats', currentUser.email), (doc) => {
				setChats(doc.data());
			})
			return () => { unsub(); }
		}
		currentUser.email && getChats();

	}, [currentUser.email])

	const handleSelect = (u) => dispatch({ type: "CHANGE_USER", payload: u });

	return (

		<div className="gchats">

			{chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (

				<div
					className="guserChat"
					key={chat[0]}
					onClick={() => handleSelect(chat[1].userInfo)}
				>
					<img src={chat[1].userInfo.photoURL} alt="" />
					<div className="guserChatInfo">
						<span>{chat[1].userInfo.name}</span>
						<p>{chat[1].lastMessage?.text}</p>
					</div>
				</div>

			))}

		</div>

	);

}

export default Chats