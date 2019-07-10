export function generateInitialEntries(startDate, projectsTime) {
  return projectsTime.map(item => {
    let date = new Date(startDate);
    const entries = [];
    for (let day = 0; day < 7; day++) {
      // eslint-disable-next-line
      const entry = item.entries.find(e => e.date && e.date.toDateString() === date.toDateString());
      entries.push({
        date,
        hours: (entry && entry.hours) || null
      });

      date = new Date(date);
      date.setDate(date.getDate() + 1);
    }
    return { project: item.project, entries };
  });
}

export function getTimeChanges(projectsTime) {
  let changes = [];
  projectsTime.forEach(({ project, entries }) => {
    const changedEntries = entries
      .filter(e => e.changed)
      .map(e => ({ date: e.date, hours: e.hours, projectId: project.id }));

    changes = [...changes, ...changedEntries];
  });

  return changes;
}
