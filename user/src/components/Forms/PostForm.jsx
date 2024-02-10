import React, { useState } from 'react'
import UploadImage from '../UploadImage'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import UserTag from '../UserTag'
import { db, storage } from '../../Shared/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../custom-hooks/useAuth'
import { toast } from "react-toastify";
import { sleep } from "../../custom-hooks/useImage";

function PostForm() {

	// Declaring the variables for the Form
	const [title, setTitle] = useState();
	const [desc, setDesc] = useState();
	const [price, setPrice] = useState();
	const [loc, setLoc] = useState();
	const [cat, setCat] = useState();
	const [file, setFile] = useState();

	// Declaring the Pin ID as current Time
	const postId = Date.now().toString();

	// Declaring the General Things
	const nav = useNavigate();
	const { currentUser } = useAuth();

	// On Save method to call the UploadFile Function
	const onSave = () => uploadFile();

	const uploadFile = () => {

		try {
			const storageRef = ref(storage, 'pin-images/' + file.name);
			uploadBytes(storageRef, file).then((snapshot) => {
				console.log("File Uploaded")
			}).then(resp => {
				getDownloadURL(storageRef).then(async (url) => {
					console.log("DownloadUrl", url);
					const postData = {
						fav: [],
						title: title,
						desc: desc,
						price: price,
						cat: cat,
						image: url,
						userName: currentUser.displayName,
						userLocation: loc,
						email: currentUser.email,
						userImage: currentUser.photoURL,
						id: postId,
					}

					const id = toast.loading("Please wait, while we publish your post")
					await setDoc(doc(db, 'pins', postId), postData).then(async resp => {
						// toast.success('Post has been published Successfully')
						await sleep(3)
						toast.update(id, {
							render: "Post has been Published Successfully",
							type: "success",
							isLoading: false,
							autoClose: 3000
						});
						nav('/')
					}).catch((error) => {
						toast.update(id, {
							render: `${error.message}`,
							type: "error",
							isLoading: false,
							autoClose: 3000,
						});
					})

				})
			}).catch((err) => {
				toast.error(err.message)
			})
		} catch (error) {
			toast.error('All fields are required to publish')
		}
	}

	return (

		<div className='dark:bg-black bg-white p-16 rounded-2xl'>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

				<UploadImage setFile={(file) => setFile(file)} />

				<div className="col-span-2">
					<div className='w-[100%]'>
						<input type="text" placeholder='Add your title' name='pinTitle'
							autoComplete='off'
							required
							onChange={(e) => setTitle(e.target.value)}
							className='text-[35px] outline-none font-bold w-full
							border-b-[2px] border-gray-400 placeholder-gray-400 dark:bg-black'
						/>
						<h2 className='text-[12px] mb-8 w-full  text-gray-400'>The first 40 Charaters are
							what usually show up in feeds</h2>

						<UserTag id={currentUser} />

						<textarea type="text"
							name='pinDesc'
							autoComplete='off'
							required
							onChange={(e) => setDesc(e.target.value)}
							placeholder='Tell everyone what your art is about'
							className=' outline-none  w-full mt-6 text-[16px]
							border-b-[2px] border-gray-400 placeholder-gray-400 dark:bg-black'
						/>

						<select
							name='pinCat'
							required
							className='outline-none w-full mt-[25px] pb-4 text-[16px] border-b-[2px] border-gray-400 dark:bg-black' value={cat} onChange={e => setCat(e.target.value)}
						>
							<option selected disabled>Select Category</option>
							<option>Canvas Painting</option>
							<option>Water Painting</option>
							<option>Digital Art</option>
							<option>Portrait</option>
							<option>Drawing</option>
							<option>Sculpture</option>
							<option>Pencil Carving</option>
						</select>

						<input type="number"
							name='pinPrice'
							autoComplete='off'
							required
							onChange={(e) => setPrice(e.target.value)}
							placeholder='Quote your price'
							className=' outline-none  w-full  pb-4 mt-[30px]
								border-b-[2px] border-gray-400 placeholder-gray-400 dark:bg-black'
						/>

						<input type="text"
							name='pinLoc'
							autoComplete='off'
							required
							onChange={(e) => setLoc(e.target.value)}
							placeholder='Where are you from?'
							className=' outline-none  w-full  pb-4 mt-[30px]
								border-b-[2px] border-gray-400 placeholder-gray-400 dark:bg-black'
						/>

					</div>
				</div>

			</div>

			<div className='mt-[40px] pb-0'>
				<button onClick={() => onSave()} className='blueBtn w-full h-12'>
					<span>Publish</span>
				</button>
			</div>

		</div>

	);

}

export default PostForm