export default function getQueryParams(url) {
  var params = {}
  var parser = document.createElement('a')
  parser.href = url
  var query = parser.search.substring(1)
  var vars = query.split('&amp;')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    params[pair[0]] = decodeURIComponent(pair[1])
  }
  return params
}
