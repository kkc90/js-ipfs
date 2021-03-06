'use strict'

const CID = require('cids')
const toCamelWithMetadata = require('../lib/object-to-camel-with-metadata')
const configure = require('../lib/configure')
const toUrlSearchParams = require('../lib/to-url-search-params')

module.exports = configure(api => {
  return async (path, options = {}) => {
    if (typeof path !== 'string') {
      options = path || {}
      path = '/'
    }

    const res = await api.post('files/stat', {
      timeout: options.timeout,
      signal: options.signal,
      searchParams: toUrlSearchParams(path, options)
    })
    const data = await res.json()

    data.WithLocality = data.WithLocality || false
    return toCoreInterface(toCamelWithMetadata(data))
  }
})

function toCoreInterface (entry) {
  entry.cid = new CID(entry.hash)
  delete entry.hash
  return entry
}
