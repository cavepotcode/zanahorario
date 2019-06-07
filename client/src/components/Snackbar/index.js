import React from 'react';
import { NotificationStack } from 'react-notification';
import Context from './context';

export default function SnackbarProvider({ children }) {
  const [snacks, setSnacks] = React.useState([]);
  const defaults = {
    action: 'Dismiss',
    dismissAfter: 4000,
    key: new Date().getTime(),
    onClick: (notification, deactivate) => {
      deactivate();
    }
  };
  const addNotification = (message, options) => {
    const notif = { ...defaults, message, ...options };
    return setSnacks([notif, ...snacks]);
  };

  const removeNotification = notification => {
    setSnacks(snacks.filter(n => n !== notification));
  };

  const contextValue = {
    addNotification,
    removeNotification
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
      <NotificationStack notifications={snacks} onDismiss={removeNotification} />
    </Context.Provider>
  );
}
