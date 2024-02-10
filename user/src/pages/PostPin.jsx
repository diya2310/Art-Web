import React from 'react'
import Helmet from '../components/Helmet'
import PostForm from '../components/Forms/PostForm'

function PostPin() {
  
	return (

		<Helmet title={'Publish your Art'}>

			<div className='dark:bg-[#272727] bg-[#e9e9e9] min-h-screen p-8 px-[10px] md:px-[160px]'>
				<PostForm />
			</div>

		</Helmet>

	);

}

export default PostPin