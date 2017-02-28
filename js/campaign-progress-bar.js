const R = require('ramda')
const h = require('flimflam/h')

const progressBarHorizontal = percent =>
  h('div.progressBar.progressBar-horizontal.h2.bg-grey.pill', [
    h('span', {style: {width: percent + '%'}})
  ])

const progressBarVertical = percent =>
  h('div.progressBar.progressBar-vertical.h2.bg-grey.pill', [
    h('span', {style: {height: percent + '%'}})
  ])

const HTML = `
<div class="progressBar progressBar-horizontal"><span></span></div>
<div class="progressBar progressBar-vertical"><span></span></div>
`

const CSS = `
.progressBar {
  display: block;
  overflow: hidden;
  border-radius: 1em;
  background: #d0d0d0;
}
.progressBar span {
  font-size: 2.5em;
  display: inline-block;
  background: #50a14f;
}

.progressBar-horizontal {
  line-height: .5em;
  width: 100%;
}
.progressBar-horiontal span {
  width: 0%;
}
.progressBar-horizontal > span:before {
  content: ".";
  visibility: hidden;
}

.progressBar-vertical {
  width: .5em;
  height: 400px;
  position: relative;
}
.progressBar-vertical  {
  position: absolute;
  bottom: 0;
  height: 0%;
}
`

const JS = `
    var total_contributions = 
      response.amount_offsite + 
      response.amount_one_time + 
      response.amount_recurring
    var percent = Math.round(total_contributions / response.goal_amount * 100)
    document.querySelector('.progressBar-horizontal span').style.width = percent + '%'
    document.querySelector('.progressBar-vertical span').style.height = percent + '%'
`

module.exports = data => {
  const total_contributions = data.amount_offsite + 
    data.amount_one_time + 
    data.amount_recurring
  const percent = Math.round(total_contributions / data.goal_amount * 100)
  return {
    widget: h('div', [
      h('label', 'Horizontal')
    , progressBarHorizontal(percent)
    , h('label.mt-4', 'Vertical')
    , progressBarVertical(percent)
    ])
  , HTML
  , CSS
  , JS
  }
}

