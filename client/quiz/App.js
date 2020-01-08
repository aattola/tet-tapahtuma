import React, { useReducer, useEffect, useState } from 'react'
import Progress from './components/Progress'
import Question from './components/Question'
import Answers from './components/Answers'
import QuizContext from './context/QuizContext'
import { useStopwatch } from 'react-timer-hook'
import styled from 'styled-components'
import './index.css'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import {
  SET_ANSWERS,
  SET_CURRENT_QUESTION,
  SET_CURRENT_ANSWER,
  SET_ERROR,
  SET_SHOW_RESULTS,
  RESET_QUIZ
} from './reducers/types.js'
import quizReducer from './reducers/QuizReducer'

import './App.css'

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 1fr);
    margin-left: 10px;
    margin-right: 10px;
  }
`
const Hero = styled.div`
  display: block;
  margin: 0 auto;
  padding: 30px 40px;
  word-break: break-all;

  @media (max-width: 600px) {
    padding: 10px 15px;
  }
`
const Card = styled.div`
  background: white;
  box-shadow: 0px 4px 4px rgba(16, 16, 16, 0.15);
  border-radius: 8px;
  padding: 20px 30px;
  position: relative;

  :before {
    content: ' ';
    height: 100%;
    width: 5px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${props => (!props.fail ? '#f74843' : '#7ef27c')};
    border-radius: 8px 0px 0px 8px;
  }
