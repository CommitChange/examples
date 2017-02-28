const R = require('ramda')
const h = require('flimflam/h')

const thermometer = percent =>
  h('div.progressBar.h2.bg-grey.pill', [
    h('span', {style: {width: percent + '%'}})
  ])

const HTML = `
<div class="progressBar">
  <span></span>
</div>
`

const CSS = `
.progressBar {
  width: 100%;
  display: block;
  overflow: hidden;
  border-radius: 1em;
  font-size: 2.5em;
  background: #d0d0d0;
}
.progressBar span {
  line-height: .5em;
  display: inline-block;
  width: 0%;
  background: #42b3df;
}
.progressBar > span:before {
  content: ".";
  visibility: hidden;
}
`

const JS = `
    var total_contributions = 
      response.amount_offsite + 
      response.amount_one_time + 
      response.amount_recurring
    var percent = Math.round(total_contributions / response.goal_amount * 100)
    document.querySelector('.progressBar span').style.width = percent + '%'
`

module.exports = data => {
  const total_contributions = data.amount_offsite + 
    data.amount_one_time + 
    data.amount_recurring
  const percent = Math.round(total_contributions / data.goal_amount * 100)
  return {
    widget: thermometer(percent)
  , HTML
  , CSS
  , JS
  }
}

