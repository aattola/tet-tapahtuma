import React, { useState, useEffect } from 'react'
import Quiz from './quiz/App'
import Admin from './admin/App'
import Loppu from './loppu'
import { Route, Switch, useLocation } from 'wouter'
import styled from 'styled-components'
import { CircularProgress, TextField } from '@material-ui/core'
import LobbySVG from './lobby.svg'

const Intro = styled.div`
  font-size: 60px;
  display: grid;
  place-content: center;
  align-content: center;
  align-items: center;
  justify-content: center;
`
const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media only screen and (max-width: 600px) {
    position: unset;
    transform: translate(0);
  }
`
const Peli = styled.h1`
  text-align: center;
  margin: 0;
  font-family: Poppins;
  font-weight: 700;
  font-size: 34px;
  margin-bottom: 25px;
  color: #171717;
`
const Card = styled.div`
  background: white;
  border: 1px solid #dadce0;
  padding: 40px 30px;
  padding-bottom: 50px;
  /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15); */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 320px;

  @media only screen and (max-width: 600px) {
    border-radius: 0px;
    height: 100vh;
    width: 100%;
  }
`

function Lobby() {
  const [connected, setConnected] = useState(false)
  const [started, setStarted] = useState(false)
  const [name, setName] = useState('')
  const [rankaisu, setRankaisu] = useState(0)
  const [user, setUser] = useState({})
  const [questions, setQuestions] = useState([])
  const [location, setLocation] = useLocation()

  useEffect(() => {
    if (window.socket.connected) {
      setConnected(true)
    }

    window.socket.emit('checkName', user => {
      if (location == '/lobby') {
        if (!user[0]) return setLocation('/')
        setUser(user[0])
      }
    })

    window.socket.on('start', (que, rankaisu) => {
      setQuestions(que)
      setStarted(true)
      setRankaisu(rankaisu)
    })

    window.socket.on('potkiUlos', id => {
      if (user.id === id) return (window.location = 'https://google.com')
    })

    window.socket.on('resetGame', () => {
      setStarted(false)
      setQuestions([])
      if (location == '/lobby') {
        setLocation('/')
      }
    })

    window.socket.on('stop', que => {
      setStarted(false)
      setQuestions([])
    })

    window.socket.emit('started')
  }, [location, setLocation, user.id])

  return (
    <Switch>
      <Route path="/paneeli">
        <Admin />
      </Route>
      <Route path="/">
        <>
          {/* <img style={{ height: '100vh' }} src={LobbySVG} alt="Kuva" /> */}
          <Center>
            <Card>
              <Peli>Peli</Peli>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (!name) return
                  window.socket.emit('name', name, () => {
                    setLocation('/lobby')
                  })
                }}>
                <TextField
                  value={name}
                  onChange={e => setName(e.target.value)}
                  label="Nimi"
                  style={{ width: '100%' }}
                  variant="outlined"
                />
              </form>

              <div
                style={{ marginTop: 8 }}
                onClick={e => {
                  if (!name) return
                  window.socket.emit('name', name, () => {
                    setLocation('/lobby')
                  })
                }}
                className="mqn2-af4 mqn2-af5">
                <span className="mqn2-af6" text="">
                  <span>
                    <span className="mqn2-aal">Seuraava</span>
                  </span>{' '}
                </span>
              </div>
            </Card>
          </Center>
        </>
      </Route>
      <Route path="/loppu">
        <Loppu />
      </Route>
      <Route path="/lobby">
        {started ? (
          <Quiz rankaisu={rankaisu} user={user} questions={questions} />
        ) : (
          <Intro>
            {!connected ? (
              <center>
                <CircularProgress />
              </center>
            ) : (
              <Center>
                <p>Odotellaan että peli alkaa</p>
              </Center>
            )}
          </Intro>
        )}
      </Route>

      <Route path="/*">
        <h1>ei löytyny 404</h1>
      </Route>
    </Switch>
  )
}

export default Lobby
