import React from 'react';
import Radium from 'radium';
import { Link } from 'react-router';

const accentColor = '#00DFFF';

var styles = {
  navBar: {
    color: 'white',
  }
}

@Radium
export default class Navbar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  handleClick = (path) => {
    this.context.router.transitionTo(path);
  };

  render() {
    return (
      <nav className="navbar navbar-fixed-top" style={styles.navBar}>
        <div className="container-fluid">
          <div className="navbar-header">
            <div onClick={this.handleClick.bind(this, '/home')} style={styles.brand} className="navbar-brand">
              <h4><span className="fa fa-home"/> roomies</h4>
            </div>
          </div>
        </div>
      </nav>
    )
  };
}

var styles = {
  brand: {
    color: 'white',
    ':hover': {
      color: accentColor,
      cursor: 'pointer'
    }
  },

  debug: {
    position: 'fixed',
    top: 0,
  }
}

Navbar.contextTypes = {
  router: React.PropTypes.object.isRequired
};