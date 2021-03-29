
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import ProfileForm from '../profile-forms/ProfileForm';
import DietProfileForm from '../profile-forms/DietProfileForm';
import SettingsMain from '../settings/SettingsMain';
import Profile from '../profile/Profile';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import FoodForm from '../food-forms/FoodForm'
import Goal from '../goals/GoalForm'
import FoodItem from '../food-forms/FoodItem'
import FoodMain from '../food-forms/FoodMain'

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
        <PrivateRoute exact path="/settings" component={SettingsMain} />
        <PrivateRoute exact path="/view-diet-profile" component={DietProfileForm} />
        <PrivateRoute exact path="/add-food" component={FoodForm} />
        <PrivateRoute exact path="/set-goal" component={Goal} />
        <PrivateRoute exact path="/fDiary/food/:id" component={FoodItem} />
        <PrivateRoute exact path="/food-main" component={FoodMain} />

        <Route component={NotFound} />
  
      </Switch>
    </section>
  );
};

export default Routes;