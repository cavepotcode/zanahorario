import React from 'react';
import { Redirect } from '@reach/router';
import useStoreon from 'storeon/react';

type Props = {
  children?: any;
  component: React.ComponentType;
  default?: boolean;
  path: string;
};

export function PublicRoute({ component: Component, ...props }: Props) {
  return <Component {...props} />;
}

export function PrivateRoute({ component: Component, ...props }: Props) {
  const { user } = useStoreon('user');
  return user && user.isAuthenticated ? <Component {...props} /> : <Redirect to="/login" noThrow />;
}
