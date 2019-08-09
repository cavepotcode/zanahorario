import React from 'react';
import useSnackbar from '../../Snackbar/useSnackbar';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import { toSpanishFormat } from '../../../utils/date';

export default function useProjects(selectedDate: Date) {
  const { addNotification } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const url = apiUrls.timesheets.project(selectedDate);
      try {
        const response = await api.get(url);
        const projects = response.data.map((item: any) => ({
          ...item,
          lastTime: toSpanishFormat(item.lastEntry)
        }));

        setProjects(projects);
        setError(null);
      } catch (error) {
        setError(error);
        addNotification('There was an error getting the projects. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedDate, addNotification]);

  return { loading, error, projects };
}
