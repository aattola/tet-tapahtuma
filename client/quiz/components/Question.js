import React, { useContext } from 'react'
import QuizContext from '../context/QuizContext'
import styled from 'styled-components'

const Stats = styled.div`
  display: flex;
  place-content: space-between;
`
const Text = styled.h1`
  font-family: Poppins;
  font-size: 1.4em;
`
const TextH2 = styled.h2`
  font-family: Poppins;
  font-weight: 700;
  font-size: 1.6em;
`

function Question({ user }) {
  const { state } = useContext(QuizContext)
  const { currentQuestion, questions } = state
  const question = questions[currentQuestion]
  return (
    <div>
      {question ? (
        <div>
          <Stats>
            <TextH2>{question.luokka}</TextH2>
            <TextH2>
              Kysymys {currentQuestion + 1} / {questions.length}
            </TextH2>
          </Stats>
          <Text>{question.question}</Text>
        </div>
      ) : (
        <h1>Ei kysymyksii toisisanotusti rikki</h1>
      )}
    </div>
  )
}

export default Question
