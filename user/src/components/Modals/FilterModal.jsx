import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function FilterModal() {

	const [cat, setCat] = useState();
	const nav = useNavigate()

	return (

		<form method="dialog" className="modal-box">

			<div className='flex justify-around'>
				<div className='border-b-[1px] pb-2 w-full '>
					<center>
						<h3 className=" text-[26px] font-light">
							Filter by Category
						</h3>
					</center>
				</div>

				<div>
					<button className="text-4xl float-right">&times;</button>
				</div>
			</div>

			<div className='mt-6'>

				<div className="flex flex-col w-full">
					<label className="mb-3">Art Category</label>
					<select className="select select-bordered w-full max-w-lg"
						name="cat"
						value={cat}
						required
						onChange={(e) => setCat(e.target.value)}
					>

						<option defaultValue disabled>Select Category</option>
						<option>Canvas Painting</option>
						<option>Water Painting</option>
						<option>Digital Art</option>
						<option>Portrait</option>
						<option>Drawing</option>
						<option>Sculpture</option>
						<option>Pencil Carving</option>

					</select>
				</div>

				<div className="modal-action">
					<button className="btn w-60">Close</button>
					<button className="blueBtn w-60"
						onClick={() => nav(`/filter-result/${cat}`)}>Apply</button>
				</div>

			</div>

		</form>

	);

}

export default FilterModal