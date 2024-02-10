import React, { useState, useEffect } from 'react'
import Helmet from '../components/Helmet'
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../Shared/firebase';
import PinsList from '../components/Pins/PinList'

const Home = () => {
  
  const [listOfPins,setListOfPins] = useState([]);

  // Calling the Function
  useEffect(()=>{
    getAllPins();
  },[])

  // Getting all the pins from Firebase
  const getAllPins = async() => {
    const items = [];
    const q = query(collection(db,'pins'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {  
      items.push(doc.data());
      // setListOfPins((listOfPins)=>[...listOfPins,doc.data()]);
    });
    setListOfPins(items);
  }
  
  return (
    
    <Helmet title="Buy and Sell for free anywhere in India">
      
        <div className='pt-3 absolute'>

            {
              <PinsList listOfPins={listOfPins} />
            }

        </div>

    </Helmet>

  )
}

export default Home