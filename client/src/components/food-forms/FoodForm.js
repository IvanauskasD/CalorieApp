import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchFood, getFoods, getFoodById } from '../../actions/food'
import { getCurrentDietProfile } from '../../actions/dietprofile';
import { DebounceInput } from 'react-debounce-input';
import { FoodItem} from '../food-forms/FoodItem'

import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
}));


const initialState = {
    name: ''
  };

const FoodForm = ({
    getCurrentDietProfile,
    searchFood,
    getFoodById,
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
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


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


<div className={classes.root}>
{food.map((foo, i) => (
  <Accordion expanded={expanded === 'panel' + i} onChange={handleChange('panel'+ i)}>

  <AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="panel1bh-content"
    id="panel1bh-header"
  >
    <Typography className={classes.heading}>{foo.name}</Typography>
    <Typography className={classes.secondaryHeading}>{foo.calories}</Typography>
  </AccordionSummary>
  <AccordionDetails>
    <Typography>
    <Link to={`/fDiary/food/${foo._id}`} className='btn btn-primary'>test</Link>
    </Typography>
  </AccordionDetails>
</Accordion>
    ))}


</div>




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
    getFoodById: PropTypes.func.isRequired,
    searchFood: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    food: state.food,
});

export default connect(mapStateToProps, {getFoodById, searchFood, getCurrentDietProfile })(
  FoodForm
);