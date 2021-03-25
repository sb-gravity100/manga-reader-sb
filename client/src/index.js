import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './main/App'
import './stylesheets/index.scss'
import Footer from './main/Footer'

ReactDOM.render(
  <Router>
    <App />
    <Footer />
  </Router>,
   document.querySelector('#container'),
)
