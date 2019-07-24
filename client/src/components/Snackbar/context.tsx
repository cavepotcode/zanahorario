import React from 'react';

export interface ISnackbarContext {
  addNotification: Function;
  removeNotification: Function;
}

export default React.createContext({} as ISnackbarContext);
