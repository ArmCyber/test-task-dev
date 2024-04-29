const { routerHandleResult } = require('../routerHandleResult');
const {
  urlPathOf,
  respondWith404NotFound,
  respondWith200OkJson,
  respondWith204NoContent,
} = require('../httpHelpers');
const trimStart = require('lodash/trimStart');
const { fakeDatabase } = require('../database/fakeDatabase');

function getContact(response, contact) {
  return respondWith200OkJson(response, contact);
}

function deleteContact(response, contact) {
  fakeDatabase.deleteContactsById(contact.id);
  respondWith204NoContent(response);
}

function handle(request, response) {
  const urlPath = urlPathOf(request);
  const urlSegments = trimStart(urlPath, '/').split('/');
  if (urlSegments.length !== 2 || urlSegments[0] !== 'contacts') {
    return routerHandleResult.NO_URL_PATH_MATCH;
  }

  const handlers = {
    GET: getContact,
    DELETE: deleteContact,
  };

  if (!handlers.hasOwnProperty(request.method)) {
    return routerHandleResult.NO_HTTP_METHOD_MATCH;
  }

  const [contact] = fakeDatabase.selectFromContactsById(urlSegments[1]);
  if (typeof contact === 'undefined') {
    respondWith404NotFound(response);
    return routerHandleResult.HANDLED;
  }

  handlers[request.method](response, contact);

  return routerHandleResult.HANDLED;
}

module.exports = {
  handle,
};
