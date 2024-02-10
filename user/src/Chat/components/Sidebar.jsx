import React from 'react'
import ChatNavbar from './Navbar'
import ChatSearch from './Search'
import Chats from './Chats'

const ChatSidebar = () => {

	return (

		<div className="gsidebar">

			<ChatNavbar />
			<ChatSearch />
			<Chats />

		</div>

	)

}

export default ChatSidebar