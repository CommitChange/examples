const R = require('ramda')
const h = require('flimflam/h')

const thermometer = percent =>
  h('div.progressBar.h2.bg-grey.pill', [
    h('span', {style: {width: percent + '%'}})
  ])

module.exports = data => {
  const total_contributions = data.amount_offsite + 
    data.amount_one_time + 
    data.amount_recurring
  const percent = Math.round(total_contributions / data.goal_amount * 100)
  return thermometer(percent)
}

