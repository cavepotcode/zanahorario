import React from 'react';
import Timesheet from './index';
import api from '../../../utils/api';
import * as utils from '../../../test-utils';

jest.mock('../../../utils/api');

it('renders without crashing', () => {
  const { container } = utils.render(<Timesheet />);
  const monday = utils.getByText(container, 'Monday');
  const weekSlider = utils.getByText(container, 'WEEK');
  const save = utils.getByText(container, 'Save');

  expect(monday).toBeTruthy();
  expect(weekSlider).toBeTruthy();
  expect(save).toBeTruthy();
});

it('should fetch the timesheets', () => {
  utils.render(<Timesheet />);

  expect(api.get).toHaveBeenCalled();
  expect(api.get).toHaveBeenCalledWith(expect.any(String));
});

it('shows the "Add Project" button if there are any available', () => {
  const projects = [{ id: 1, name: 'Random' }];
  const { container } = utils.render(<Timesheet />, null, { projects });

  setImmediate(() => {
    const addProject = utils.getByText(container, 'Add Project');
    expect(addProject).toBeTruthy();
  });
});

it('shows projects dropdown when adding new project', done => {
  const projects = [{ id: 1, name: 'Random' }];
  const { container } = utils.render(<Timesheet />, null, { projects });

  setImmediate(() => {
    const addProject = utils.getByText(container, 'Add Project');
    expect(addProject).toBeTruthy();

    const button = container.querySelector('footer [type=button]');
    utils.fireEvent.click(button);

    const dropdown = container.querySelector('select');
    expect(dropdown).toBeTruthy();

    const options = container.querySelectorAll('option');
    expect(options).toHaveLength(2);
    done();
  });
});

it('can add a new project', done => {
  const projects = [{ id: 1, name: 'Random' }];
  const { container } = utils.render(<Timesheet />, null, { projects });

  const projectsLines = container.querySelectorAll('[data-test-project]');
  expect(projectsLines).toHaveLength(0);

  setImmediate(() => {
    const button = container.querySelector('footer [type=button]');
    utils.fireEvent.click(button);

    const dropdown = container.querySelector('select');
    utils.fireEvent.change(dropdown, { target: { value: '1' } });

    const projectsLines = container.querySelectorAll('[data-test-project]');
    expect(projectsLines).toHaveLength(1);

    done();
  });
});
