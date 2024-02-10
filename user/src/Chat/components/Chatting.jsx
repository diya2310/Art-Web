import React, { useContext } from 'react'
import Messages from './Messages'
import ChatInput from './Input'
import { ChatContext } from '../../custom-hooks/ChatContext'
import { Close } from '../../custom-hooks/useImage'
import { useNavigate } from "react-router-dom";

const Chatting = () => {

	const { data } = useContext(ChatContext)
	const nav = useNavigate();

	return (

		<div className="gchat">

			{/* Chat Topbar */}
			<div className="gchatInfo">
				<span className='text-[18px] text-white'>{data.user?.name}</span>
				<div className="gchatIcons">
					<img src={Close} alt="delete-sign" onClick={() => nav(-1)}/>
				</div>
			</div>

			<Messages />
			<ChatInput />

		</div>

	)

}

export default Chatting