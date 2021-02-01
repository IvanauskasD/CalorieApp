import React, { Fragment, useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { getCurrentDietProfile } from '../../actions/dietprofile';
import DietProfileForm from '../profile-forms/DietProfileForm'

const SettingsMain = ({
  getCurrentProfile,
  getCurrentDietProfile,
  profile: { profile },
  dietprofile: { dietprofile },
}) => {

  const [values, setValues] = useState({
    showDietProfileView: false
  })

  const { showDietProfileView } = values

  const onShowView = e => {
    e.preventDefault();
    setValues({showDietProfileView: true})
  }

  const showDietView = showDietProfileView => {
    if(showDietProfileView) {
      return <DietProfileForm/>
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
        </ul>
      </div>

      <div className="div2">
        {showDietView(showDietProfileView)}

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
  profile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  dietprofile: state.dietprofile
})

export default connect(mapStateToProps, { getCurrentProfile, getCurrentDietProfile })(
  SettingsMain
);
