export default (controller_func) => (req, res, next) => {
  return Promise.resolve(controller_func(req, res, next)).catch(next);
};
