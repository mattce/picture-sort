import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'

import App from './App'

const elementId = 'root'

Modal.setAppElement(`#${elementId}`)

ReactDOM.render(<App />, document.getElementById(elementId))
