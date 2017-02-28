const h = require('flimflam/h')
const hljs = require('highlight.js')

const highlight = vnode => hljs.highlightBlock(vnode.elm)

module.exports = (label, code, type='html') => 
  h('div', [
      h('h5', label) 
    , h('pre', [h(`code.${type}`, {hook: {insert: highlight}}, code)])
  ])

