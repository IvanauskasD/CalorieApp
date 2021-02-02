import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import DashboardExistingProfile from './DashboardExistingProfile';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { getCurrentDietProfile } from '../../actions/dietprofile';

const Dashboard = ({
  getCurrentProfile,
  getCurrentDietProfile,
  deleteAccount,
  auth: { user },
  profile: { profile },
  dietprofile: { dietprofile }
}) => {
  useEffect(() => {
    getCurrentProfile()
    getCurrentDietProfile()
  }, [getCurrentProfile, getCurrentDietProfile]);

  return (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
           { dietprofile === null ? (
            <DashboardActions />
           ) : (
            <DashboardExistingProfile />
           )}
            
          <Link to='/create-food' className='btn btn-light'>Create food</Link>

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
          <Fragment>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-primary my-1">
              Create Profile
          </Link>
          </Fragment>
        )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  dietprofile: state.dietprofile
});

export default connect(mapStateToProps, { getCurrentProfile, getCurrentDietProfile, deleteAccount })(
  Dashboard
);