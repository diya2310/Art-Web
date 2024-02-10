import React, { useContext, useEffect, useState } from 'react'
import ChatMessage from './Message'
import { ChatContext } from '../../custom-hooks/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Shared/firebase';

const Messages = () => {

	const [messages, setMessages] = useState([]);
	const { data } = useContext(ChatContext);

	// Getting all the messages from the payload data
	useEffect(() => {
		const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
			doc.exists() && setMessages(doc.data().messages);
		});

		return () => {
			unSub();
		};
	}, [data.chatId]);

	return (

		<div className="gmessages scroll-ba">
			{messages.map((m) => (
				<ChatMessage message={m} key={m.id} />
			))}
		</div>

	)

}

export default Messages