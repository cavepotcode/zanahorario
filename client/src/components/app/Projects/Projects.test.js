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
  const { container } = utils.render(<Projects />);

  expect(api.get).toHaveBeenCalled();
  expect(api.get).toHaveBeenCalledWith(expect.any(String));
});
