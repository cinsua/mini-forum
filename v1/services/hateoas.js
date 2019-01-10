
/*#################################################################
#         Fill the response with posible links                    #
#################################################################*/

const utils = require('../utils/utils')

module.exports = {

  addLinks: (result, paginationInfo, credentials, routes) => {
    let { bestRole, route, originalUrl } = credentials
    role = bestRole
    let pagination = undefined
    // should keep others query params
    urlWithoutQuery = originalUrl.split('?')[0]

    if (paginationInfo) {
      pagination = {
        totalPages: paginationInfo.totalPages,
        page: paginationInfo.page,
        totalDocs: paginationInfo.totalDocs,
        limit: paginationInfo.limit
      }
      pagination.links = []
      if (!utils.arraysEqual(result, [])) {
        pagination.links = [{
          type: 'GET', rel: 'first',
          href: `${urlWithoutQuery}?page=1&limit=${paginationInfo.limit}`
        },]
      }
      if (paginationInfo.hasPrevPage)
        pagination.links.push({
          type: 'GET', rel: 'prev',
          href: `${urlWithoutQuery}?page=${paginationInfo.prevPage}&limit=${paginationInfo.limit}`
        })
      if (paginationInfo.hasNextPage)
        pagination.links.push({
          type: 'GET', rel: 'next',
          href: `${urlWithoutQuery}?page=${paginationInfo.nextPage}&limit=${paginationInfo.limit}`
        })

      if (paginationInfo.totalPages > 1)
        pagination.links.push({
          type: 'GET', rel: 'last',
          href: `${urlWithoutQuery}?page=${paginationInfo.pages}&limit=${paginationInfo.limit}`
        })
    }

    data = { pagination, result }
    links = getChilds(role, route, originalUrl, routes)
    if (Array.isArray(links) && links.length) data.links = links
    return data
  }
}

function getChilds(role, route, originalUrl, routes) {

  // we standarize with / at the end of urls. and delete query params
  if (originalUrl.includes('?')) originalUrl = originalUrl.split('?')[0]
  if (!originalUrl.endsWith('/')) originalUrl += '/'
  if (!route.endsWith('/')) route += '/'

  // map all child routes that not have ':' after the route provided:
  // not having ':' means that is not a specific resourse
  childRoutes = Object.keys(routes)
    .filter((r) => (r !== route && r.startsWith(route) && !r.split(route)[1].includes(':')))
    .map((r) => (r.split(route)[1]))

  links = []

  // nested sh*t ... we should refactor
  for (r of childRoutes) {
    for (method of Object.keys(routes[route + r])) {
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