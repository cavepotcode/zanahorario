import React from 'react';
import { Redirect } from '@reach/router';
import useStoreon from 'storeon/react';

export function PublicRoute({ component: Component, ...props }) {
  return <Component {...props} />;
}

export function PrivateRoute({ component: Component, ...props }) {
  const { user } = useStoreon('user');
  return user && user.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" noThrow />;
}
