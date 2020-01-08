import React, { useContext } from 'react'
import Answer from './Answer'
import AnswerTyped from './AnswerTyped'
import QuizContext from '../context/QuizContext'
import styled from 'styled-components'
import Markdown from 'react-markdown/with-html'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 1fr);
  }
`

function Answers() {
  const { state, dispatch } = useContext(QuizContext)
  const { currentAnswer, currentQuestion, questions } = state
  const question = questions[currentQuestion]
  return (
    <div>
      {question ? (
        <div>
          {question.typed ? (
            <Grid>
              {question.answers.map((answer, index) => (
                <AnswerTyped
                  key={index}
                  question={question}
                  letter={index + 1}
                  answer={answer}
                  dispatch={dispatch}
                  selected={currentAnswer == index + 1}
                />
              ))}
            </Grid>
          ) : question.custom ? (
            <div style={{ marginTop: 25 }} className="markdown-body">
              <Markdown
                escapeHtml={false}
                skipHtml={false}
                source={question.custom}
              />
            </div>
          ) : (
            <Grid>
              {question.answers.map((answer, index) => (
                <Answer
                  key={index}
                  letter={index + 1}
                  answer={answer}
                  dispatch={dispatch}
                  selected={currentAnswer == index + 1}
                />
              ))}
            </Grid>
          )}
        </div>
      ) : (
        <h1>Lisää niitä kysymyksiä</h1>
      )}
    </div>
  )
}

export default Answers
