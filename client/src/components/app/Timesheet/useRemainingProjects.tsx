import React from 'react';

export default function useRemainingProjects(timesheet: any, projects: any) {
  const [remainingProjects, setRemainingProjects] = React.useState([]);

  React.useEffect(() => {
    const remainingProjects =
      projects &&
      projects.filter(
        (proj: any) =>
          !Object.keys(timesheet)
            .map(Number)
            .includes(proj.id)
      );
    setRemainingProjects(remainingProjects);
  }, [timesheet, projects]);

  return { remainingProjects };
}
