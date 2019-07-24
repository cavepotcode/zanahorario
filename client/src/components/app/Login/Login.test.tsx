import React from 'react';
import Login from './index';
import api from '../../../utils/api';
import * as utils from '../../../test-utils';

jest.mock('../../../utils/api');

it('renders without crashing', () => {
  const { container } = utils.render(<Login />);
  const submit = utils.getByText(container, 'Log in');
  const email = utils.getByPlaceholderText(container, 'Email');
  const password = utils.getByPlaceholderText(container, 'Password');

  expect(submit).toBeTruthy();
  expect(email).toBeTruthy();
  expect(password).toBeTruthy();
});

it('should prevent the user to continue if there are missing fields', async () => {
  const { container } = utils.render(<Login />);

  const submit = container.querySelector('button');
  utils.fireEvent.click(submit);
  await utils.nextTick();

  let errors = getErrors(container);
  expect(errors).toHaveLength(2);

  const email = container.querySelector('[type=email]');
  utils.fireEvent.change(email, { target: { value: 'si@example.com' } });
  await utils.nextTick();

  errors = getErrors(container);
  expect(errors).toHaveLength(1);

  const password = container.querySelector('[type=password]');
  utils.fireEvent.change(password, { target: { value: 'pwd123' } });
  await utils.nextTick();

  errors = getErrors(container);
  expect(errors).toHaveLength(0);
});

it('should call api when submitted', async () => {
  const creds = { email: 'user@example.com', password: 'pwd123' };
  const { container } = utils.render(<Login />);
  const submit = container.querySelector('button');
  const email = container.querySelector('[type=email]');
  const password = container.querySelector('[type=password]');

  utils.fireEvent.change(email, { target: { value: creds.email } });
  utils.fireEvent.change(password, { target: { value: creds.password } });
  utils.fireEvent.click(submit);
  await utils.nextTick();

  expect(api.post).toHaveBeenCalled();
  expect(api.post).toHaveBeenCalledWith(expect.any(String), creds);
});

// Helpers

function getErrors(container) {
  try {
    const errors = utils.getAllByTestId(container, 'error-msg');
    return errors.map(e => e.textContent).filter(e => e);
  } catch (err) {
    return [];
  }
}
