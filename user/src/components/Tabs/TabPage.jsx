import React, { useEffect } from 'react';
import TabsComponent from './TabComponent';
import PinsList from '../Pins/PinList';
import { NoPub } from '../../custom-hooks/useImage';
import NoneActivity from '../Activity/NoneActivity';
import useAuth from '../../custom-hooks/useAuth';

const TabsPage = ({ listOfPins, savedPins, user }) => {

	const { currentUser } = useAuth();

	const txt = currentUser
		? "You haven't saved any post yet." : `${user.name} hasn't saved any post yet.`
	const text = currentUser?.email === user.email ? "You haven't published any post yet" : `${user.name} hasn't published any post yet`

	const items = [
		{
			title: 'Published',
			content: (
				<div>
					{
						listOfPins.length === 0 ? <NoneActivity image={NoPub} text={text} /> : <PinsList listOfPins={listOfPins} />
					}
				</div>
			),
		},
		{
			title: 'Saved',
			content: (
				<div>
					{
						savedPins.length !== 0
							? <PinsList listOfPins={savedPins} />
							: <center className='h-[40vh] mt-6 text-xl'>{txt}</center>
					}
				</div>
			),
		},
	];

	return (
		<div className='rounded-lg mx-8 p-4 mt-4'>
			{/* Tabs Component */}
			<TabsComponent items={items} />
		</div>
	);

};


export default TabsPage;
