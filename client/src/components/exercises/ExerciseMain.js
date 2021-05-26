import React, { useCallback, Fragment, useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { getExerciseByDate, deleteExercise } from '../../actions/exercise';
import { getSportById } from '../../actions/sport';
import { createSportDiary, getSportDiary } from '../../actions/sDiary'
import { getCurrentDietProfile } from '../../actions/dietprofile'


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


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});


const ExerciseMain = ({
    getCurrentDietProfile,
    getExerciseByDate,
    deleteExercise,
    createSportDiary,
    exercise: {exercise},
    match,
    dietprofile,
    sDiary: {sDiary},
    getSportDiary,
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
      const [formData3, setFormData3] = useState({});
      const [isUpdated, setIsUpdated] = useState(false)
    
      const [testx, setTest] = useState('')
    
      let test = new Date()
      let zqa = new Date(test.getTime() + (3*60*60*1000)).toISOString()
    
    
      function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
    
      let url = new URL(window.location.href)
      let paramz = new URLSearchParams(url.search);


      let query = useQuery();

  function onChange(e) {
   // test2.sum = e.toISOString().replace(/T.+/, '')
   let zqa = new Date(e.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '')
   test2.sum = zqa
   setQuery(test2)

  }
 const dd = new URLSearchParams()

  useEffect(() => {
  
    const params = new URLSearchParams()
    if (queryz.sum) {
      params.set("date", queryz.sum)
    } else {
      params.delete("date")
    }
    if (params.toString() === '') {
      params.set("date", new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, ''))
      getExerciseByDate(new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, ''))
      getSportDiary(new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, ''))
      history.push({ search: new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '') })
      initialState2.date = new Date(test.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '')
      initialState2.user = localStorage.getItem('dietprofile')
      setFormData2(initialState2)    
    } else {
        getExerciseByDate(queryz.sum)
        getSportDiary(queryz.sum)
        initialState2.date = params.get('date').toString()
        initialState2.user = localStorage.getItem('dietprofile')
        setFormData2(initialState2)
  
    }
    setIsUpdated(false)
    history.push({ search: params.toString() })

  }, [queryz, history, isUpdated]);



  const classes = useStyles();

  const handleDelete = (id, n, data) => {
    setIsUpdated(true)
    deleteExercise(id, n, data)
  }

  return (
    <Fragment>
      <DatePicker dateFormat={"yyyy-MM-dd"}
        onSelect={onChange}
        selected={startDate} onChange={date => setStartDate(date)} />
      
      <div>
        <br/>
      <Link to='/add-sport' className='btn btn-danger'>Add Exercise</Link>
    
      </div>
      
      <div>
    <br/>
        <Fragment>
        <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Cardiovascular</TableCell>
            <TableCell align="right">Minutes</TableCell>
            <TableCell align="right">Calories Burned</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Fragment>
          {exercise && exercise.length>0 && exercise.map(row => {
          
          return row.sports.map((innerElement) => (
            <Fragment>
            {row.typeExercise === 'Strength' ? (
            <TableRow key={innerElement._id.name}>
            <TableCell component="th" scope="row">
              {innerElement._id.name}
            </TableCell>
          
            <TableCell align="right">{innerElement.quantity}</TableCell>
            <TableCell align="right">{innerElement.calories}</TableCell>
            <TableCell align="right">
           <Button onClick={() => handleDelete(row._id, row.sports.indexOf(innerElement), formData2)}>Remove</Button></TableCell>
          </TableRow>
            ): (
              <p></p>
            )}
            </Fragment>
          

            
          ))})}
          </Fragment>
       

        </TableBody>
      </Table>
    </TableContainer>
        </Fragment>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <div>
        {sDiary !== null ? (
        <Fragment>
        <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Exercise Total</TableCell>
              <TableCell align="right">Calories Burned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sDiary.length > 0 && sDiary.map((row) => (
              <TableRow key={row._id}>
                <TableCell component="th" scope="row">
                 Total
                </TableCell>
                <TableCell align="right">{row.name.calories}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Fragment>
        ) : (
          <div>
            </div>
        )}

      </div>
    </Fragment>
  );
};

ExerciseMain.propTypes = {
    getExerciseByDate: PropTypes.func.isRequired,
    deleteExercise: PropTypes.func.isRequired,
    getSportDiary: PropTypes.func.isRequired,
    getCurrentDietProfile: PropTypes.func.isRequired,
    createSportDiary: PropTypes.func.isRequired,
    exercise: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    sport: PropTypes.object.isRequired,
    sDiary: PropTypes.object.isRequired,
    dietprofile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    exercise: state.exercise,
    sport: state.sport,
    auth: state.auth,
    sDiary: state.sDiary,
    dietprofile: state.dietprofile,
});


export default connect(mapStateToProps, { getCurrentDietProfile, createSportDiary, deleteExercise, getSportDiary, getExerciseByDate })(ExerciseMain);