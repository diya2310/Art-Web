import React, { useEffect, useState } from 'react'

function PinCard(props) {

	const [pin, setPin] = useState();

	useEffect(() => {
		if (props.pin) setPin(props.pin)
	}, [props.pin])

	return pin && (

		<div className='group bg-gray-50 p-2 sm:p-5 rounded-3xl m-1 sm:m-5
			hover:bg-white hover:border-[1px] cursor-pointer duration-50
			border-blue-500 dark:bg-base-300 dark:hover:bg-neutral-focus'
		>

			<div className='flex justify-between'>

				<div>
					<h2 className='text-[20px] font-medium mb-2'>{pin.title}</h2>
					<h2 className='text-[28px] font-bold mb-2'>
						<span className='text-[12px] font-light'>₹ </span>
						{pin.price}
					</h2>
					<h2 className='text-[20px] font-medium mb-2'>{pin.cat}</h2>
				</div>

				<div className='float-right'>
					<img src={pin.image} alt={pin.title} width={320} height={300}
						className='w-[300px] h-[250px] mb-3 object-contain'
					/>
				</div>

			</div>

		</div>

	);

}

export default PinCard