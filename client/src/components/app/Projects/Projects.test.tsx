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
        lastEntry: '6/28/2019 12:00:00 AM',
        total: 6340,
        monthHours: 160,
        project: {
          id: 'project-1',
          name: 'Project1'
        },
        usersHours: [
          {
            user: { id: 1, initials: 'S1' },
            hours: 160
          }
        ]
      },
      {
        lastEntry: '6/14/2019 12:00:00 AM',
        total: 1190,
        monthHours: 80,
        project: {
          id: 'project-2',
          name: 'Project2'
        },
        usersHours: [
          {
            user: { id: 2, initials: 'S2' },
            hours: 80
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
