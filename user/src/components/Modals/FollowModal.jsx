import React, { useEffect, useState } from 'react'
import FollowItem from '../FollowList';

function FollowModal({ list, title }) {

	const [text, setText] = useState();

	useEffect(() => {
		setText(
			title === 'Following' ? `User haven't started following anyone.`
				: `User has no followers yet.`
		)
	})


	return (

		<form method="dialog" className="modal-box">

			<div className='flex justify-around'>

				<div className='border-b-[1px] pb-2 w-full '>
					<center>
						<h3 className=" text-[30px] font-light">
							{title}
						</h3>
					</center>
				</div>

				<div>
					<button className="text-4xl float-right">&times;</button>
				</div>
			</div>

			<div className='mt-4'>

				{
					list.length !== 0
						? list.map((item, index) => (

							<FollowItem list={item} key={index} />

						))
						: <center>
							<h3 className='text-1xl'>{text}</h3>
						</center>
				}

			</div>

		</form>

	);


}

export default FollowModal