`
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
    time: hours + ':' + minutes + ':' + seconds,
    hours,
    minutes,
    seconds
  }
}

function App(props) {
  const questions = props.questions
  const rankaisu = props.rankaisu

  const initialState = {
    questions,
    currentQuestion: 0,
    currentAnswer: '',
    answers: [],
    showResults: false,
    error: ''
  }

  const [leaderboard, setLeaderboard] = useState([])
  const [totalTime, setTime] = useState(0)
  const { seconds, minutes, pause } = useStopwatch({ autoStart: true })
  const [state, dispatch] = useReducer(quizReducer, initialState)
  const { currentQuestion, currentAnswer, answers, showResults, error } = state

  const question = questions[currentQuestion]

  useEffect(() => {
    window.clearInput = () => {
      return true
    }
    if (props.user.id) {
      window.socket.emit(
        'process',
        props.user.id,
        0,
        window.devtools.isOpen,
        () => {
          console.log('start registered')
        }
      )
    }
  }, [props.user.id])

  const renderError = () => {
    if (!error) {
      return <div />
    }

    return <div className="error">{error}</div>
  }

  const renderResultMark = correct => {
    if (correct) {
      return <span className="correct">Oikein</span>
    }

    return <span className="failed">Väärin +{rankaisu}</span>
  }

  const renderResultsData = () => {
    return answers.map(answer => {
      const question = questions.find(
        question => question.id == answer.questionId
      )

      if (question.typed) {
        const correct =
          question.answers[0].toLowerCase() == answer.answer.toLowerCase()
        return (
          <Card fail={correct} key={question.id}>
            {question.question} - {renderResultMark(correct)}
          </Card>
        )
      } else {
        const correct = question.correctAnswer == answer.answer

        return (
          <Card fail={correct} key={question.id}>
            {question.question} - {renderResultMark(correct)}
          </Card>
        )
      }
    })
  }

  const checkCorrect = () => {
    return answers.map(answer => {
      const question = questions.find(
        question => question.id == answer.questionId
      )

      if (question.typed) {
        const correct =
          question.answers[0].toLowerCase() == answer.answer.toLowerCase()
        return correct
      } else {
        const correct = question.correctAnswer == answer.answer

        return correct
      }
    })
  }

  const next = () => {
    const wrong = checkCorrect().filter(d => {
      if (d !== true) {
        return true
      }
    }).length

    const wrongTime = wrong * rankaisu
    setTime(60 * minutes + seconds + wrongTime)
    const answer = { questionId: question.id, answer: currentAnswer }

    if (!currentAnswer && !question.custom) {
      dispatch({ type: SET_ERROR, error: 'Tee ny jotai edes' })
      return
    }

    if (!question.custom) {
      answers.push(answer)
      dispatch({ type: SET_ANSWERS, answers })
      dispatch({ type: SET_CURRENT_ANSWER, currentAnswer: '' })
    }

    if (currentQuestion + 1 < questions.length) {
      const ye = currentQuestion + 1
      window.socket.emit(
        'process',
        props.user.id,
        ye,
        window.devtools.isOpen,
        60 * minutes + seconds + wrongTime,
        () => {
          dispatch({
            type: SET_CURRENT_QUESTION,
            currentQuestion: ye
          })
        }
      )
      window.clearInput()
      dispatch({ type: SET_ERROR, error: '' })
      return
    }

    // kaikkiin vastattu
    // kaikkiin vastattu
    // kaikkiin vastattu

    const ye = currentQuestion + 1
    window.socket.emit(
      'process',
      props.user.id,
      ye,
      window.devtools.isOpen,
      60 * minutes + seconds + wrongTime,
      () => {}
    )
    fetch(
      `/data?id=${props.user.id}&name=${props.user.username}&time=${60 *
        minutes +
        seconds +
        wrongTime}`
    )
      .then(data => data.json())
      .then(data => {
        setLeaderboard(data.leaderboards)
        dispatch({ type: SET_SHOW_RESULTS, showResults: true })
        pause()
      })
  }

  const sija = leaderboard
    .sort((a, b) => a.time - b.time)
    .map((data, i) => {
      if (data.id == props.user.id) {
        return i
      }
    })
    .filter(data => {
      if (data) {
        return data
      }
    })

  const filtList = leaderboard
    .sort((a, b) => a.time - b.time)
    .map((data, i) => {
      if (i > 4) return

      return (
        <TableRow key={i}>
          <TableCell component="th" scope="row">
            {data.name}
          </TableCell>
          <TableCell>{HHMMSS(data.time).time}</TableCell>
        </TableRow>
      )
    })

  console.log(sija)

  if (showResults) {
    return (
      <div className="container results">
        <center>
          <Hero>
            <h1 style={{ fontSize: 55, fontWeight: '700' }}>
              {props.user.username}
            </h1>
            <h2 style={{ fontSize: 33 }}>
              Selvisit ajassa {HHMMSS(totalTime).time}
            </h2>
            Olit{' '}
            {
              leaderboard.filter(data => {
                return data.time > totalTime
              }).length
            }{' '}
            ihmistä nopeampi. Eli olet sijalla {sija[0] || 1}
            <h1>Top 5 Lista:</h1>
            <Paper style={{ marginTop: 20, marginBottom: 15, maxWidth: 850 }}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nimi</TableCell>
                    <TableCell>Aika</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{filtList}</TableBody>
              </Table>
            </Paper>
          </Hero>
        </center>
        <Grid>{renderResultsData()}</Grid>
        {/*
        <div
          style={{ height: 60, width: 130 }}
          className="mqn2-af4 mqn2-af5"
          onClick={restart}>
          <span className="mqn2-af6" text="">
            <span>
              <span className="mqn2-aal">Pelaa uusiksi</span>
            </span>{' '}
          </span>
        </div> */}
      </div>
    )
  } else {
    return (
      <QuizContext.Provider value={{ state, dispatch }}>
        <div className="container">
          <Progress total={questions.length} current={currentQuestion + 1} />
          <Question user={props.user} />
          <Answers />
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              placeContent: 'space-between'
            }}>
            {renderError()}

            <div
              style={{ height: 60, width: 130 }}
              className="mqn2-af4 mqn2-af5"
              onClick={next}>
              <span className="mqn2-af6" text="">
                <span>
                  <span className="mqn2-aal">Seuraava</span>
                </span>{' '}
              </span>
            </div>
          </div>
        </div>
      </QuizContext.Provider>
    )
  }
}

export default App
