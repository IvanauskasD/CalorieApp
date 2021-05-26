import React, { useCallback, Fragment, useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMealByDate, deleteMeal } from '../../actions/meal';
import { getFoodById } from '../../actions/food';
import { createDiary } from '../../actions/fDiary'
import { getCurrentDietProfile } from '../../actions/dietprofile'
import { getCurrentGoals } from '../../actions/goal';
import { Redirect } from 'react-router'

import moment from 'moment'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { getDiary } from '../../actions/fDiary';

import Chart from "react-google-charts";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const FoodMain = ({
  getCurrentDietProfile,
  getMealByDate,
  getCurrentGoals,
  goal: {goal},
  deleteMeal,
  createDiary,
  meal: { meal },
  match,
  dietprofile,
  fDiary: {fDiary},
  getDiary,
}) => {

  const test2 = {
    sum: ''
  }

  const test1 = {
    sum: ''
  }

  const temp = {
    date: '',
    user: ''
  }

  const initialState2 = {
    date: '',
    user: ''
  };



  const [startDate, setStartDate] = useState(new Date());
  const [queryz, setQuery] = useState(test2)
  const [ee, setEE] = useState(test1)
  const history = useHistory()
  const [formData2, setFormData2] = useState(initialState2);
  const [formData3, setFormData3] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false)

  const [testx, setTest] = useState(true)

  let test = new Date()
  let zqa = new Date(test.getTime() + (3*60*60*1000)).toISOString()


  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let url = new URL(window.location.href)
  let paramz = new URLSearchParams(url.search);


  let query = useQuery();


  function onChange(e) {
    let zqa = new Date(e.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '')
    test2.sum = zqa
    setQuery(test2)
   
  }

  const dd = new URLSearchParams()


  useEffect(() => {
    getCurrentDietProfile()
    if(!goal) getCurrentGoals()
    const params = new URLSearchParams()
    if (queryz.sum) {
      params.set("date", queryz.sum)
    } else {
      params.delete("date")
    }
    if (params.toString() === '') {
      params.set("date", new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, ''))
      getMealByDate(new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, ''))
      setTest(false)
      getDiary(new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, ''))
      history.push({ search: new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '') })
      initialState2.date = new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '')
      initialState2.user = localStorage.getItem('dietprofile')
      setFormData2(initialState2)
      
     console.log(dietprofile)

  }
    else {
      getMealByDate(queryz.sum)
      getDiary(queryz.sum)
      initialState2.date = params.get('date').toString()
      initialState2.user = localStorage.getItem('dietprofile')
      setFormData2(initialState2)
      setTest(false)
    }
    console.log(goal)
    setIsUpdated(false)
    history.push({ search: params.toString() })

  }, [queryz, history, isUpdated, testx, formData3]);

  const handleDelete = (id, n, data) => {
    setIsUpdated(true)
    deleteMeal(id, n, data)
  }


  const classes = useStyles();

  if(testx) {
    return <div>Loading..</div>
  } else {
  return (
    <Fragment>
      <DatePicker dateFormat={"yyyy-MM-dd"}
      
        onSelect={onChange}
        selected={startDate} onChange={date => setStartDate(date)} />
      
      <div>
        <br/>
      <Link to='/add-food' className='btn btn-danger'>Add Food To Diary</Link>
      <br/>
      </div>
 
      <div>
      <br/>
        <Fragment>
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Breakfast</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right">fatPercent&nbsp;(g)</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meal !== null ? (
          <Fragment>
          {meal.length > 0 && meal.map(row => {
          
          return row.foods.map((innerElement) => (
            <Fragment>
            {row.type === 0 ? (
            <TableRow key={innerElement._id.name}>
            <TableCell component="th" scope="row">
              {innerElement._id.name}
            </TableCell>
          
            <TableCell align="right">{(innerElement._id.calories)* (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.carbs * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.protein * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.fat * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">
           <Button className='btn btn-danger' onClick={() => handleDelete(row._id, row.foods.indexOf(innerElement), formData2)}>Remove</Button></TableCell>
          </TableRow>
            ): (
              <p></p>
            )}
            </Fragment>
          

            
          ))})}
          </Fragment>
          ) : (
            <p></p>
          )}

        </TableBody>
      </Table>
    </TableContainer>
        </Fragment>
      </div>

      <div>
        <br></br>
      </div>

      <div>
      <Fragment>
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Lunch</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right">fatPercent&nbsp;(g)</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {meal !== null ? (
          <Fragment>
          {meal.length > 0 && meal.map((row) => {
         
          return row.foods.map(innerElement => (
            <Fragment>
            {row.type === 1 ? (
            <TableRow key={innerElement._id.name}>
            <TableCell component="th" scope="row">
              {innerElement._id.name}
            </TableCell>
           
            <TableCell align="right">{innerElement._id.calories * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.carbs * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.protein * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.fat * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">
           <Button className='btn btn-danger' onClick={() => handleDelete(row._id, row.foods.indexOf(innerElement), formData2)}>Remove</Button></TableCell>

          </TableRow>
            ): (
              <p></p>
            )}
            </Fragment>
          

            
          ))})}
          </Fragment>
          ) : (
            <p></p>
          )}

        </TableBody>
      </Table>
    </TableContainer>
        </Fragment>
      </div>

      <div>
        <br></br>
      </div>

      <div>
      <Fragment>
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Dinner</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right">fatPercent&nbsp;(g)</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {meal !== null ? (
          <Fragment>
          {meal.length > 0 && meal.map((row) => {
          
          return row.foods.map(innerElement => (
            <Fragment>
            {row.type === 2 ? (
            <TableRow key={innerElement._id.name}>
            <TableCell component="th" scope="row">
              {innerElement._id.name}
            </TableCell>
           
            <TableCell align="right">{innerElement._id.calories * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.carbs * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.protein * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.fat * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">
           <Button className='btn btn-danger' onClick={() => handleDelete(row._id, row.foods.indexOf(innerElement), formData2)}>Remove</Button></TableCell>

          </TableRow>
            ): (
              <p></p>
            )}
            </Fragment>
          

            
          ))})}
          </Fragment>
          ) : (
            <p></p>
          )}

        </TableBody>
      </Table>
    </TableContainer>
        </Fragment>
      </div>

     <div>
        <br></br>
      </div>
      
      <div>
      <Fragment>
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Snacks</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
            <TableCell align="right">fatPercent&nbsp;(g)</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
          {meal !== null ? (
          <Fragment>
          {meal.length > 0 && meal.map((row) => {
          
          return row.foods.map(innerElement => (
            <Fragment>
            {row.type === 3 ? (
            <TableRow key={innerElement._id.name}>
            <TableCell component="th" scope="row">
              {innerElement._id.name}
            </TableCell>
           
            <TableCell align="right">{innerElement._id.calories * (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.carbs* (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.protein* (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">{innerElement._id.fat* (innerElement.quantity * innerElement.servings)}</TableCell>
            <TableCell align="right">
           <Button className='btn btn-danger' onClick={() => handleDelete(row._id, row.foods.indexOf(innerElement), formData2)}>Remove</Button></TableCell>

          </TableRow>
            ): (
              <p></p>
            )}
            </Fragment>
          

            
          ))})}
          </Fragment>
          ) : (
            <p></p>
          )}

        </TableBody>
      </Table>
    </TableContainer>
        </Fragment>
      </div>
      <br/>
      <br/>

      <br/>
      <br/>
      <br/>
      <div>
        {fDiary !== null ? (
        <Fragment>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fDiary.length > 0 && fDiary.map((row) => (
          
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                 Total Consumed
                </TableCell>
                <TableCell align="right">{row.name.calories}</TableCell>
                <TableCell align="right">{row.name.carbs}</TableCell>
                <TableCell align="right">{row.name.protein}</TableCell>
                <TableCell align="right">{row.name.fat}</TableCell>
              </TableRow>
              
            ))}
            {fDiary.length > 0 && fDiary.map((row) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                 Remaining
                </TableCell>
                <TableCell align="right">{row.consumedCalories}</TableCell>
                <TableCell align="right">{row.consumedCarbs}</TableCell>
                <TableCell align="right">{row.consumedProtein}</TableCell>
                <TableCell align="right">{row.consumedFat}</TableCell>
              </TableRow>
              
            ))}
             
              <TableRow>
                <TableCell component="th" scope="row">
                 Daily Goal
                </TableCell>
                <TableCell align="right">{goal?.calories}</TableCell>
                <TableCell align="right">{goal?.carbs}</TableCell>
                <TableCell align="right">{goal?.protein}</TableCell>
                <TableCell align="right">{goal?.fat}</TableCell>
              </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
      <div>
      {fDiary.length > 0 && fDiary.map((row) => (
        <Chart
  width={'500px'}
  height={'300px'}
  chartType="PieChart"
  loader={<div>Loading Chart</div>}
  data={[
    ['Type', 'g Consumed'],
    ['Carbs', row.name.carbs],
    ['Protein', row.name.protein],
    ['Fat', row.name.fat],
  ]}
  options={{
    title: '',
  }}
  rootProps={{ 'data-testid': '1' }}
/>
  ))}
      </div>
      </Fragment>
        ) : (
          <div>

            </div>
        )}

      </div>
    </Fragment>
  )};
};

FoodMain.propTypes = {
  getMealByDate: PropTypes.func.isRequired,
  getCurrentGoals: PropTypes.func.isRequired,
  deleteMeal: PropTypes.func.isRequired,
  getDiary: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  createDiary: PropTypes.func.isRequired,
  meal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  food: PropTypes.object.isRequired,
  fDiary: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  goal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  meal: state.meal,
  food: state.food,
  auth: state.auth,
  fDiary: state.fDiary,
  dietprofile: state.dietprofile,
  goal: state.goal,
});


export default connect(mapStateToProps, {getCurrentGoals, getCurrentDietProfile, createDiary, deleteMeal, getDiary, getMealByDate })(FoodMain);