import React from 'react'
import styled from 'styled-components'
import Odometer from 'react-odometerjs'
import 'odometer/themes/odometer-theme-default.css'

const Wrapper = styled.div``

function connected({ users }) {
  return (
    <Wrapper>
      Sivulle yhdistyneet ihmiset: <Odometer value={users} format="ddd" />
    </Wrapper>
  )
}

export default connected
