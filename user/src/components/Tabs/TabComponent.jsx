'use client';
import { useState, useEffect, useRef } from 'react';

const TabsComponent = ({ items }) => {
	const [selectedTab, setSelectedTab] = useState(0);
	const firstBtnRef = useRef();

	useEffect(() => {
		firstBtnRef.current.focus();
	}, []);

	return (
		<>
			<center>
				<div className='p-1 rounded-xl flex justify-items-center items-center gap-x-2 font-bold max-w-sm'>
					{
						items.map((item, index) => (
							<label
								ref={index === 0 ? firstBtnRef : null}
								key={index}
								onClick={() => setSelectedTab(index)}
								className={`cursor-pointer border-none border-0 w-full py-2 px-0 hover:bg-gray-300 dark:hover:bg-[#272727] rounded-xl text-lg focus:bg-white dark:focus:bg-black 
									${selectedTab === index
										? 'underline underline-offset-8'
										: ''
									} 
								`}
							>
								{item.title}
							</label>
						))
					}
				</div>
			</center>

			<div className='max-w-full flex flex-col w-full'>
				<div className='rounded-xl'>
					{items.map((item, index) => (
						<div key={index} className={`${selectedTab === index ? '' : 'hidden'}`}>
							{item.content}
						</div>
					))}
				</div>
			</div>

		</>
	);
};

export default TabsComponent;