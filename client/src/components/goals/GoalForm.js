import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createGoal, getCurrentGoals } from '../../actions/goal'
import { getCurrentDietProfile } from '../../actions/dietprofile';
import { DebounceInput } from 'react-debounce-input';
import { createDiary } from '../../actions/fDiary'

const initialState = {
  calories: '',
  protein: '',
  carbs: '',
  fat: '',
  proteinPercent: '',
  carbsPercent: '',
  fatPercent: '',
  dietprofile: ''
};

const test = {
  sum: ''
}

const test1 = {
  sum: ''
}

const test2 = {
  sum: ''
}

const initialState2 = {
  date: '',
  user: ''
};

const GoalForm = ({
  goal: { goal, loading },
  createGoal,
  createDiary,
  history,
  getCurrentGoals,
  getCurrentDietProfile,
  dietprofile: {dietprofilez}
}) => {
  const [formData, setFormData] = useState(initialState);
  const [formData2, setFormData2] = useState(initialState2);

  const [state, setState] = useState(test)
  const [state1, setState1] = useState(test1)
  const [state2, setState2] = useState(test2)

  const [state3, setState3] = useState(false)
  const [state4, setState4] = useState(false)

  const [state5, setState5] = useState(0)

  const [loaded, setLoaded] = useState(false)
  const [loaded1, setLoaded1] = useState(false)
  const [loaded2, setLoaded2] = useState(false)

  let zqa = new Date()
  let times = new Date(zqa.getTime() + (3*60*60*1000)).toISOString()
 // console.log(times)

  useEffect(() => {
    getCurrentDietProfile()
    if (!goal) getCurrentGoals();
    if (!loading && goal) {
      const goalData = { ...initialState };
      for (const key in goal) {
        if (key in goalData) goalData[key] = goal[key];
      }
      setFormData(goalData);
      
    }


    // let temp = 0
    // if(formData.fatPercent !== '' && formData.proteinPercent !== '' && formData.carbsPercent !== '') {
    // temp = formData.carbsPercent + formData.proteinPercent + formData.fatPercent
    // }
    // //setState5(temp.toFixed(2))
    // if(temp > 0 && loaded){
    // setState5(temp)
    
    // }
  
    if(!dietprofile) {
      getCurrentDietProfile()
      setState4(false)
    } else setState4(true)

  }, [state1, state2, state5, state4, state3, loading, getCurrentGoals, goal, getCurrentDietProfile]);

  let { calories, protein, carbs, fat, proteinPercent, carbsPercent, fatPercent, dietprofile } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  
  const onChangeProtein = e => {
    formData.proteinPercent = e.target.value
    setFormData({...formData, [e.target.name]: e.target.value });
    test.sum = (e.target.value * goal.calories) / 4
    setState(test)

  }

  const onChangeCarbs = e => {
    formData.carbsPercent = e.target.value
    setFormData({ ...formData, [e.target.name]: e.target.value });
    test1.sum = (goal.calories * e.target.value) / 4
    setState1(test1)
    setLoaded(true)
  }

  const onChangeFat = e => {
    formData.fatPercent = e.target.value
    setFormData({ ...formData, [e.target.name]: e.target.value });
    test2.sum = (e.target.value * goal.calories) / 9
    setState2(test2)
  }

  const onSubmit = e => {
    e.preventDefault();
  if(state4 && dietprofile){
   formData.dietprofile = dietprofile._id
   formData2.date = times
   formData2.user = dietprofile.user
   createGoal(formData, history, goal ? true : false).then(() => {
    createDiary(formData2)
  });
  }

  //  createGoal(formData, history, goal ? true : false);

    
  };
  

 // console.log(state5)
  return (
    <Fragment>
      <h1 className="large text-primary">Edit your goals</h1>

      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <label>Calculated Daily Calorie Goal:</label>
          <input
            type="text"
            placeholder="* Current calories"
            name="calories"
            value={calories}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
        <label>Calculated Daily Carbohydrates Goal: {goal ? goal.carbs : 0}</label>
        <br/>
        {state1.sum !== '' ? (
          <label>Recalculated Goal: {(state1.sum).toFixed(1)}</label>

        ) :(
<label></label>
        )}
      
          <select
            name="carbsPercent"
            value={carbsPercent}
            onChange={onChangeCarbs}
          >
            <option value="0.4">40%</option>
            <option value="0.45">45%</option>
            <option value="0.5">50%</option>
            <option value="0.55">55%</option>
            <option value="0.6">60%</option>
          </select>
        </div>
        <div className="form-group">
        <label>Calculated Daily Protein Goal: {goal ? goal.protein : 0}</label>
        <br/>
        {state.sum !== '' ? (
          <label>Recalculated Goal: {(state.sum).toFixed(1)}</label>

        ) :(
<label></label>
        )}          <select
            name="proteinPercent"
            value={proteinPercent}
            onChange={onChangeProtein}
          >
            <option value="0.15">15%</option>
            <option value="0.2">20%</option>
            <option value="0.25">25%</option>
            <option value="0.3">30%</option>
            <option value="0.35">35%</option>
          </select>
        </div>
        <div className="form-group">
        <label>Calculated Daily Fat Goal: {goal ? goal.fat : 0}</label>
        <br/>
        {state2.sum !== '' ? (
          <label>Recalculated Goal: {(state2.sum).toFixed(1)}</label>

        ) :(
<label></label>
        )}          <select
            name="fatPercent"
            value={fatPercent}
            onChange={onChangeFat}
          >
            <option value="0.15">15%</option>
            <option value="0.2">20%</option>
            <option value="0.25">25%</option>
            <option value="0.3">30%</option>
            <option value="0.35">35%</option>
          </select>
        </div>

{(parseFloat(carbsPercent) + parseFloat(proteinPercent) + parseFloat(fatPercent)) === 1 ? (
        <input type="submit" className="btn btn-primary my-1" />

):(
  <div><h1>Macronutrients must equal 100%!</h1></div>
)}


        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
            </Link>
      </form>
    </Fragment>
  );
}

GoalForm.propTypes = {
  createGoal: PropTypes.func.isRequired,
  createDiary: PropTypes.func.isRequired,
  getCurrentGoals: PropTypes.func.isRequired,
  goal: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  goal: state.goal,
  dietprofile: state.dietprofile
});

export default connect(mapStateToProps, { createDiary, createGoal, getCurrentGoals, getCurrentDietProfile })(
  GoalForm
);