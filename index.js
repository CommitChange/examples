const R = require('ramda')
const h = require('flimflam/h')
const ajax = require('flyd-ajax')
const flyd = require('flimflam/flyd')
const render = require('flimflam/render')
const thermometer = require('./js/campaign-thermometer')

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
  'Campaign Thermometer': { 
    stateKey: 'campaignMetrics$'
  , view: thermometer 
  }
}

const sectionKeys = R.keys(sections)

const hyphenate = st => st.replace(' ', '-')

const responseData = data => 
  h('div', [
      h('h5', 'Request URL') 
    , h('pre.mb-3', data.responseURL)
    , h('h5', 'Response Data') 
    , h('pre.mb-3', JSON.stringify(data.body, null, 2))
  ])

const section = state => name => {
  const sectionObj = sections[name]
  const data$ = state[sectionObj.stateKey]
  return h('section.px-2.pt-3.pb-4.mb-4.sh-1', {props: {id: hyphenate(name)}}, [
    h('h3.mt-0.mb-3', name)
  , data$() 
      ? h('div', [
          responseData(data$())
        , sectionObj.view(data$().body) 
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

