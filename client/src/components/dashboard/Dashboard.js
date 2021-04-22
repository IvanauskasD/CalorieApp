import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import DashboardExistingProfile from './DashboardExistingProfile';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { getCurrentDietProfile } from '../../actions/dietprofile';
import { getCurrentGoals } from '../../actions/goal';


import ProgressTable from './ProgressTable';
import FoodSuggestionTable from '../food-forms/FoodSuggestionTable';

import Profile from '../profile/Profile'



const Dashboard = ({
  getCurrentProfile,
  getCurrentDietProfile,
  deleteAccount,
  getCurrentGoals,
  auth: { user },
  profile: { profile },
  dietprofile: { dietprofile },
  goal: { goal },
}) => {
  useEffect(() => {
    getCurrentProfile()
    getCurrentDietProfile()
    getCurrentGoals() 
  }, [ getCurrentProfile, getCurrentDietProfile, getCurrentGoals]);


  if(dietprofile !== null)
  localStorage.setItem('dietprofile', dietprofile.user._id);


  return (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
    <h1>{}</h1>

      {/* <Link to={`/profile/${user._id}`} className='btn btn-primary'>
          View Profile
        </Link> */}

      {/* <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p> */}
      {profile !== null ? (
        
     
        <Fragment>
          { dietprofile === null ? (
            <DashboardActions />
          ) : (
            <Fragment>           
            <Profile params={profile._id}/>
              </Fragment>  
          )}


 


{/* {dietprofile !== null ? (
  <div>
  <ProgressTable goal={goal}/>
</div>
) : (
 <div></div>
)} */}

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


        <FoodSuggestionTable/>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  getCurrentGoals: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  goal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  dietprofile: state.dietprofile,
  goal: state.goal,
});

export default connect(mapStateToProps, { getCurrentProfile, getCurrentDietProfile, deleteAccount, getCurrentGoals })(
  Dashboard
);