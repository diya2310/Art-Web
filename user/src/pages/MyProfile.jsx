import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import Helmet from '../components/Helmet'
import { db } from '../Shared/firebase'
import { toast } from "react-toastify";
import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import UserInfo from '../components/UserInfo';
import FailedActivity from '../components/Activity/FailedActivity';
import TabsPage from '../components/Tabs/TabPage';
import useAuth from '../custom-hooks/useAuth';

const MyProfile = () => {

	// Getting the ID from the address bar
	const { id } = useParams();

	const [userInfo, setUserInfo] = useState();
	const [listOfPins, setListOfPins] = useState([]);
	const [savedPins, setSavedPins] = useState([]);
	const { currentUser } = useAuth();

	useEffect(() => {
		if (id) {
			getUserInfo(id);
		}
	}, [id])

	const getUserInfo = async (userId) => {

		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document Data: ", docSnap.data());
			setUserInfo(docSnap.data())
		} else {
			toast.error('Failed to load Profile Document')
		}

	}

	useEffect(() => {
		if (userInfo) {
			getUserPins();
			getSavedPins(userInfo.fav)
		}
	}, [userInfo])

	useEffect(() => {
		if (userInfo) {
			if (userInfo.contactModal === false) {
				showContactModal();
			}
		}
	})

	const getUserPins = async () => {
		
		setListOfPins([])
		const q = query(collection(db, 'pins'),where("email", '==', userInfo.email));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			setListOfPins(listOfPins => [...listOfPins, doc.data()]);
		});
	}

	// Getting Saved pins from Firebase
	const getSavedPins = async () => {
		setSavedPins([])
		const q = query(collection(db, 'pins'),
			where("fav", 'array-contains', userInfo.email)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			setSavedPins(listOfSavedPins => [...listOfSavedPins, doc.data()]);
		});
	}

	// Method for showing the Modal
	const showContactModal = () => {
		if (id === currentUser.email) window.contactModal.showModal();
	}

	return (

		<Helmet title={'Profile'}>

			<div>
				{
					userInfo ?
						<div>
							<UserInfo userInfo={userInfo} />

							<TabsPage listOfPins={listOfPins} savedPins={savedPins}
								user={userInfo}
							/>

						</div>
						: <FailedActivity mssg={'Loading...'} />
				}
			</div>

		</Helmet>

	);

}

export default MyProfile