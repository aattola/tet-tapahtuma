import React from 'react'
import styled from 'styled-components'
import Odometer from 'react-odometerjs'
import 'odometer/themes/odometer-theme-default.css'

const Wrapper = styled.div``

function cpuChart({ processData }) {
  const cpu = processData.cpuUsage * 100

  return (
    <Wrapper>
      Serverin prosessori(%) <Odometer value={cpu} format="(.ddd),dd" />
    </Wrapper>
  )
}

export default cpuChart
