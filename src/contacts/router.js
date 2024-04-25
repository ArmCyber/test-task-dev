const {
  urlPathOf,
  respondWith200OkJson,
} = require('../httpHelpers');
const { fakeDatabase } = require('../database/fakeDatabase');
const { routerHandleResult } = require('../routerHandleResult');

function handle(request, response) {
  const contacts = fakeDatabase.selectAllFromContacts();
  respondWith200OkJson(response, contacts);
  return routerHandleResult.HANDLED;
}

module.exports = {
  handle,
};
