import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../../Shared/firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ContactModal = ({ item }) => {

	// Declaring the variables for the Form
	const [number, setNumber] = useState();
	const [check, setCheck] = useState(false);
	const nav = useNavigate();
	const [currUserInfo, setCurrUserInfo] = useState();

	useEffect(() => {
		if (item) getCurrUserInfo(item)
	})

	const getCurrUserInfo = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document Data: ", docSnap.data());
			setCurrUserInfo(docSnap.data());
		} else {
			toast.error('Failed to load Profile Document')
		}
	}

	// Handling Checked Box onChange
	const handleCheck = (data) => {
		if (data === 'checked') {
			setCheck(!check);
		}
	}

	const handleClose = async () => {
		// console.log(number, check)
		const newValue = { contactModal: true }
		await updateDoc(doc(db, 'users', item), newValue)
			.then(resp => { }).catch((error) => { toast.error(error.message) })
	}

	// Updating the Docs
	const onSave = async () => {
		// console.log(number, check)
		const newValue = {
			number: number,
			contactModal: true,
			shareContact: check,
		}
		await updateDoc(doc(db, 'users', item), newValue)
			.then(resp => {
				toast.success(`Contact saved successfully`)
				window.location.reload()
			}).catch((error) => {
				toast.error(error.message)
			})
	}

	return (

		<form method="dialog" className="modal-box">

			<button
				className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onClick={handleClose}
			>
				✕
			</button>
			<h3 className="font-bold text-lg">Contact Information!</h3>
			<p className="py-4">Enter your phone number, so buyers can contact you</p>

			<div className="flex flex-col w-full">
				<label className="mb-2">Phone Number</label>
				<input
					type="number"
					placeholder="Enter your number"
					name="price"
					value={number}
					autoComplete="off"
					onChange={(e) => setNumber(e.target.value)}
					className="input input-bordered w-full max-w-lg"
				/>
			</div>

			<label className="label cursor-pointer mt-3">
				<span className="label-text">Share my number with buyers</span>
				<input
					type="checkbox"
					className="checkbox checkbox-primary"
					value={check}
					onChange={() => handleCheck('checked')}
				/>
			</label>

			<div className="modal-action">
				<button className="blueBtn w-32" onClick={() => onSave()} >
					Save
				</button>
			</div>

		</form>

	)

}

export default ContactModal