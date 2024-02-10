import React from "react";
import TopHeader from "../components/TopHeader";
import Routers from "../routers/Routers";
import { useLocation } from "react-router-dom";

const Layout = () => {

	const loc = useLocation()
	return <>

		{
			loc.pathname.startsWith('/login')
				? <></> :
				loc.pathname.startsWith('/register')
					? <></> : loc.pathname.startsWith('/chat')
						? <></> :
						<TopHeader />
		}

		<div> <Routers /> </div>

	</>
};

export default Layout;