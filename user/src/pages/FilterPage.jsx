import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Helmet from '../components/Helmet';
import { db } from '../Shared/firebase';
import PinsList from '../components/Pins/PinList';
import NoneActivity from '../components/Activity/NoneActivity';
import { NoPub } from '../custom-hooks/useImage';

function FilterPage() {

	const { id } = useParams();
	const [filterPins, setFilterPins] = useState([]);
	const [zero, setZero] = useState(false);

	const text = 'No Post found for your filters'

	// Calling the Function
	useEffect(() => {
		if (id) {
			getFilterPins();
		}
	}, [id])

	// Getting all the pins from Firebase
	const getFilterPins = async () => {
		const items = [];
		const q = query(collection(db, 'pins'),
			where("cat", '==', id)
		);
		const querySnapshot = await getDocs(q);

		querySnapshot.empty ? setZero(true) : setZero(false)
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			items.push(doc.data());
			items.length === 0 ? setZero(true) : setFilterPins(items)
		});
	}

	return (

		<Helmet title="Buy and Sell for free anywhere in India">

			<h3 className='text-2xl ml-6'>Filter results for: {id}</h3>
			{
				zero ?
					<div>
						<NoneActivity image={NoPub} text={text} />
					</div>
					: <div className='pt-3 absolute'>

						<PinsList listOfPins={filterPins} />

					</div>
			}

		</Helmet>

	);

}

export default FilterPage