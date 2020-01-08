import React, { useState } from 'react'
import styled from 'styled-components'
import Odometer from 'react-odometerjs'
import 'odometer/themes/odometer-theme-default.css'

const Wrapper = styled.div``

function RamChart({ processData }) {
  const [critical, setCritical] = useState(false)
  const ram = processData.freeMemory * 100
  if (!critical) {
    if (ram < 8) {
      setCritical(true)
    }
  } else {
    if (ram > 8) {
      setCritical(false)
    }
  }
  return (
    <Wrapper>
      {critical ? (
        <div>
          Ram muistia jäljellä(%){' '}
          <span style={{ color: 'red' }}>
            <Odometer value={ram} format="(,ddd),dd" />
          </span>
        </div>
      ) : (
        <div>
          Ram muistia jäljellä(%) <Odometer value={ram} format="(,ddd),dd" />
        </div>
      )}
    </Wrapper>
  )
}

export default RamChart
