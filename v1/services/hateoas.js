
/*#################################################################
#         Fill the response with posible links                    #
#################################################################*/

const utils = require('../utils/utils')

function getChilds(role, route, originalUrl, routes) {

  // we standarize with / at the end of urls. and delete query params
  if (originalUrl.includes('?')) originalUrl = originalUrl.split('?')[0]
  if (!originalUrl.endsWith('/')) originalUrl += '/'
  if (!route.endsWith('/')) route += '/'

  // map all child routes that not have ':' after the route provided:
  // not having ':' means that is not a specific resourse
  let childRoutes = Object.keys(routes)
    .filter((r) => (r !== route && r.startsWith(route) && !r.split(route)[1].includes(':')))
    .map((r) => (r.split(route)[1]))

  let links = []

  // nested sh*t ... we should refactor
  for (let r of childRoutes) {
    for (let method of Object.keys(routes[route + r])) {
      if (routes[route + r][method].roleRequired.includes(role)) {
        links.push({
          type: method,
          rel: routes[route + r][method].description,
          href: originalUrl + r
        })
      }
    }
  }

  return links

}

function getPaginationLinks(paginationInfo, result, originalUrl) {
  let urlWithoutQuery = originalUrl.split('?')[0]

  let pagination = {
    totalPages: paginationInfo.totalPages,
    page: paginationInfo.page,
    totalDocs: paginationInfo.totalDocs,
    limit: paginationInfo.limit
  }

  pagination.links = []

  if (!utils.arraysEqual(result, [])) {
    let first = {
      type: 'GET', rel: 'first',
      href: `${urlWithoutQuery}?page=1&limit=${paginationInfo.limit}`
    }
    pagination.links = [first]
  }

  if (paginationInfo.hasPrevPage) {
    let prev = {
      type: 'GET', rel: 'prev',
      href: `${urlWithoutQuery}?page=${paginationInfo.prevPage}&limit=${paginationInfo.limit}`
    }
    pagination.links.push(prev)
  }

  if (paginationInfo.hasNextPage) {
    let next = {
      type: 'GET', rel: 'next',
      href: `${urlWithoutQuery}?page=${paginationInfo.nextPage}&limit=${paginationInfo.limit}`
    }
    pagination.links.push(next)
  }

  if (paginationInfo.totalPages > 1) {
    let last = {
      type: 'GET', rel: 'last',
      href: `${urlWithoutQuery}?page=${paginationInfo.totalPages}&limit=${paginationInfo.limit}`
    }
    pagination.links.push(last)
  }
  return pagination
}

module.exports = {

  addLinks(result, credentials, routes, { paginationInfo } = {}) {
    let { bestRole, route, originalUrl } = credentials
    let role = bestRole
    result = utils.cleanResult(result)
    let data = { result }
    let links = getChilds(role, route, originalUrl, routes)
    if (Array.isArray(links) && links.length) data.links = links

    if (!paginationInfo)
      return data

    data.pagination = getPaginationLinks(paginationInfo, result, originalUrl)
    return data
  }
}