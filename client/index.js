import React from 'react'
import ReactDOM from 'react-dom'
import Lobby from './lobby'

import io from 'socket.io-client'

const socket = io()
window.socket = socket

socket.on('event', function(data) {
  console.log(data)
})

socket.on('connect', () => {
  console.log('CONNECTED')
})
socket.on('disconnect', function() {
  console.log('DISCONNECTED')
})

ReactDOM.render(<Lobby />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept(function() {
    setTimeout(function() {
      location.reload()
    }, 350)
  })
}
