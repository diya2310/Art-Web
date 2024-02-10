import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ChatHome from '../Chat/Home'

const ChatRoute = () => {

	return (

		<Routes>

			<Route path='chat' element={<ChatHome />} />

		</Routes>

	)
}

export default ChatRoute