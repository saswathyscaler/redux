import React, { useContext, Suspense } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { AuthContext } from './shared/contexts/AuthContext';

const ProjectApp = React.lazy(() => import('./project/ProjectApp'));
const ProjectsDashboardApp = React.lazy(() => import('./dashboard/ProjectsDashboardApp'));

import Login from './Login';
import ResetPasswordForm from './ResetPasswordForm';
import InvitedUserRegisterForm from './InvitedUserRegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { FullPageLoadingSpinner } from './shared/components/LoadingSpinner';
import { Provider } from 'react-redux';
import store from 'dashboard/app/store';

import './App.css';

const NoRoute = () => <Redirect to="/" />;


const ProtectedRoute = ({ component, ...options }) => {
  const { isLoggedIn, authLoading } = useContext(AuthContext);
  const referrerPath = options.location?.pathname ||  "/";
  
  if (!isLoggedIn && !authLoading) return (
    <Redirect
      to={{
        path: "/",
        state: { referrer: referrerPath }
      }}
    />
  );
  
  return <Route {...options} component={component} />;
};


const AnonymousOnlyRoute = ({ component, ...options }) => {
  const { isLoggedIn, authLoading } = useContext(AuthContext);
  
  if (isLoggedIn && !authLoading) return <Redirect to="/" />;
  
  return <Route {...options} component={component} />;
};


const App = () => {
  const { authLoading, isLoggedIn } = useContext(AuthContext);
  
  if (authLoading) return <FullPageLoadingSpinner />

  return (
    <Provider store={store}>
    <Suspense fallback={<FullPageLoadingSpinner />}>
      <Switch>
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/dashboard" /> : <Login />}
        </Route>
        <ProtectedRoute
          path="/dashboard"
          component={ProjectsDashboardApp}
        />
        <ProtectedRoute
          path="/projects/:project_access_token"
          component={ProjectApp}
        />
        <AnonymousOnlyRoute
          exact
          path="/invite-user-link/:email_signup_token"
          component={InvitedUserRegisterForm}
        />
        <AnonymousOnlyRoute
          exact
          path="/reset-password"
          component={ForgotPasswordForm}
        />
        <AnonymousOnlyRoute
          exact
          path="/reset-password-link/:reset_password_token"
          component={ResetPasswordForm}
        />
        <Route component={NoRoute} />
      </Switch>
    </Suspense>
    </Provider>

  );
};

export default App;