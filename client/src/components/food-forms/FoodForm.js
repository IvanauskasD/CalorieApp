import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchFood, getFoods } from '../../actions/food'
import { getCurrentDietProfile } from '../../actions/dietprofile';
import { DebounceInput } from 'react-debounce-input';


import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });


const initialState = {
    name: ''
  };

const FoodForm = ({
    getCurrentDietProfile,
    searchFood,
    food: {food }
}) => {
    const [formData, setFormData] = useState(initialState);


  let { name } = formData;
  const onSubmit = e => {
    e.preventDefault();
    searchFood(formData, food ? true : false);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const classes = useStyles();


  return (
    <Fragment>
      <h1 className="large text-primary">Add food</h1>

      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" />

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
            </Link>
      </form>

      {food !== null ? (

<TableContainer component={Paper}>
<Table className={classes.table} aria-label="simple table">
  <TableHead>
    <TableRow>
      <TableCell>Food name</TableCell>
      <TableCell align="right">temp</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {food.map((foo) => (
      <TableRow key={foo.name}>
        <TableCell component="th" scope="row">
          {foo.name}
        </TableCell>
        <TableCell align="right">lox</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
      ) : (

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
            </Link>
      )}
    </Fragment>
  );
}

FoodForm.propTypes = {
    food: PropTypes.object.isRequired,
    getCurrentDietProfile: PropTypes.func.isRequired,
    searchFood: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    food: state.food,
});

export default connect(mapStateToProps, {searchFood, getCurrentDietProfile })(
  FoodForm
);