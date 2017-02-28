module.exports = (path, content) => `var xhr = new XMLHttpRequest()
xhr.open("GET", "${path}")
xhr.send(null)
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var response = JSON.parse(xhr.response)
    ${content}
  }
}
`

