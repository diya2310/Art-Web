import React, { useContext, useEffect, useRef } from 'react'
import useAuth from '../../custom-hooks/useAuth'
import { ChatContext } from '../../custom-hooks/ChatContext'

const ChatMessage = ({ message }) => {

	const { data } = useContext(ChatContext)
	const { currentUser } = useAuth();

	const ref = useRef();

	// Setting Scroll smooth effect while scroll
	useEffect(() => {
		ref.current?.scrollIntoView({ behavior: "smooth" });
	}, [message]);

	return (

		<div
			className={`gmessage ${message.senderId === currentUser.uid && "gowner"}`}
			ref={ref}
		>
			<div className="gmessageInfo">
				<img src={
					message.senderId === currentUser.uid
						? currentUser.photoURL
						: data.user.photoURL
				} alt="User" />
				<span className='mt-1 text-black text-[12px]'>
					{message.date.toDate().toLocaleTimeString()}
				</span>
			</div>

			<div className="gmessageContent">
				<p>{message.text}</p>
				{
					message.img &&
					<img
						src={message.img}
						alt="User"
						className='mt-3 rounded-lg'
					/>
				}
			</div>
		</div>

	)

}

export default ChatMessage