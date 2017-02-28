var R = require('ramda');
var h = require('flimflam/h');
var ajax = require('flyd-ajax');
var flyd = require('flimflam/flyd');
var render = require('flimflam/render');
var hljs = require('highlight.js');

var progressBar = require('./js/campaign-progress-bar');
var code = require('./js/code');
var xhrTemplate = require('./js/xhr-template');

var get = function (path, query) {
  var url = 'http://api.commitchange.com/';
  var response$ = ajax({ method: 'GET', url: url, path: path, query: query }).load;
  flyd.map(function (x) {
    return console.log(x);
  }, response$);
  return flyd.filter(function (x) {
    return x.status === 200;
  }, response$);
};

var init = function () {
  var campaignMetrics$ = get('campaigns/metrics', { id: 1483 });
  return {
    campaignMetrics$: campaignMetrics$
  };
};

var sections = {
  'Campaign Progress Bar': {
    data: 'campaignMetrics$',
    view: progressBar
  }
};

var sectionKeys = R.keys(sections);

var hyphenate = function (st) {
  return st.replace(/\s/g, "-");
};

var responseData = function (data) {
  return h('div', [code('Request URL', data.responseURL), code('Response Data', JSON.stringify(data.body, null, 2), 'JSON')]);
};

var section = function (state) {
  return function (name) {
    var sectionObj = sections[name];
    var data$ = state[sectionObj.data];
    return h('section.px-2.pt-3.pb-2.mb-4.sh-1', { props: { id: hyphenate(name) } }, [h('h3.mt-0.mb-3', name), data$() ? h('div', [h('div.mb-3', [sectionObj.view(data$().body).widget]), responseData(data$()), code('HTML', sectionObj.view(data$().body).HTML.trim()), code('CSS', sectionObj.view(data$().body).CSS.trim(), 'CSS'), code('JS', xhrTemplate(data$().responseURL, sectionObj.view(data$().body).JS.trim()), 'Javascript')]) : 'Loading...']);
  };
};

var nav = function (st) {
  return h('li', [h('a', { props: { href: '#' + hyphenate(st) } }, st)]);
};

var view = function (state) {
  return h('div', [h('ul.mb-4', R.map(nav, sectionKeys)), h('div', R.map(section(state), sectionKeys))]);
};

var container = document.querySelector('#ff-render');

render(view, init(), container);
