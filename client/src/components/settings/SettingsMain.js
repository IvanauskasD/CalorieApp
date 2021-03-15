import React, { Fragment, useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { getCurrentDietProfile } from '../../actions/dietprofile';
import DietProfileForm from '../profile-forms/DietProfileForm'
import GoalForm from '../goals/GoalForm'

const SettingsMain = ({
  getCurrentProfile,
  getCurrentDietProfile,
  auth: { user },
  profile: { profile },
  dietprofile: { dietprofile },
}) => {

  const [values, setValues] = useState({
    showDietProfileView: false,
    showGoalView: false,
  })

  const { showDietProfileView, showGoalView } = values

  const onShowView = e => {
    e.preventDefault();
    setValues({showDietProfileView: true})
  }

  const onShowGoalView = e => {
    e.preventDefault();
    setValues({showGoalView: true})
  }

  const showDietView = showDietProfileView => {
    if(showDietProfileView) {
      return <DietProfileForm/>
    }
  }

  const showGoal = showGoalView => {
    if(showGoalView) {
      return <GoalForm dietprofile={dietprofile}/>
    }
  }

  return (
    <Fragment>
      <div className="div1">
        <h1>Account Settings</h1>
        <ul>
          <li>
            <button onClick={onShowView} className="nobck">View Diet Profile</button>
          </li>
          <li>
            <button onClick={onShowGoalView} className="nobck">View Goals</button>
          </li>
        </ul>
      </div>

      <div className="div2">
        {showDietView(showDietProfileView)}
        {showGoal(showGoalView)}

        {/* padaryt funkcijas onclick1 2 ir tt. kiekvienas onclick funkcija
        tures forma kuria rodys desinej pusej. Kai kairej pusej
        ant buttono paspaus, triggerins onclickas ir 
        desinej pusej pasirodys forma */}

        {/* <DietProfile dietprofile={dietprofile} /> */}
      </div>
    </Fragment>
  );
};

SettingsMain.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  dietprofile: state.dietprofile
})

export default connect(mapStateToProps, { getCurrentProfile, getCurrentDietProfile })(
  SettingsMain
);
