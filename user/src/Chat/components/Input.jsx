import React, { useContext, useState } from 'react'
import useAuth from '../../custom-hooks/useAuth'
import { ChatContext } from '../../custom-hooks/ChatContext'
import { Attach } from '../../custom-hooks/useImage'
import { storage, db } from '../../Shared/firebase'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-toastify'
import { BiSend } from 'react-icons/bi'

const ChatInput = () => {

	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const { data } = useContext(ChatContext)
	const { currentUser } = useAuth();

	// Handles Once the Enter key is pressed and Send Function is Trigered
	const handleKey = e => e.code === "Enter" && handleSend();

	// Sending the File Images and also Text
	const handleSend = async () => {

		if (text !== '') {

			if (img) {

				const storageRef = ref(storage, `chatImages/${uuid()}`);

				uploadBytes(storageRef, img).then((snapshot) => {
					toast('Image got selected')
				}).then(resp => {
					getDownloadURL(storageRef).then(async (url) => {
						await updateDoc(doc(db, "chats", data.chatId), {
							messages: arrayUnion({
								id: uuid(),
								text,
								senderId: currentUser.uid,
								date: Timestamp.now(),
								img: url,
							}),
						});
					})
				}).catch((err) => {
					toast.error(err.message)
				})


			} else {
				await updateDoc(doc(db, "chats", data.chatId), {
					messages: arrayUnion({
						id: uuid(),
						text,
						senderId: currentUser.uid,
						date: Timestamp.now(),
					}),
				});
			}

			await updateDoc(doc(db, "userChats", currentUser.email), {
				[data.chatId + ".lastMessage"]: {
					text,
				},
				[data.chatId + ".date"]: serverTimestamp(),
			});

			await updateDoc(doc(db, "userChats", data.user.email), {
				[data.chatId + ".lastMessage"]: { text },
				[data.chatId + ".date"]: serverTimestamp(),
			});

			setText("");
			setImg(null);

		} else toast("Type something to send");

	};

	return (

		<div className='ginput'>

			<input
				type="text"
				className='dark:bg-white'
				placeholder="Type something..."
				onChange={(e) => setText(e.target.value)}
				value={text}
				onKeyDown={handleKey}
			/>

			<div className="gsend">
				<input
					type="file"
					style={{ display: "none" }}
					id="file"
					onChange={(e) => setImg(e.target.files[0])}
				/>
				<label htmlFor="file" className="glabel">
					<img src={Attach} alt="Attachment" />
				</label>

				<button onClick={handleSend} className='rounded-lg'>
					<BiSend className='text-2xl font-bold w-20' />
				</button>
			</div>

		</div>

	)

}

export default ChatInput