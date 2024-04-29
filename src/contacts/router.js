const {
  parseUrl,
  respondWith200OkJson,
  respondWith400BadRequest,
} = require('../httpHelpers');
const { fakeDatabase } = require('../database/fakeDatabase');
const { routerHandleResult } = require('../routerHandleResult');
const lodash = require('lodash');

function handle(request, response) {
  const parsedUrl = parseUrl(request);
  if (parsedUrl.pathname !== '/contacts') {
    return routerHandleResult.NO_URL_PATH_MATCH;
  }

  if (request.method !== 'GET') {
    return routerHandleResult.NO_HTTP_METHOD_MATCH;
  }

  const allContacts = fakeDatabase.selectAllFromContacts();
  let contactsCollection = lodash(allContacts).sortBy('name');

  const phrase = parsedUrl.query.phrase;

  if (typeof phrase !== 'undefined') {
    if (phrase === '') {
      respondWith400BadRequest(response);
      return routerHandleResult.HANDLED;
    }

    contactsCollection = contactsCollection.filter(x => x.name.toLowerCase().includes(phrase.toLowerCase()));
  }

  const limit = parsedUrl.query.limit;
  if (typeof limit !== 'undefined') {
    const regExp = /^(0|[1-9]\d*)$/;
    if (!regExp.test(limit)) {
      respondWith400BadRequest(response);
      return routerHandleResult.HANDLED;
    }

    contactsCollection = contactsCollection.take(limit);
  }


  const contacts = contactsCollection.value();
  respondWith200OkJson(response, contacts);
  return routerHandleResult.HANDLED;
}

module.exports = {
  handle,
};
