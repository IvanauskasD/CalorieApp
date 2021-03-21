
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
import DietProfile from '../settings/DietProfile'
import Food from '../food-forms/FoodForm'
import Goal from '../goals/GoalForm'
import GoalMain from '../goals/GoalMain'

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
        <PrivateRoute exact path="/create-food" component={Food} />
        <PrivateRoute exact path="/set-goal" component={Goal} />
        <PrivateRoute exact path="/view-goal" component={GoalMain} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;