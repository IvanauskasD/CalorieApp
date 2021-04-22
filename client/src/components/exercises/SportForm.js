import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchSport, getSports, getSportById } from '../../actions/sport'
import { getCurrentDietProfile } from '../../actions/dietprofile';



import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import AddExercise from './AddExercise'

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

const SportForm = ({
    getCurrentDietProfile,
    searchSport,
    getSports,
    getSportById,
    sport: {sport }
}) => {
    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
      getSportById();
    }, [getSportById]);

  let { name } = formData;

  const onSubmit = e => {
    e.preventDefault();
    searchSport(formData, sport ? true : false);
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
      <h1 className="large text-primary">Add Exercise To Diary</h1>

      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Type sport name here"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <input value="Search Exercises" type="submit" className="btn btn-primary my-1" />
      </form>

      {sport !== null ? (
<div>
<TableContainer component={Paper}>
<Table className={classes.table} aria-label="simple table">
  <TableHead>
    <TableRow>
      <TableCell>Sport Name </TableCell>
      <TableCell align="right">Calories</TableCell>
      <TableCell align="right">Add Exercise</TableCell>

    </TableRow>
  </TableHead>
  <TableBody>
    {sport.map((row, i) => (
      <TableRow key={row.name}>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.caloriesBurned}</TableCell>
        <TableCell align="right"><AddExercise props={i} sport={row}/></TableCell>

      </TableRow>
    ))}
  </TableBody>
</Table>
</TableContainer>
</div>






      ) : (

        <Link to={`/exercises?date=`} className='btn btn-danger'>Go Back</Link>

      )}
    </Fragment>
  );
}

SportForm.propTypes = {
    sport: PropTypes.object.isRequired,
    getCurrentDietProfile: PropTypes.func.isRequired,
    getSportById: PropTypes.func.isRequired,
    searchSport: PropTypes.func.isRequired,
    getSports: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    sport: state.sport,
});

export default connect(mapStateToProps, {getSports, getSportById, searchSport, getCurrentDietProfile })(
  SportForm
);