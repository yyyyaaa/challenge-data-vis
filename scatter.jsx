var React = require('React')
var linmap = require('linmap')
var jsonist = require('jsonist')
var createReactClass = require('create-react-class')

var Dot = createReactClass({
  handleMouseEnter: function() {
    var statsData = this.props.data;
    this.props.showStats(statsData);
  },

  handleMouseLeave: function() {
    this.props.hideStats();
  },

  render() {
    return (
      <div className="dot" 
            style={this.props.style} 
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
      />
    );
  }
});

var Stats = function(props) {
  var statsStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    display: props.show ? 'block' : 'none',
  };

  var textStyle = {
    color: '#fff',
    fontSize: "12px",
  }

  return (
    <div className="stats" >
      <p style={textStyle}>ID: {props.id}</p>
      <p style={textStyle}>Species: {props.species}</p>
      <p style={textStyle}>PetalWidth: {props.petalWidth}</p>
      <p style={textStyle}>PetalLength: {props.petalLength}</p>
      <p style={textStyle}>SepalWidth: {props.sepalWidth}</p>
      <p style={textStyle}>SepalLength: {props.sepalLength}</p>
    </div>
  );
}

module.exports = createReactClass({
  getInitialState: function() {
    return {
      range: [],
      data: [],
      stats: {},
    }
  },

  componentDidMount: function() {
    var _this = this;
    fetchDataset(this.props.dataset, function(data) {
      _this.setState({ data: data });
      _this.setState({ range: getRange(data) });
    });
  },

  showStats: function(stats) {
    this.setState({ stats: stats });
  },

  hideStats: function() {
    this.setState({ stats: {} });
  },

  render () {
    var range = this.state.range;
    var scatterHeight = this.props.height;
    var scatterWidth = this.props.height;
    var scatterStyles = {
      width: scatterWidth,
      height: scatterHeight,
      position: 'relative',
    };

    var shouldShowStats = !isEmpty(this.state.stats);
    var _this = this;

    return (
      <div className="scatter" style={scatterStyles}>
        { shouldShowStats && 
          <Stats {...this.state.stats} />
        }

        { 
          this.state.data.map(function(row, index){
            var dotStyles = stylesFromType(row.species);
            var coords = translateToCoords( row.petalLength, 
                                            row.petalWidth, 
                                            range,
                                            scatterHeight,
                                            scatterWidth );
            dotStyles['left'] = String(coords.x) + "px";
            dotStyles['bottom'] = String(coords.y) + "px";
            return (
              <Dot  
                key={index} 
                style={dotStyles} 
                showStats={_this.showStats}
                hideStats={_this.hideStats}
                data={row}
              />
            );
          })
        }
      </div>
    );
  }
});

function fetchDataset(url, cb) {
  var opts = { 
    headers: { origin: 'http://localhost:9966/' },
    dataType: 'jsonp',
    mode: 'cors',
  };

  jsonist.get(url, opts, function(err, data, resp) {
    if(err) throw err;
    cb(data);
  });
}

function translateToCoords(length, width, range, chartHeight, chartWidth){
  var translatedX = linmap(range[2], range[3], 0, chartWidth, width);
  var translatedY = linmap(range[0], range[1], 0, chartHeight, length);
  return { x: translatedX, y: translatedY };
}

function getRange(rows) {
  var minLength = 10,  
      maxLength = 0, 
      minWidth = 10, 
      maxWidth = 0;

  if(!rows || rows.length === 0) {
    return null;
  }

  rows.forEach(function(row) {
    var curLength = row.petalLength;
    var curWidth = row.petalWidth;

    if(curLength < minLength) { 
      minLength = curLength; 
    }
    if(curLength > maxLength) { 
      maxLength = curLength; 
    }
    if(curWidth < minWidth) { 
      minWidth = curWidth; 
    }
    if(curWidth > maxWidth) { 
      maxWidth = curWidth; 
    }   
  });

  return [minLength, maxLength, minWidth, maxWidth];
}

function stylesFromType(irisClass) {
  var color;

  switch(irisClass) {
    case "setosa":
      color = "#ff7f0e";
      break;
    case "virginica":
      color = "#1f77b4";
      break;
    case "versicolor":
      color = "#2ca02c";
      break;
    default:
      color = "#ff7f0e";
  }

  return {
    background: color,
    width: '10px',
    height: '10px',
    position: 'absolute',
    cursor: 'pointer',
    borderRadius: '5px',
  };
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) return false;
  }

  return JSON.stringify(obj) === JSON.stringify({});
}