import React from 'react';
import Timesheet from '../index';
import api from '../../../../utils/api';
import * as utils from '../../../../test-utils';

jest.mock('../../../../utils/api');

it('should fetch the timesheets', () => {
  utils.render(<Timesheet />);

  expect(api.get).toHaveBeenCalled();
  expect(api.get).toHaveBeenCalledWith(expect.any(String));
});

it('shows the "Add Project" button if there are any available', async () => {
  const projects = [{ id: 1, name: 'Random' }];
  const { container } = utils.render(<Timesheet />, null, { projects });
  await utils.nextTick();

  const addProject = utils.getByText(container, 'Add Project');
  expect(addProject).toBeTruthy();
});

it('shows projects dropdown when adding new project', async done => {
  const projects = [{ id: 1, name: 'Random' }];
  const { container } = utils.render(<Timesheet />, null, { projects });
  await utils.nextTick();

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

it('can add a new project', async done => {
  const projects = [{ id: 1, name: 'Random' }];
  const { container } = utils.render(<Timesheet />, null, { projects });
  await utils.nextTick();

  let projectsLines = container.querySelectorAll('[data-test-project]');
  expect(projectsLines).toHaveLength(0);

  const button = container.querySelector('footer [type=button]');
  utils.fireEvent.click(button);

  const dropdown = container.querySelector('select');
  utils.fireEvent.change(dropdown, { target: { value: '1' } });

  projectsLines = container.querySelectorAll('[data-test-project]');
  expect(projectsLines).toHaveLength(1);

  done();
});
