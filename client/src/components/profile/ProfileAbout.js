import React, { useCallback, Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getDiary } from '../../actions/fDiary';
import { getSportDiary } from '../../actions/sDiary';

import { makeStyles } from '@material-ui/core/styles';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { getCurrentGoals } from '../../actions/goal';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ProfileAbout = ({
  profile: {
    aboutMe,
    inspirations,
    user: { name },
  },
  getDiary,
  getSportDiary,
  fDiary: {fDiary},
  sDiary: {sDiary},
  goal: {goal},
  dietprofile
}) => {

  let zqa = new Date()
  let test = new Date(zqa.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '')
  const classes = useStyles();
  const [leftFood, setLeftFood] = useState(0)
  const [leftExercise, setLeftExercise] = useState(0)

  const [netF, setNetF] = useState(0)

  const [loaded, setLoaded] = useState(false)
  const [loaded1, setLoaded1] = useState(false)

  const [med, setMed] = useState(0)
  
  useEffect(() => {
  
    if(!fDiary){
    getDiary(test)
    setLoaded(false)
    } 

    if(!sDiary){
      getSportDiary(test)
      setLoaded(false)
    } 

    if(!goal) {
      getCurrentGoals()
    }
    
    if(fDiary){
      setLoaded(true)
    } 

    if(sDiary){
      setLoaded1(true)
    } 
    
    if(fDiary && sDiary && goal && fDiary.length > 0 && sDiary.length > 0)
    setMed(fDiary[0].consumedCalories + sDiary[0].name.calories)

    
    if(goal && fDiary && sDiary && fDiary.length > 0 && sDiary.length > 0)
    {
      setNetF(fDiary[0].name.calories - sDiary[0].name.calories)
    }
    else if(goal && fDiary && fDiary.length > 0)
    {
      setNetF(fDiary[0].name.calories)
    }
    else if(goal && sDiary && sDiary.length > 0)
    {
      setNetF(-(sDiary[0].name.calories))
    }

  }, [goal, netF, getDiary, sDiary, fDiary, leftFood, leftExercise, loaded, loaded1]);

  return(
  <div className='profile-about bg-light p-2'>
    {aboutMe && (
      <Fragment>
            <div style={{marginRight: 'auto' }}>
            <Link to={`/mealz?date=`} className='btn btn-danger'>Add Meals</Link>

</div>
<br/>
          <Link to={`/exercises?date=`} className='btn btn-danger'>Add Exercises</Link>

        <h2 className='text-primary'>Goal</h2>
        <p>{goal ? <h1>{goal.calories}</h1> : console.log('no')}</p>
        <h2 className='text-primary'>{dietprofile.dietprofile.expectations !== 0 ? 'Expected Date To Reach Weight Goal' : ''}</h2>
        <p>{dietprofile ? <h1>{(dietprofile.dietprofile.expectations !== 0 ? dietprofile.dietprofile.expectationTime  : '').replace(/T.+/, '')}</h1> : console.log('no')}</p>
        <div className='line' />
      </Fragment>
    )}
    <h2 className='text-primary'>Current Progress</h2>
    <div className='skills'>
        <div className='p-1'>
          
          <h1 className='fas fa-check' /> Calories To Match Goal: {fDiary && fDiary.length > 0 ? fDiary[0]?.consumedCalories : 0}
        </div>
        <div className='p-1'>
          
          <h1 className='fas fa-check' /> -
        </div>
        <div className='p-1'>
          <i className='fas fa-check' /> Burned Calories:  {sDiary && sDiary.length > 0 ? sDiary[0]?.name.calories : 0}
        </div>
        <div className='p-1'>
          
          <h1 className='fas fa-check' /> -
        </div>
        <div className='p-1'>
          <i className='fas fa-check' />Calorie Net:  {netF}
        </div>
    </div>
    <div style={{ width: 200, height: 200, marginLeft: 'auto', marginRight: 'auto' }}>
      <label>Progress</label>
    <CircularProgressbar value={netF} maxValue={goal ? goal.calories : 0} text={netF} />
</div>
  </div>
);

      }


ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  getDiary: PropTypes.func.isRequired,
  getSportDiary: PropTypes.func.isRequired,
  fDiary: PropTypes.object.isRequired,
  sDiary: PropTypes.object.isRequired,
  goal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fDiary: state.fDiary,
  sDiary: state.sDiary,
  goal: state.goal,
  dietprofile: state.dietprofile,
});


export default connect(mapStateToProps, { getSportDiary, getDiary })(
  ProfileAbout
);