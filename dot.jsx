var React = require('React')
var createReactClass = require('create-react-class')

module.exports = createReactClass({
  getInitialState: function() {
    return { isHovered: false };
  },

  handleMouseEnter: function() {
    var statsData = this.props.data;
    this.props.showStats(statsData);
    this.setState({ isHovered: true });
  },

  handleMouseLeave: function() {
    this.props.hideStats();
    this.setState({ isHovered: false });
  },

  render() {
    var dotStyles = this.props.style;
    if(this.state.isHovered) {
      dotStyles['border'] = "1px solid #fff";
    } else {
      dotStyles['border'] = "none";
    }

    return (
      <div className="dot" 
            style={dotStyles} 
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
      />
    );
  }
});