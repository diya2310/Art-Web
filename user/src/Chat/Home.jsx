import React from 'react'
import ChatSidebar from './components/Sidebar';
import Chatting from './components/Chatting';
import Helmet from '../components/Helmet';
import '../styles/overall.scss'

const ChatHome = () => {

	return (

		<Helmet title="Chat">

			<div className='ghome'>
				<div className="gcontainerr">
					<ChatSidebar />
					<Chatting />
				</div>
			</div>

		</Helmet>

	);

}

export default ChatHome