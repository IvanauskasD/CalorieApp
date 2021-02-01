import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const DietProfile = ({
  dietprofile: {
    profile: { 
            _id
    },
    currentWeight,
    height,
    goalWeight,
  }
}) => {
  return (
    <div className='profile bg-light'>
      <div>
        <h2>lol</h2>
        <p>
          {currentWeight} {height && <span> at {height}</span>}
        </p>
        <p className='my-1'>{goalWeight && <span>{goalWeight}</span>}</p>
        <Link to={`/dietprofile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
      <ul>
      </ul>
    </div>
  );
};

DietProfile.propTypes = {
  dietprofile: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

export default DietProfile;