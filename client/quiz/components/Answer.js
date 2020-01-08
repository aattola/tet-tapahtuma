import React from 'react'
import { SET_CURRENT_ANSWER, SET_ERROR } from '../reducers/types.js'
import styled from 'styled-components'

const Nappula = styled.button`
  position: relative;
  border-radius: 0.25em;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: rgba(0, 0, 0, 0.07);

  :hover {
    background: rgba(0, 0, 0, 0.17);
  }
`

function Answer(props) {
  const classes = ['answer']

  const handleClick = e => {
    props.dispatch({
      type: SET_CURRENT_ANSWER,
      currentAnswer: e.target.value
    })
    props.dispatch({ type: SET_ERROR, error: '' })
  }

  if (props.selected) {
    classes.push('selected')
  }
  return (
    <Nappula
      value={props.letter}
      className={classes.join(' ')}
      onClick={handleClick}>
      <span className="letter">{props.letter}.</span> {props.answer}
    </Nappula>
  )
}

export default Answer
