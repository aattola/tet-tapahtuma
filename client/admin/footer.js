import React from 'react'
import styled from 'styled-components'

const Appbar = styled.div`
  height: 37px;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  background-color: transparent;
`
const Logo = styled.img`
  height: 27px;
`
const Links = styled.div`
  display: flex;
  align-items: center;
`
const Dropdown = styled.a`
  padding: 8px 16px;
  position: relative;
  display: inline-block;
  font-family: Poppins;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
  color: black;
  border: 0;
  text-decoration: none;

  :hover {
    opacity: 1;

    &:after {
      content: ' ';
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 6px;
      height: 3px;
      background: black;
    }
  }
`

function Footer() {
  return (
    <Appbar>
      <Logo src="https://jeffe.co/images/jeffelogo.svg" alt="Logo" />
      <Links>
        <Dropdown href="https://jeffe.co">JEFFe</Dropdown>
      </Links>
    </Appbar>
  )
}

export default Footer
