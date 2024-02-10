import React from 'react'
import useAuth from '../../custom-hooks/useAuth'
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const ChatNavbar = () => {

	const { currentUser } = useAuth();
	const nav = useNavigate();

	return (

		<div className="gnavbar">

			<BiLeftArrowAlt className='pinDetailBtn hover:text-black'
				onClick={() => nav(-1)}
			/>

			<div className='guser'>

				<img src={currentUser.photoURL} alt="Current User Image" />
				<span>{currentUser.displayName}</span>
				{/* <button>Logout</button> */}

			</div>

		</div>

	)

}

export default ChatNavbar