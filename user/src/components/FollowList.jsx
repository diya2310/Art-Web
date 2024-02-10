import React from 'react'
import { useNavigate } from 'react-router-dom'

const FollowItem = ({ list }) => {

	const nav = useNavigate();

	return (

		<div className='mb-5'>

			<div className='flex gap-40 items-center justify-between'>

				<button onClick={() => nav(`/profile/${list.userId}`)}>
					<div className='flex gap-3 items-center'>
						<img src={list.userImg} alt='userImage' width={45} height={45} className='rounded-full' />

						<div>
							<h2 className='text-[18px] font-medium float-left'>
								{list.name}
							</h2>
							<h2 className='text-[14px]'>{list.userId}</h2>
						</div>
					</div>
				</button>

			</div>

		</div>

	)

}

export default FollowItem