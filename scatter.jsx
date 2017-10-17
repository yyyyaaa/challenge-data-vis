var React = require('React')
var linmap = require('linmap')
var jsonist = require('jsonist')
var createReactClass = require('create-react-class')
var Dot = require('./dot.jsx')
var Stats = require('./stats.jsx')

module.exports = createReactClass({
  getInitialState: function () {
    return {
      range: [],
      data: [],
      stats: {}
    }
  },

  componentDidMount: function () {
    var _this = this
    fetchDataset(this.props.dataset, function (data) {
      _this.setState({ data: data })
      _this.setState({ range: getRange(data) })
    })
  },

  showStats: function (stats) {
    this.setState({ stats: stats })
  },

  hideStats: function () {
    this.setState({ stats: {} })
  },

  render () {
    var range = this.state.range
    var scatterHeight = this.props.height
    var scatterWidth = this.props.width
    var scatterStyles = {
      width: scatterWidth,
      height: scatterHeight,
      position: 'relative',
      background: '#222',
      border: '1px solid #000',
      boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)'
    }

    var shouldShowStats = !isEmpty(this.state.stats)
    var _this = this

    return (
      <div className='scatter' style={scatterStyles}>
        { shouldShowStats &&
          <Stats {...this.state.stats} />
        }

        {
          this.state.data.map(function (row, index) {
            var dotStyles = stylesFromType(row.species)
            var coords = translateToCoords(row.petalLength,
                                            row.petalWidth,
                                            range,
                                            scatterHeight,
                                            scatterWidth)

            // Positioning based on mapped coords
            dotStyles['left'] = String(coords.x) + 'px'
            dotStyles['bottom'] = String(coords.y) + 'px'
            row['id'] = index

            return (
              <Dot
                key={index}
                style={dotStyles}
                showStats={_this.showStats}
                hideStats={_this.hideStats}
                data={row}
              />
            )
          })
        }
      </div>
    )
  }
})

function fetchDataset (url, cb) {
  var opts = {
    headers: { origin: 'http://localhost:9966/' },
    dataType: 'jsonp',
    mode: 'cors'
  }

  jsonist.get(url, opts, function (err, data, resp) {
    if (err) throw err
    cb(data)
  })
}

function translateToCoords (length, width, range, chartHeight, chartWidth) {
  var translatedX = linmap(range[2], range[3], 0, chartWidth, width)
  var translatedY = linmap(range[0], range[1], 0, chartHeight, length)
  return { x: translatedX, y: translatedY }
}

function getRange (rows) {
  var minLength = 10
  var maxLength = 0
  var minWidth = 10
  var maxWidth = 0

  if (!rows || rows.length === 0) return null

  rows.forEach(function (row) {
    var curLength = row.petalLength
    var curWidth = row.petalWidth

    if (curLength < minLength) {
      minLength = curLength
    }
    if (curLength > maxLength) {
      maxLength = curLength
    }
    if (curWidth < minWidth) {
      minWidth = curWidth
    }
    if (curWidth > maxWidth) {
      maxWidth = curWidth
    }
  })

  return [minLength, maxLength, minWidth, maxWidth]
}

function stylesFromType (irisClass) {
  var color

  switch (irisClass) {
    case 'setosa':
      color = '#ff7f0e'
      break
    case 'virginica':
      color = '#1f77b4'
      break
    case 'versicolor':
      color = '#2ca02c'
      break
    default:
      color = '#ff7f0e'
  }

  return {
    background: color,
    width: '10px',
    height: '10px',
    position: 'absolute',
    cursor: 'pointer',
    borderRadius: '5px'
  }
}

function isEmpty (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false
  }

  return JSON.stringify(obj) === JSON.stringify({})
}
