import React, { useCallback, Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getDiary } from '../../actions/fDiary';
import { getSportDiary } from '../../actions/sDiary';


import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const ProgressTable = ({
  getDiary,
  getSportDiary,
  fDiary: {fDiary},
  sDiary: {sDiary},
  goal: {goal}
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


      
      if(fDiary){
        setLoaded(true)
      } 

      if(sDiary){
        setLoaded1(true)
      } 
      
      if(fDiary && sDiary && goal && fDiary.length > 0 && sDiary.length > 0)
      setMed(fDiary[0].consumedCalories + sDiary[0].name.calories)


      if(fDiary && sDiary && fDiary.length > 0 && sDiary.length > 0)
      {
        setNetF(goal.calories - (fDiary[0].consumedCalories + sDiary[0].name.calories))
      }
   

  }, [getDiary, sDiary, fDiary, leftFood, leftExercise, loaded, loaded1]);

  return (
    <List className={classes.root}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={goal ? <h1>{goal.calories}</h1> : console.log('no')} secondary="Goals" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={fDiary && fDiary.length > 0 ? fDiary[0].consumedCalories : 0} secondary="Left To Consume" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={sDiary && sDiary.length > 0 ? sDiary[0]?.name.calories : 0} secondary="Exercise" />
        </ListItem>    
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={netF} secondary="Net" />
      </ListItem>
    </List>

  );
};

ProgressTable.propTypes = {
  getDiary: PropTypes.func.isRequired,
  getSportDiary: PropTypes.func.isRequired,
  fDiary: PropTypes.object.isRequired,
  sDiary: PropTypes.object.isRequired,
  goal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fDiary: state.fDiary,
  sDiary: state.sDiary,
  goal: state.goal
});

export default connect(mapStateToProps, { getSportDiary, getDiary })(
  ProgressTable
);