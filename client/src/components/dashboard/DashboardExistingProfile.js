import React from 'react';
import { Link } from 'react-router-dom';

const DashboardExistingProfile = () => {
    return (
      <div className='dash-buttons'>
        <Link to='/edit-profile' className='btn btn-light'>
          <i className='fas fa-user-circle text-primary' /> Edit Profile
        </Link>
        <Link to='/edit-diet-profile' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary' /> Edit Diet Profile
      </Link>
      </div>
    );
  };
  
  export default DashboardExistingProfile;