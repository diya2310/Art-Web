import GoogleSvg from '../assets/icons/google.svg'
import LoadingImage from '../assets/images/loading-indicator.png'
import AppLogo from '../assets/images/logo.png'
import NoFav from '../assets/images/no-fav.png'
import NoPub from '../assets/images/no-publications.png'
import userImg from '../assets/images/user.png'
import logout from '../assets/images/log-out.png'
import Img from '../assets/icons/img.png'
import Attach from '../assets/icons/attach.png'
import Close from '../assets/icons/close.png'


async function sleep(secs) {
	return new Promise((resolve) => setTimeout(resolve, secs * 1000));
}

export {
	sleep,
	GoogleSvg,
	LoadingImage,
	AppLogo,
	NoFav,
	NoPub,
	userImg,
	logout,
	Attach,
	Img,
	Close,
}