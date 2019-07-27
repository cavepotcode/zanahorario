import React from 'react';
import api from '../../../utils/api';
import { apiUrls } from '../../../urls';
import { IUserState } from '../../../store/user';
import useSnackbar from '../../Snackbar/useSnackbar';
import { generateInitialEntries } from './helper';
import { ITimesheet } from './interfaces';

export default function useTimesheets(user: IUserState, date: Date, projects: any[]) {
  const [entries, setEntries] = React.useState([]);
  const [ready, setReady] = React.useState(false);
  const [timesheet, setTimesheet] = React.useState<ITimesheet>({ hours: {}});
  const { addNotification } = useSnackbar();

  React.useEffect(() => {
    async function fetch() {
      try {
        let { data: entries } = await api.get(apiUrls.timesheets.user(date));

        // If week is empty, show the most recent projects
        if (Object.keys(entries).length === 0) {
          user.recentProjects.forEach((proj: number) => (entries[proj] = []));
        }

        setEntries(entries);

        const timesheet = generateInitialEntries(date, entries, projects);
        setReady(true);
        setTimesheet(timesheet);
      } catch (err) {
        addNotification(err.message);
      }
    }

    if (projects.length) {
      fetch();
    }
  }, [date, projects, user, addNotification]);

  return { addNotification, entries, timesheet, ready, setTimesheet, setEntries };
}
