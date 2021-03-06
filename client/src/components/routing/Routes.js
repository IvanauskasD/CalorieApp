
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import ProfileForm from '../profile-forms/ProfileForm';
import DietProfileForm from '../profile-forms/DietProfileForm';
import Profile from '../profile/Profile';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import FoodForm from '../food-forms/FoodForm'
import Goal from '../goals/GoalForm'
import FoodInfo from '../food-forms/FoodInfo'
import FoodMain from '../food-forms/FoodMain'
import FoodItem from '../food-forms/FoodItem'
import ExerciseMain from '../exercises/ExerciseMain'
import SportForm from '../exercises/SportForm'
import SportItem from '../exercises/SportItem'

const Routes = props => {
  return (
    <section className="container">
      <Alert />
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile/:id" component={Profile} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/create-profile" component={ProfileForm} />
        <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
        <PrivateRoute exact path="/add-diet-profile" component={DietProfileForm} />
        <PrivateRoute exact path="/edit-diet-profile" component={DietProfileForm} />
        <PrivateRoute exact path="/view-diet-profile" component={DietProfileForm} />
        <PrivateRoute exact path="/set-goal" component={Goal} />
        <PrivateRoute exact path="/food/food/:id" component={FoodInfo} />
        <PrivateRoute exact path="/mealz:date?" component={FoodMain} />
        <PrivateRoute exact path="/add-food:date?" component={FoodForm} />
        <PrivateRoute exact path="/exercises:date?" component={ExerciseMain} />
        <PrivateRoute exact path="/add-sport:date?" component={SportForm} />
        <PrivateRoute exact path="/suggest-food" component={FoodItem} />
        <PrivateRoute exact path="/suggest-sport" component={SportItem} />

        <Route component={NotFound} />
  
      </Switch>
    </section>
  );
};

export default Routes;