const R = require('ramda')
const h = require('flimflam/h')
const ajax = require('flyd-ajax')
const flyd = require('flimflam/flyd')
const render = require('flimflam/render')
const hljs = require('highlight.js')

const progressBar = require('./js/campaign-progress-bar')
const code = require('./js/code')
const xhrTemplate = require('./js/xhr-template')

const get = (path, query) => {
  const url = 'http://api.commitchange.com/'
  const response$ = ajax({method: 'GET', url, path, query}).load
  flyd.map(x => console.log(x), response$)
  return flyd.filter(x => x.status === 200, response$)
}

const init = () => {
  const campaignMetrics$ = get('campaigns/metrics', {id: 1483})
  return {
    campaignMetrics$
  }
}

const sections = {
  'Campaign Progress Bar': { 
    data: 'campaignMetrics$'
  , view: progressBar
  }
}

const sectionKeys = R.keys(sections)

const hyphenate = st => st.replace(/\s/g, "-")

const responseData = data => 
  h('div', [
      code('Request URL', data.responseURL)
    , code('Response Data', JSON.stringify(data.body, null, 2), 'JSON')
  ])

const section = state => name => {
  const sectionObj = sections[name]
  const data$ = state[sectionObj.data]
  return h('section.px-2.pt-3.pb-2.mb-4.sh-1', {props: {id: hyphenate(name)}}, [
    h('h3.mt-0.mb-3', name)
  , data$() 
      ? h('div', [
          h('div.mb-3', [sectionObj.view(data$().body).widget])
        , responseData(data$())
        , code('HTML', sectionObj.view(data$().body).HTML.trim())
        , code('CSS', sectionObj.view(data$().body).CSS.trim(), 'CSS')
        , code('JS', xhrTemplate(
            data$().responseURL
          , sectionObj.view(data$().body).JS.trim())
          , 'Javascript')
        ])
      : 'Loading...'
  ])
}

const nav = st => h('li', [h('a', {props: {href: `#${hyphenate(st)}`}}, st)])

const view = state => 
  h('div', [
    h('ul.mb-4', R.map(nav, sectionKeys))
  , h('div', R.map(section(state), sectionKeys))
  ])

const container = document.querySelector('#ff-render')

render(view, init(), container)

