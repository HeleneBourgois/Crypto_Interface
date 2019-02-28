import React, { Component, Fragment } from 'react'
import './../styles/css/App.css'
import Listing from './Listing'

class App extends React.Component {
  render() {
    return (    
      <Fragment>
        <Listing/>
      </Fragment>
    )
  }
}

export default App