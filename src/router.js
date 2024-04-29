const {
  respondWith404NotFound,
  respondWith405MethodNotAllowed,
} = require('./httpHelpers');
const { routerHandleResult } = require('./routerHandleResult');

const routers = [
  require('./ping').pingRouter,
  require('./contacts').contactsRouter,
  require('./contactDetails').contactDetailsRouter,
];

module.exports = function(request, response) {
  let hasMethodNotAllowedResult = false;
  for (const router of routers) {
    const result = router.handle(request, response);
    if (result === routerHandleResult.HANDLED) {
      return;
    } else if (result === routerHandleResult.NO_HTTP_METHOD_MATCH) {
      hasMethodNotAllowedResult = true;
    }
  }

  if (hasMethodNotAllowedResult) {
    respondWith405MethodNotAllowed(response);
  } else {
    respondWith404NotFound(response);
  }
};
