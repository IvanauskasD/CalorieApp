import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchFood, getFoods, getFoodById } from '../../actions/food'
import { getCurrentDietProfile } from '../../actions/dietprofile';
import { DebounceInput } from 'react-debounce-input';
import { FoodItem} from '../food-forms/FoodItem'
import FoodInfo from '../food-forms/FoodInfo'


import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Serving from './Serving'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  table: {
    minWidth: 650,
  },
}));
const initialState = {
    name: ''
  };

const FoodForm = ({
    getCurrentDietProfile,
    searchFood,
    getFoods,
    getFoodById,
    food: {food }
}) => {
    const [formData, setFormData] = useState(initialState);
    
    useEffect(() => {
      getFoodById();
    }, [getFoodById]);

  let { name } = formData;
  const onSubmit = e => {
    e.preventDefault();
    searchFood(formData, food ? true : false);
   // console.log(formData)
  };

  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  return (
    <Fragment>
      <h1 className="large text-primary">Add Food To Diary</h1>

      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Type food name here"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <input value="Search Food" type="submit" className="btn btn-primary my-1" />
      
        <Link to={`/mealz?date=`} className='btn btn-light'>Go Back</Link>
      </form>

      {food !== null ? (
<div>
<TableContainer component={Paper}>
<Table className={classes.table} aria-label="simple table">
  <TableHead>
    <TableRow>
      <TableCell>Food Name</TableCell>
      <TableCell align="right">Calories</TableCell>
      <TableCell align="right">Carbs&nbsp;(g)</TableCell>
      <TableCell align="right">Protein&nbsp;(g)</TableCell>
      <TableCell align="right">Fat&nbsp;(g)</TableCell>
      <TableCell align="right">Add Food</TableCell>
      <TableCell align="right"> </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {food.map((row, i) => (
      <TableRow key={row.name}>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right"><Serving props={i} food={row}/></TableCell>
        <TableCell align="right"></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
</div>
      ) : (

        <div></div>
      )}
    </Fragment>
  );
}

FoodForm.propTypes = {
    food: PropTypes.object.isRequired,
    getCurrentDietProfile: PropTypes.func.isRequired,
    getFoodById: PropTypes.func.isRequired,
    searchFood: PropTypes.func.isRequired,
    getFoods: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    food: state.food,
});

export default connect(mapStateToProps, {getFoods, getFoodById, searchFood, getCurrentDietProfile })(
  FoodForm
);