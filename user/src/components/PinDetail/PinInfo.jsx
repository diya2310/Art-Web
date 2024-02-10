import React, { useRef, useState, useEffect } from 'react'
import PinUserTag from '../PinDetail/PinUserTag'
import { FiShare } from 'react-icons/fi'
import { FaLink } from 'react-icons/fa'
import { BsCloudDownload } from 'react-icons/bs'
import useAuth from '../../custom-hooks/useAuth'
import { toast } from 'react-toastify'
import { FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton, FacebookIcon } from 'react-share'
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../Shared/firebase'
import LoginModal from '../Modals/LoginModal'
import { sleep } from '../../custom-hooks/useImage'

function PinInfo({ pinDetail }) {

  const user = {
    displayName: pinDetail.userName,
    email: pinDetail.email,
    photoURL: pinDetail.userImage,
  }
  const { currentUser } = useAuth();
  const ids = pinDetail.id;

  const [open, setOpen] = useState(false);
  const [pinInfo, setPinInfo] = useState();
  const [liked, setLiked] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareMenuRef = useRef();

  useEffect(() => {
    let shareHandler = (e) => {
      if (!shareMenuRef.current.contains(e.target)) {
        setShareMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", shareHandler);
    return () => {
      document.removeEventListener("mousedown", shareHandler);
    }
  });

  useEffect(() => {
    if (ids) {
      getPinInfo(ids);
    }
  }, [ids])

  const getPinInfo = async (userId) => {

    const docRef = doc(db, "pins", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document Data: ", docSnap.data());
      setPinInfo(docSnap.data());
    } else {
      toast.error('Failed to load Pin Document')
    }

  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Copied link to clipboard to share')
  }

  // Getting the Status of Post Liked
  const getLikeStatus = fav => {
    let status = false
    fav.map(item => {
      if (item === currentUser?.email) {
        status = true;
      } else {
        status = false;
      }
      return null
    })
    return status;
  }

  // Logic for Saving or Liking the Pin
  const onLikePin = async item => {

    let tempLike = item.fav;
    if (tempLike.length > 0) {
      tempLike.map(item1 => {
        if (item1 === currentUser.email) {

          updateDoc(doc(db, 'pins', pinInfo.id), {
            fav: arrayRemove(currentUser.email)
          }).then(res => {
            window.location.reload();
            setLiked(false)
            const mssg = liked ? "Removed from Profile" : "Saved to Profile"
            toast.success(`${mssg}`)
          }).catch((error) => {
            setLiked(true)
            toast.error(error.message)
          })

        } else {

          updateDoc(doc(db, 'pins', pinInfo.id), {
            fav: arrayUnion(currentUser.email)
          }).then(res => {
            window.location.reload();
            setLiked(true)
            const mssg = liked ? "Removed from Profile" : "Saved to Profile"
            toast.success(`${mssg}`)
          }).catch((error) => {
            setLiked(false)
            toast.error(error.message)
          })

        }
        return null;
      })
    } else {

      updateDoc(doc(db, 'pins', pinInfo.id), {
        fav: arrayUnion(currentUser.email)
      }).then(res => {
        window.location.reload();
        setLiked(true)
        const mssg = liked ? "Removed from Profile" : "Saved to Profile"
        toast.success(`${mssg}`)
      }).catch((error) => {
        setLiked(false)
        toast.error(error.message)
      })

    }

  }

  // Method for showing the Modal
  const showLoginModal = () => window.my_modal_8.showModal();

  return (

    <div>

      <div className='flex items-center justify-between gap-5 mb-0'>

        <div className='flex justify-evenly gap-5 mb-0'>

          <div className=''>
            <BsCloudDownload
              className='dark:hover:bg-gray-400 pinDetailBtn dark:hover:text-black'
              onClick={() => window.open(pinDetail.image)}
            />
          </div>

          <div className='relative' ref={shareMenuRef}>

            <FiShare
              className='dark:hover:bg-gray-400 pinDetailBtn dark:hover:text-black'
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
            />
            {
              shareMenuOpen &&
              <div className='bg-white dark:bg-[#272727] dark:text-gray-200 p-5 w-60 shadow-lg absolute -left-[100px] top-14 rounded-md'>
                <center><h4>Share On</h4></center>

                <div className='flex mt-3 justify-around'
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}>

                  <WhatsappShareButton url={window.location.href} qoute={pinDetail.title}>
                    <WhatsappIcon size={50} round={true}></WhatsappIcon>
                  </WhatsappShareButton>

                  <FacebookShareButton url={window.location.href} qoute={pinDetail.title}>
                    <FacebookIcon size={50} round={true}></FacebookIcon>
                  </FacebookShareButton>

                  <TwitterShareButton url={window.location.href} qoute={pinDetail.title}>
                    <TwitterIcon size={50} round={true}></TwitterIcon>
                  </TwitterShareButton>

                </div>

              </div>
            }
          </div>

          <FaLink className='dark:hover:bg-gray-400 pinDetailBtn dark:hover:text-black' onClick={copyLink} />

        </div>

        <div className='float-right'>

          {
            pinInfo
              ? getLikeStatus(pinInfo.fav)
                ? <button className='savedBtn dark:bg-gray-300 dark:text-black'
                  onClick={() => onLikePin(pinInfo)}
                >
                  Saved
                </button>
                : <button className='saveBtn'
                  onClick={() => !currentUser ? showLoginModal() : onLikePin(pinInfo)}
                >
                  Save {/* <FaHeart /> */}
                </button>
              : null
          }

        </div>

      </div>

      <h2 className='text-[30px] font-bold mt-5'>{pinDetail.title}</h2>

      <div className='flex justify-between'>

        <h2 className='text-[25px] font-bold mb-3 mt-2'>₹ {pinDetail.price}</h2>
        <h2 className='text-[20px] font-bold mb-3 mt-2'>{pinDetail.cat}</h2>

      </div>

      <h2 className='mb-7'>{pinDetail.desc}</h2>

      <PinUserTag user={user} pin={pinDetail} />

      <dialog id="my_modal_8" className="modal modal-bottom sm:modal-middle">
        <form method="dialog" className="modal-box">
          <LoginModal title={'save this post'} />
        </form>
      </dialog>

    </div>

  )
}

export default PinInfo