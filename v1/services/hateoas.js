
//const { routes } = require('../routes/registeredRoutes')

/*#################################################################
#         Fill the response with posible links                    #
#################################################################*/

module.exports = {

  addLinks: (result, paginationInfo, role, route, originalUrl, routes) => {
    let pagination = undefined
    // should keep others query params
    urlWithoutQuery = originalUrl.split('?')[0]

    console.log(route)
    if (paginationInfo) {
      pagination = {
        pages: paginationInfo.pages,
        page: paginationInfo.page,
        total: paginationInfo.total,
        limit: paginationInfo.limit
      }
      pagination.links = [{
        type: 'GET', rel: 'first',
        href: `${urlWithoutQuery}?page=1&limit=${paginationInfo.limit}`
      },]

      if (paginationInfo.page > 1)
        pagination.links.push({
          type: 'GET', rel: 'prev',
          href: `${urlWithoutQuery}?page=${paginationInfo.page - 1}&limit=${paginationInfo.limit}`
        })
      if (paginationInfo.page < paginationInfo.pages)
        pagination.links.push({
          type: 'GET', rel: 'next',
          href: `${urlWithoutQuery}?page=${paginationInfo.page + 1}&limit=${paginationInfo.limit}`
        })
      
      if (paginationInfo.pages > 1)
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
  // map all child routes that not have ':' after the route provided:
  // not having ':' means that is not a specific resourse

  childRoutes = Object.keys(routes)
    .filter((r) => (r !== route && r.startsWith(route) && !r.split(route)[1].includes(':')))
    .map((r) => (r.split(route)[1]))
  console.log('childRoutes :', childRoutes);

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