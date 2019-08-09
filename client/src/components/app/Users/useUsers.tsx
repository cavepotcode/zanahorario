import React from 'react';
import useSnackbar from '../../Snackbar/useSnackbar';
import { apiUrls } from '../../../urls';
import api from '../../../utils/api';
import { toSpanishFormat } from '../../../utils/date';

export default function useUsers(selectedDate: Date) {
  const { addNotification } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const url = apiUrls.users.timesheets(selectedDate);
      try {
        const response = await api.get(url);
        const users = response.data.map((item: any) => ({
          ...item,
          lastTime: toSpanishFormat(item.lastEntry)
        }));

        setUsers(users);
      } catch (error) {
        setError(error);
        addNotification('There was an error getting the users. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedDate, addNotification]);

  return { users, loading, error };
}
