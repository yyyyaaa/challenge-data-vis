var React = require('React')

module.exports = function (props) {
  var textStyle = {
    color: '#fff',
    fontSize: '12px'
  }

  return (
    <div className='stats' >
      <p style={textStyle}>ID: {props.id}</p>
      <p style={textStyle}>Species: {props.species}</p>
      <p style={textStyle}>PetalWidth: {props.petalWidth}</p>
      <p style={textStyle}>PetalLength: {props.petalLength}</p>
      <p style={textStyle}>SepalWidth: {props.sepalWidth}</p>
      <p style={textStyle}>SepalLength: {props.sepalLength}</p>
    </div>
  )
}
