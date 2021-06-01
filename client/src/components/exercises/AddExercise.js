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

import { createExercise } from '../../actions/exercise'
import { getCurrentDietProfile } from '../../actions/dietprofile'
import { getSportById } from '../../actions/sport'
import { createSportDiary } from '../../actions/sDiary'


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

const AddExercise = ({
  auth,
  exercise,
  createExercise,
  createSportDiary,
  sport,
  props,
  dietprofile,
  getCurrentDietProfile,
  diena
}) => {

  const initialState = {
    date: '',
    typeExercise: '',
    quantity: '',
    calories: '',
    user: '',
    sport: { name: '' }
  };

  const initialState2 = {
    date: '',
    user: ''
  };

  const test2 = {
    sum: ''
  }

  const [open, setOpen] = React.useState(false);
  const [sportz, setsportz] = useState([])
  let zqa = new Date()
  let test = diena

  const [formData, setFormData] = useState(initialState);
  const [formData2, setFormData2] = useState(initialState2);

 const [state2, setState2] = useState(test2)

  useEffect(() => {
    getCurrentDietProfile()
    
    //createExercise(formData);
  }, [getCurrentDietProfile, formData]);

  let { date, typeExercise, quantity, calories, user, sport: { name } } = formData;




  const handleClickOpen = () => {
    setOpen(true);
    setsportz(props)
    formData.typeExercise = 'Strength'



  };
  const handleClose = () => {
    setOpen(false);
  };

  const onChange = e => {
    if (isNaN(Number(e.target.value))) {
      return;
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    test2.sum = (e.target.value *  sportz.caloriesBurned)
    setState2(test2)
}

  const onChangeCal = e => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const onSubmit = e => {
    e.preventDefault();
    formData.user = dietprofile.dietprofile.user._id
    formData.date = test
    formData.sport.name = sportz.name
    formData2.date = test
    formData2.user = dietprofile.dietprofile.user._id
    formData.calories = state2.sum
    createExercise(formData).then(() => {
        createSportDiary(formData2)
    });

    handleClose()
  };
  return (
    <div>

      {sport !== null ? (
        <div>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Open Exercise Dialog
      </Button>
          <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              {sportz.name}
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
                        placeholder="* sport id"
                        name="sportz._id"
                        value={sportz._id}
                        required

                      />
                    </div>
                   
                    <div className="form-group">
                      <label>Minutes Done:</label>
                      <input
                        type="text"
                        placeholder="*minutes"
                        name="quantity"
                        value={quantity}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Burned Calories:</label>
                      <input
                        type="text"
                        placeholder="* calories"
                        name="calories"
                        value={state2.sum}
                        onChange={onChangeCal}
                        disabled
                        required
                      />
                    </div>


                    <input type="submit" className="btn btn-primary my-1" />
                  </form>
                </Fragment>
              </Typography>
            </DialogContent>
            <DialogActions>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <p></p>
      )}

    </div>
  );
}

AddExercise.propTypes = {
  auth: PropTypes.object.isRequired,
  exercise: PropTypes.object.isRequired,
  createExercise: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  createSportDiary: PropTypes.func.isRequired,
  getSportById: PropTypes.func.isRequired,
  sport: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  exercise: state.exercise,
  sport: state.sport,
  dietprofile: state.dietprofile,
});

export default connect(mapStateToProps, { createSportDiary, getSportById, getCurrentDietProfile, createExercise })(AddExercise);