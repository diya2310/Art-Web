import React from 'react'
import PinCard from '../PinCard';
import PinEditForm from '../Forms/EditForm';

function EditPin({pin}) {
  
	return (

		<form method="dialog" className="modal-box w-11/12 max-w-5xl">

			<div className='grid grid-cols-1 md:grid-cols-2'>

				{/* Showing Pin Image */}
				<div> <PinCard pin={pin} /> </div>

				{/* Showing Form Fields */}
				<div> <PinEditForm pin={pin} /> </div>

			</div>

		</form>

	);

}

export default EditPin