import React from 'react'
import styles from '../styles/Layout.module.css'

function AuthLayout( {children} ) {
  
	return (

		<div className="flex h-screen bg-blue-400">
            <div className="m-auto bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2">

				{/* Left Layout Goes Here */}
				<div className={styles.imgStyle}>
                    <div className={styles.cartoonImg}></div>
                    <div className={styles.cloud_one}></div>
                    <div className={styles.cloud_two}></div>
                </div>

				{/* Children Design Goes Here */}
                <div className="right flex flex-col justify-evenly">
                    <div className="text-center py-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>

	);

}

export default AuthLayout