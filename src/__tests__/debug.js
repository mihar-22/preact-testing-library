import '@testing-library/jest-dom/extend-expect';

import { h } from 'preact';

import { render } from '..';

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
});

test('debug pretty prints the container', () => {
  const HelloWorld = () => (<h1>Hello World</h1>);

  const { debug } = render(<HelloWorld />);

  debug();

  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Hello World'));
});
