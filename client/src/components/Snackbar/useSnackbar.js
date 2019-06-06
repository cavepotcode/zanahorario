import { useContext } from 'react';
import Context from './context';

export default function() {
  const { addNotification, removeNotification } = useContext(Context);

  return {
    addNotification,
    removeNotification
  };
}
