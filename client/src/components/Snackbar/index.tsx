import React from 'react';
import { NotificationStack, NotificationObject, NotificationProps } from 'react-notification';
import Context from './context';

type Props = {
  children: any;
};

export default function SnackbarProvider({ children }: Props) {
  const [snacks, setSnacks] = React.useState([] as NotificationObject[]);
  const defaults: NotificationObject = {
    action: 'Dismiss',
    dismissAfter: 4000,
    key: new Date().getTime(),
    message: '',
    onClick: (notification: NotificationProps, deactivate: () => void) => {
      deactivate();
    }
  };
  const addNotification = (message: string, options: NotificationObject) => {
    const notif: NotificationObject = { ...defaults, message, ...options };
    return setSnacks([notif, ...snacks]);
  };

  const removeNotification = (notification: any) => {
    setSnacks(snacks.filter(n => n !== notification));
  };

  const [contextValue] = React.useState({ addNotification, removeNotification });

  return (
    <Context.Provider value={contextValue}>
      {children}
      <NotificationStack notifications={snacks} onDismiss={removeNotification} />
    </Context.Provider>
  );
}
