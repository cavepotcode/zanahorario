import React from 'react';
import Projects from './index';
import api from '../../../utils/api';
import * as utils from '../../../test-utils';

jest.mock('../../../utils/api');

it('renders without crashing', () => {
  const { container } = utils.render(<Projects />);

  expect(container).toBeTruthy();
});

it('should trigger an api call', () => {
  utils.render(<Projects />);

  expect(api.get).toHaveBeenCalled();
  expect(api.get).toHaveBeenCalledWith(expect.any(String));
});

it('should render all projects', () => {
  const projects = {
    code: 0,
    data: [
      {
        lastTime: '6/28/2019 12:00:00 AM',
        totalHours: 6340,
        monthHours: 160,
        month: null,
        project: {
          id: 'project-1',
          name: 'Project1',
          description: '',
          projectMonthHours: 0
        },
        projects: null,
        usersHoursByProject: [
          {
            id: null,
            email: 'sample@cavepot.com',
            initials: 'S1',
            userMonthHours: 160
          }
        ]
      },
      {
        lastTime: '6/14/2019 12:00:00 AM',
        totalHours: 1190,
        monthHours: 80,
        month: null,
        project: {
          id: 'project-2',
          name: 'Project2',
          description: 'Proyectos cerrados',
          projectMonthHours: 0
        },
        projects: null,
        usersHoursByProject: [
          {
            email: 'sample2@cavepot.com',
            initials: 'S2',
            userMonthHours: 80
          }
        ]
      }
    ]
  };

  api.get.mockReturnValueOnce(projects);
  const { container } = utils.render(<Projects />);
  expect(api.get).toHaveBeenCalled();

  // https://github.com/testing-library/react-testing-library/issues/281#issuecomment-480349256
  setImmediate(() => {
    const projectElems = container.querySelectorAll('.project');
    expect(projectElems).toHaveLength(2);
  });
});
