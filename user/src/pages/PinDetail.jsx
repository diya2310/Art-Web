import React, { useEffect, useState } from 'react'
import PinImage from '../components/PinDetail/PinImage'
import PinInfo from '../components/PinDetail/PinInfo'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../Shared/firebase'
import { BiLeftArrowAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import FailedActivity from '../components/Activity/FailedActivity'
import Helmet from '../components/Helmet'

function PinDetail() {

  const [pinDetail,setPinDetail] = useState([]); 

  const { id } = useParams();
  const nav = useNavigate();

  // Getting the pin details from DB
  useEffect(()=>{
    const getPinDetail=async() => {
      const docRef = doc(db, 'pins',id );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPinDetail(docSnap.data())
      } else {
        // if No Document is Present
        setPinDetail();
        toast.error("No such document found!");
      }
    }
    getPinDetail();
  },[id])  

  return (
    <Helmet title={`${pinDetail.title} - ${pinDetail.userName}`}>
      {
        pinDetail 
        ? 
          <div className='dark:bg-black bg-white p-3 md:p-6 rounded-2xl md:px-24 lg:px-36 lg:pb-20'>
            
            <BiLeftArrowAlt className='ml-[-50px] dark:text-white pinDetailBtn' 
              onClick={() => nav(-1)}
            />
            
            <div className='grid grid-cols-1 lg:grid-cols-2 md:gap-10 shadow-lg
              rounded-2xl p-3 md:p-7 xl:pd-16 sm:mt-0 sm:pt-0 pb-6' 
            >
              <PinImage pinDetail={pinDetail} />
              
              <div className="">
                <PinInfo pinDetail={pinDetail}/>
              </div>

            </div>
          </div>
		
        : <FailedActivity mssg={'Failed to load the Post Details'} />
		
      }
    </Helmet>
  )
}

export default PinDetail