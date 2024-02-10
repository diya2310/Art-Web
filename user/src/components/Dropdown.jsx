import React, {useState, useEffect, useRef} from 'react';
import '../styles/dropdown.css'
import useAuth from '../custom-hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Shared/firebase';
import { toast } from "react-toastify";
import { signOut } from 'firebase/auth';
import { FaUser, FaRegHeart } from 'react-icons/fa'
import { BiLogOut } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'

function DropdownMenu() {

	const {currentUser} = useAuth();
	const [open, setOpen] = useState(false);
  	let menuRef = useRef();
	const nav = useNavigate()

	const logOut = () => {
		signOut(auth).then(() => {
			toast.success('Logged out Successfully')
			nav('/')
		}).catch(err => {
			toast.error(err.message)
		})
	}

	useEffect(() => {
		let handler = (e)=>{
			if(!menuRef.current.contains(e.target)){
				setOpen(false);
			}      
		};

		document.addEventListener("mousedown", handler);
		

		return() =>{
			document.removeEventListener("mousedown", handler);
		}

	});


	return (
		<div className="App">
		<div className='menu-container' ref={menuRef}>
			<div className='menu-trigger lg:px-7 md:px-5 sm:px-2' onClick={()=>{setOpen(!open)}}>
				<img src={currentUser.photoURL} alt='' width={60} height={60} className='hover:bg-gray-300 p-2 rounded-full cursor-pointer' />
			</div>

			<div className={`dropdown-menu ${open? 'active' : 'inactive'} dark:bg-[#272727] bg-gray-200 rounded-md mt-12 dark:before:bg-[#272727] before:bg-gray-200`} >
				<h3 className='w-full'>{currentUser.displayName}</h3>
				<ul className='list-none'>

				<DropdownItem 
					icon={<FaUser />} 
					link={`/profile/${currentUser.email}`}
					text={"My Profile"} close={()=>setOpen(!open)}
				/>
				<DropdownItem 
					icon={<FaRegHeart />} 
					text={"Wishlist"}
					close={()=>setOpen(!open)} 
				/>
				<DropdownItem 
					icon={<FiSettings />} 
					text={"Settings"}
					close={()=>setOpen(!open)}
				/>
				<DropdownItem 
					icon={<BiLogOut />} 
					fun={logOut} text={"Logout"}
					close={()=>setOpen(!open)}
				/>

			</ul>
			</div>
		</div>
		</div>
	);
}

function DropdownItem(props){

	return(
		
		<li className = 'dropdownItem' onClick={props.close} >
			{/* <img src={props.img} alt=''></img> */}
			<p className='icons flex items-center dark:text-white text-black'>
				{props.icon}
			</p>
			
			<Link to={props.link} onClick={props.fun}> {props.text} </Link>
		
		</li>
	);
}

export default DropdownMenu;