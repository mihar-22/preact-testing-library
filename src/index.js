import { act, cleanup } from './pure';

// If we're running in a test runner that supports afterEach
// then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other
// if you don't like this then either import the `pure` module
// or set the PTL_SKIP_AUTO_CLEANUP env variable to 'true'.
if (typeof afterEach === 'function' && !process.env.PTL_SKIP_AUTO_CLEANUP) {
  afterEach(() => {
    act(() => {});
    cleanup();
  });
}

export * from './pure';
