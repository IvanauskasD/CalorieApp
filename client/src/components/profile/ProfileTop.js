import React from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({
  profile: {
    titleAboutUser,
    location,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt="" />
      <h1 className="large">{name}</h1>
      <p className="lead">
        {titleAboutUser}
      </p>
      <p>{location ? <span>{location}</span> : null}</p>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;