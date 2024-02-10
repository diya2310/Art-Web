import React, { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Shared/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sleep } from "../../custom-hooks/useImage";

function PinEditForm({ pin }) {

	// Declaring the variables for the Form
	const [title, setTitle] = useState();
	const [desc, setDesc] = useState();
	const [price, setPrice] = useState();
	const [loc, setLoc] = useState();
	const [cat, setCat] = useState();

	const nav = useNavigate();

	useEffect(() => {
		if (pin) {
			setTitle(pin.title);
			setDesc(pin.desc);
			setPrice(pin.price);
			setLoc(pin.userLocation);
			setCat(pin.cat);
		}
	}, [pin])

	const onEdit = async () => {

		const id = toast.loading("Please wait, while we update your post")

		const postData = {
			title: title,
			desc: desc,
			price: price,
			cat: cat,
			userLocation: loc,
		}

		await updateDoc(doc(db, 'pins', pin.id), postData).then(async resp => {
			// toast.success('Post has been published Successfully')
			await sleep(3)
			toast.update(id, {
				render: "Post has been Updated Successfully",
				type: "success",
				isLoading: false,
				autoClose: 3000
			});
			nav(`/`)
		}).catch((error) => {
			toast.update(id, {
				render: `${error.message}`,
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			nav(`/pin/${pin.id}`)
		})
	}

	return (

		<div>

			<div className="flex flex-col w-full mb-5">
				<label className="mb-2">Post Title</label>
				<input
					type="text"
					placeholder="Edit your title"
					value={title}
					required
					autoComplete="off"
					onChange={(e) => setTitle(e.target.value)}
					name="pinTitle"
					className="input input-bordered w-full max-w-lg"
				/>
			</div>

			<div className="flex flec-col gap-5 mb-5">

				<div className="flex flex-col w-full">
					<label className="mb-2">Price</label>
					<input
						type="text"
						placeholder="Qoute your price"
						name="price"
						value={price}
						required
						autoComplete="off"
						onChange={(e) => setPrice(e.target.value)}
						className="input input-bordered w-full max-w-lg"
					/>
				</div>

				<div className="flex flex-col w-full">
					<label className="mb-2">Art Category</label>
					<select className="select select-bordered w-full max-w-lg"
						name="cat"
						value={cat}
						required
						onChange={(e) => setCat(e.target.value)}
					>

						<option defaultValue={true} disabled>Select Category</option>
						<option>Canvas Painting</option>
						<option>Water Painting</option>
						<option>Digital Art</option>
						<option>Portrait</option>
						<option>Drawing</option>
						<option>Sculpture</option>
						<option>Pencil Carving</option>

					</select>
				</div>

			</div>

			<div className="flex flex-col w-full mb-5">
				<label className="mb-2">Post Description</label>
				<input
					type="text"
					placeholder="Tell everyone what your art is about"
					name="desc"
					value={desc}
					required
					autoComplete="off"
					onChange={(e) => setDesc(e.target.value)}
					className="input input-bordered w-full max-w-lg"
				/>
			</div>

			<div className="flex flex-col w-full mb-5">
				<label className="mb-2">Location</label>
				<input
					type="text"
					placeholder="Where are you from?"
					name="loc"
					value={loc}
					required
					autoComplete="off"
					onChange={(e) => setLoc(e.target.value)}
					className="input input-bordered w-full max-w-lg"
				/>
			</div>

			<div className="modal-action">
				<button className="btn w-32">Close</button>
				<button className="blueBtn w-32"
					onClick={() => onEdit()}
				>
					Save
				</button>
			</div>

		</div>

	);
}

export default PinEditForm;