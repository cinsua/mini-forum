
const { routes } = require('../routes/registeredRoutes')

/*#################################################################
#         Fill the response with posible links                    #
#################################################################*/

module.exports = {

  addLinks: (result, pagination, role, route, originalUrl) => {
    data = { pagination, result }
    links = getChilds(role, route, originalUrl)
    if (Array.isArray(links) && links.length) data.links = links
    return data
  }
}

function getChilds(role, route, originalUrl) {
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