import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    aboutMe,
    inspirations,
    user: { name }
  }
}) => (
  <div className='profile-about bg-light p-2'>
    {aboutMe && (
      <Fragment>
        <h2 className='text-primary'>{name.trim().split(' ')[0]}s About Me</h2>
        <p>{aboutMe}</p>
        <div className='line' />
      </Fragment>
    )}
    <h2 className='text-primary'>Inspirations</h2>
    <div className='skills'>
      {inspirations.map((inspiration, index) => (
        <div key={index} className='p-1'>
          <i className='fas fa-check' /> {inspiration}
        </div>
      ))}
    </div>
  </div>
);

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;