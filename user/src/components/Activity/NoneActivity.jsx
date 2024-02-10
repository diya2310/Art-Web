import React from 'react'

// This is the function for showing No Adds Posted or No favourites added
const NoneActivity = ({ image, text }) => {

	return (

		<div className='h-[80vh] mt-16 flex flex-col items-center'>

			<img src={image} height={220} width={220} alt="None Activity" />

			<center className='mt-3'><h2 className='text-[20px]'>{text}</h2></center>

		</div>

	)

}

export default NoneActivity