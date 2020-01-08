import React, { useState, useEffect } from 'react'
import { SET_CURRENT_ANSWER } from '../reducers/types.js'
import TextField from '@material-ui/core/TextField'

function AnswerTyped(props) {
  const [text, setText] = useState('')
  const classes = ['answer']

  if (props.selected) {
    classes.push('selected')
  }

  useEffect(() => {
    return () => {
      setText('')
    }
  }, [])

  window.clearInput = () => {
    setText('')
  }

  return (
    <TextField
      value={text}
      onChange={e => {
        props.dispatch({
          type: SET_CURRENT_ANSWER,
          currentAnswer: e.target.value
        })
        setText(e.target.value)
      }}
      label={props.question.moreInfo}
      style={{ margin: 8 }}
      autoFocus
    />
  )
}

export default AnswerTyped
