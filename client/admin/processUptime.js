import React from 'react'
import styled from 'styled-components'
import Odometer from 'react-odometerjs'
import 'odometer/themes/odometer-theme-default.css'

const Wrapper = styled.div``

function HHMMSS(sec) {
  const secNum = parseInt(sec, 10) // don't forget the second param
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - hours * 3600) / 60)
  let seconds = secNum - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return {
    time: hours + minutes + seconds,
    hours,
    minutes,
    seconds
  }
}

function ProcessUptime({ processData }) {
  const uptime = HHMMSS(Math.floor(processData.processUptime))

  return (
    <Wrapper>
      Numeroita:{' '}
      <Odometer duration={2300} value={uptime.time} format="dd.dd.dd" />
    </Wrapper>
  )
}

export default ProcessUptime
