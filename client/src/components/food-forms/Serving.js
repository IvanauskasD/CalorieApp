import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import { createMeal } from '../../actions/meal'
import { getCurrentDietProfile } from '../../actions/dietprofile'
import { getFoodById } from '../../actions/food'
import { createDiary } from '../../actions/fDiary'


const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Serving = ({
  auth,
  meal: { meal },
  createMeal,
  createDiary,
  food,
  props,
  dietprofile,
  getCurrentDietProfile
}) => {

  const initialState = {
    date: '',
    type: '',
    quantity: '',
    servings: '',
    user: '',
    food: { name: '' }
  };

  const initialState2 = {
    date: '',
    user: ''
  };


  const [open, setOpen] = React.useState(false);
  const [foodz, setFoodz] = useState([])
  let zqa = new Date()
  let test = new Date(zqa.getTime() + (3*60*60*1000)).toISOString()

  const [formData, setFormData] = useState(initialState);
  const [formData2, setFormData2] = useState(initialState2);
  // useEffect(() => {
  //   if (!goal) getCurrentGoals();
  //   if (!loading && goal) {
  //     const goalData = { ...initialState };
  //     for (const key in goal) {
  //       if (key in goalData) goalData[key] = goal[key];
  //     }
  //     setFormData(goalData);
  //   }


  // }, []);


  useEffect(() => {
    getCurrentDietProfile()
    console.log(formData)
    //createMeal(formData);
  }, [getCurrentDietProfile, formData]);

  // useEffect(() => {
  //   if (!goal) getCurrentGoals();
  //   if (!loading && goal) {
  //     const goalData = { ...initialState };
  //     for (const key in goal) {
  //       if (key in goalData) goalData[key] = goal[key];
  //     }
  //     setFormData(goalData);
  //   }
  // }, [loading, getCurrentGoals, goal, getCurrentDietProfile]);

  let { date, type, quantity, servings, user, food: { name } } = formData;




  const handleClickOpen = () => {
    setOpen(true);
    setFoodz(food.food[props])
    console.log(dietprofile.dietprofile.user._id)
    formData.type = '0'
     formData.quantity = '0.1'
    console.log(formData)

  };
  const handleClose = () => {
    setOpen(false);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = e => {
    e.preventDefault();
    formData.user = dietprofile.dietprofile.user._id
    formData.date = test
    formData.food.name = foodz.name
    formData2.date = test
    formData2.user = dietprofile.dietprofile.user._id
    createMeal(formData).then(() => {
      createDiary(formData2)
    });
  };
  return (
    <div>

      {food !== null ? (
        <div>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Open dialog
      </Button>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              {foodz.name}
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                <Fragment>
                  <form
                    className="form"
                    onSubmit={onSubmit}
                  >
                    <div className="form-group">
                      <input
                        type="hidden"
                        placeholder="* food id"
                        name="foodz._id"
                        value={foodz._id}
                        required

                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="* servings"
                        name="servings"
                        value={servings}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <select
                        name="quantity"
                        value={quantity}
                       onChange={onChange}
                      >
                        <option value="0.1">100g</option>
                        <option value="0.001">1g</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <select
                        name="type"
                        value={type}
                       onChange={onChange}
                      >
                        <option value="0">Breakfast</option>
                        <option value="1">Lunch</option>
                        <option value="2">Dinner</option>
                        <option value="3">Snacks</option>
                      </select>
                    </div>


                    <input type="submit" className="btn btn-primary my-1" />

                    <Link className="btn btn-light my-1" to="/dashboard">
                      Go Back
          </Link>
                  </form>
                </Fragment>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                Save changes
        </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <p></p>
      )}

    </div>
  );
}

Serving.propTypes = {
  auth: PropTypes.object.isRequired,
  meal: PropTypes.object.isRequired,
  createMeal: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  createDiary: PropTypes.func.isRequired,
  getFoodById: PropTypes.func.isRequired,
  food: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  meal: state.meal,
  food: state.food,
  dietprofile: state.dietprofile,
});

export default connect(mapStateToProps, { createDiary, getFoodById, getCurrentDietProfile, createMeal })(Serving);