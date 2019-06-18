export default {
  get: jest.fn(Promise.resolve({ data: {}, meta: {} })),
  post: jest.fn(Promise.resolve({ data: {}, meta: {} }))
};
