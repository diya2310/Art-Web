import React, { useEffect, useState } from 'react'
import PinsList from '../components/Pins/PinList';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Shared/firebase';
import Helmet from '../components/Helmet';
import NoneActivity from '../components/Activity/NoneActivity';
import { NoPub } from '../custom-hooks/useImage';

const SearchPage = () => {

	// const { id } = useParams();
	const [searchPins, setSearchPins] = useState([]);
	const [zero, setZero] = useState(false);
	const text = 'No Post found for your search...'

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	}

	let searchQuery = useQuery();
	let id = searchQuery.get('ls');

	// Calling the Function
	useEffect(() => {
		if (id) {
			getSearchPins();
		}
	}, [id])


	// Getting all the pins from Firebase
	const getSearchPins = async () => {
		const items = [];
		const q = query(collection(db, 'pins'),
			where("title", '==', id)
		);
		const querySnapshot = await getDocs(q);

		querySnapshot.empty ? setZero(true) : setZero(false)
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			items.push(doc.data());
			setSearchPins(items)
		});
	}

	return (

		<Helmet title="Buy and Sell for free anywhere in India">

			<h3 className='text-2xl mt-3 ml-6'>Search results for: {id}</h3>
			{
				zero ?
					<div>
						<NoneActivity image={NoPub} text={text} />
					</div>

					: <div className='pt-3 absolute'>

						<PinsList listOfPins={searchPins} />

					</div>
			}

		</Helmet>

	);

}

export default SearchPage