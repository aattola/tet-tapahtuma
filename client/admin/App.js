import React, { useEffect, useState } from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import Markdown from 'react-markdown/with-html'

import './adminLoader.css'
import Chart from './Chart'
import Footer from './footer'
import CpuChart from './cpuChart'
import Connected from './connected'
import ProcessUptime from './processUptime'
import RamChart from './ramChart'

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

const ButtonLine = styled.div`
  display: flex;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`
const Kysymykset = styled.div`
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 20px;
  margin-top: 2px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 1fr);
  }
`
const Epic = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fill, 1fr);
  }
`

const OverflowThing = styled.div`
  overflow-x: scroll;
`

function BarApp({ game, setGame, connected }) {
  return (
    <AppBar style={{ backgroundColor: 'white' }} position="fixed">
      <Toolbar variant="dense">
        <Typography
          style={{ color: 'black', fontFamily: 'Poppins', flex: '1' }}
          variant="h6"
          color="inherit">
          Hallintapaneeli
        </Typography>

        {connected ? (
          <svg
            style={{ height: 25, fill: '#31f956' }}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" />
          </svg>
        ) : (
          <svg
            style={{ height: 25, fill: '#f93131' }}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" />
          </svg>
        )}
        {!game ? (
          <Button
            style={{ marginLeft: 10 }}
            variant="outlined"
            size="large"
            color="primary"
            onClick={() => {
              window.socket.emit('startGame', () => {
                setGame(true)
              })
            }}>
            Aloita Peli
          </Button>
        ) : (
          <Button
            variant="contained"
            style={{ background: 'red', marginLeft: 10 }}
            size="large"
            color="primary"
            onClick={() => {
              window.socket.emit('stopGame', () => {
                setGame(false)
              })
            }}>
            Peli on päällä!
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

const style2 = [
  'background-image: url("https://i.imgur.com/I8DRiRS.png")',
  'background-size: cover',
  'color: #fff',
  'padding: 10px 90px',
  'line-height: 35px'
].join(';')
console.log('%c ', style2) // it works!

function Admin() {
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [game, setGame] = useState(false)
  const [kysymykset, setKysymykset] = useState([])
  const [open, setOpen] = useState(false)
  const [sure, setSure] = useState({
    open: false,
    sure: () => {
      return true
    },
    no: () => {
      return true
    }
  })
  const [processData, setProcessData] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [clients, setClients] = useState([])

  const [question, setQuestion] = useState('')
  const [id, setId] = useState('')
  const [theclass, setClass] = useState('')
  const [answer, setAnswer] = useState('')
  const [questions, setQuestions] = useState('')
  const [written, setWritten] = useState(false)
  const [moreInfo, setMoreInfo] = useState('')
  const [custom, setCustom] = useState(false)
  const [customText, setCustomText] = useState('')

  const [playerProgress, setPlayerProgress] = useState([])
  const [clearing, setClearing] = useState(false)
  const [reseting, setReseting] = useState(false)

  const [pisteEditor, setPisteEditor] = useState(false)
  const [scoreboard, setScoreboard] = useState([])
  const [pisteEdit, setPisteEdit] = useState(false)
  const [pId, setPId] = useState('')
  const [pName, setPName] = useState('')
  const [pPoints, setPPoints] = useState('')
  const [password, setPassword] = useState('')

  const [timePerWrong, setTime] = useState('')
  const [error, setError] = useState({ error: false, text: '' })
  const [connected, setConnected] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const [cmd, setCmd] = useState('')
  const [cmdWindow, setCmdWindow] = useState({
    open: false,
    sure: () => {
      return true
    },
    no: () => {
      return true
    }
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSure({
      open: false,
      sure: () => {
        return true
      }
    })
    setCmdWindow({
      open: false,
      sure: () => {
        return true
      }
    })

    setCmd('')

    setSending(false)
    setQuestion('')
    setId('')
    setClass('')
    setAnswer('')
    setQuestions('')
    setWritten(false)
    setMoreInfo('')
    setCustom(false)
    setCustomText('')
    setCustom(false)
    setCustomText('')
    setMoreInfo('')
    setWritten(false)
  }

  useEffect(() => {
    console.group('Spämmii')

    window.socket.emit('getAdminData', data => {
      setLoading(false)
      data.kysymykset.sort((a, b) => {
        return a.id - b.id
      })
      setKysymykset(data.kysymykset)
      setGame(data.game)
    })

    fetch('/getData')
      .then(b => b.json())
      .then(data => {
        setTime(data.rankaisu)
        setScoreboard(data.leaderboards)
      })

    const int = setInterval(() => {
      window.socket.emit('clients', data => {
        console.log(data, 'Clientit')
        setClients(data.clients)
        setProcessData(data.processData)
      })

      window.socket.emit('getProcess', data => {
        console.log(data, 'Pelin prosessi')
        const dataArray = Object.keys(data).map(i => data[i])

        dataArray.sort((a, b) => {
          return a.time - b.time
        })
        setPlayerProgress(dataArray)
      })

      setConnected(window.socket.connected)
    }, 2500)

    return () => {
      clearInterval(int)
    }
  }, [])

  const filtList = scoreboard
    .sort((a, b) => a.time - b.time)
    .map((data, i) => {
      return (
        <TableRow key={i}>
          <TableCell component="th" scope="row">
            {data.name}
          </TableCell>
          <TableCell>{HHMMSS(data.time).time}</TableCell>
          <TableCell>
            <Button
              onClick={() => {
                setPisteEdit(true)
                setPId(data.id)
                setPName(data.name)
                setPPoints(data.time)
              }}>
              Muokkaa
            </Button>
          </TableCell>
        </TableRow>
      )
    })

  if (pisteEditor) {
    return (
      <div>
        <BarApp game={game} setGame={setGame} connected={connected} />
        <div style={{ maxWidth: 1100, margin: '0 auto', marginTop: 65 }}>
          <div style={{ maxWidth: 850 }}>
            <Button
              style={{ marginLeft: 10, maxHeight: 42 }}
              size="large"
              color="primary"
              variant="outlined"
              onClick={() => setPisteEditor(false)}>
              Takaisin
            </Button>
            <div style={{ float: 'right' }}>
              <TextField
                value={timePerWrong}
                onChange={e => setTime(e.target.value)}
                style={{ maxHeight: 42, marginTop: 0 }}
                label="Rankaisu (sec)"
                type="number"
                variant="outlined"
                margin="dense"
              />
              <div
                style={{ marginTop: 0, height: 40, marginLeft: 6 }}
                onClick={() => {
                  if (!timePerWrong) return
                  window.socket.emit('rankaisu', timePerWrong)
                }}
                className="mqn2-af4 mqn2-af5">
                <span className="mqn2-af6" text="">
                  <span>
                    <span className="mqn2-aal">Tallenna</span>
                  </span>{' '}
                </span>
              </div>
            </div>
          </div>
          <Table
            style={{ marginTop: 20, marginBottom: 15, maxWidth: 850 }}
            size="small"
            aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Nimi</TableCell>
                <TableCell>Aika/Pisteet</TableCell>
                <TableCell>Muokkaa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scoreboard.length == 0 ? (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ei löytynyt mitään
                  </TableCell>
                  <TableCell component="th" scope="row">
                    kattelin takahuoneestakin
                  </TableCell>
                  <TableCell component="th" scope="row">
                    mutta ei vaa löytynyt
                  </TableCell>
                </TableRow>
              ) : (
                filtList
              )}
            </TableBody>
          </Table>
        </div>
        <Dialog
          open={pisteEdit}
          onClose={() => {
            setPisteEdit(false)
          }}
          fullScreen={fullScreen}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Vaihda pisteet</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Siis ei huijata sitten tai tulee paha mieli :(
            </DialogContentText>

            <TextField
              value={pId}
              onChange={e => setPId(e.target.value)}
              label="ID"
              style={{ marginTop: 15 }}
              type="text"
              fullWidth
              variant="outlined"
              disabled={password !== 'kkona'}
            />

            <TextField
              value={pName}
              onChange={e => setPName(e.target.value)}
              style={{ marginTop: 15 }}
              label="Nimi"
              type="text"
              fullWidth
              disabled={password !== 'kkona'}
              variant="outlined"
            />

            <TextField
              value={pPoints}
              style={{ marginTop: 15 }}
              onChange={e => setPPoints(e.target.value)}
              label="Aika sekuntteina"
              type="number"
              fullWidth
              disabled={password !== 'kkona'}
              variant="outlined"
            />

            <TextField
              onChange={e => setPassword(e.target.value)}
              value={password}
              style={{ marginTop: 15 }}
              label="Salasana"
              type="password"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setPisteEdit(false)
              }}
              color="primary">
              Peruuta
            </Button>
            <Button
              disabled={password !== 'kkona'}
              onClick={() => {
                const ye = {
                  points: pPoints,
                  name: pName,
                  id: pId
                }
                window.socket.emit('removePoints', ye, () => {
                  setPisteEdit(false)
                  setPPoints('')
                  setPName('')
                  setPId('')

                  fetch('/getData')
                    .then(b => b.json())
                    .then(data => {
                      setTime(data.rankaisu)
                      setScoreboard(data.leaderboards)
                      setPisteEditor(true)
                    })
                })
              }}
              color="primary">
              Poista
            </Button>

            <Button
              disabled={password !== 'kkona'}
              onClick={() => {
                const ye = {
                  points: pPoints,
                  name: pName,
                  id: pId
                }
                window.socket.emit('setPoints', ye, () => {
                  setPisteEdit(false)
                  setPPoints('')
                  setPName('')
                  setPId('')

                  fetch('/getData')
                    .then(b => b.json())
                    .then(data => {
                      setTime(data.rankaisu)
                      setScoreboard(data.leaderboards)
                      setPisteEditor(true)
                    })
                })
              }}
              color="primary">
              Tallenna
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  return (
    <>
      <div className="wrapper2000">
        <AppBar style={{ backgroundColor: 'white' }} position="fixed">
          <Toolbar variant="dense">
            <Typography
              style={{ color: 'black', fontFamily: 'Poppins', flex: '1' }}
              variant="h6"
              color="inherit">
              Hallintapaneeli
            </Typography>

            <div
              style={{
                marginRight: 8,
                display: 'flex',
                justifyItems: 'center',
                flexDirection: 'rows'
              }}>
              {connected ? (
                <>
                  <span
                    style={{ color: '#31f956', marginRight: 8, marginTop: 5 }}>
                    Yhdistetty
                  </span>
                  <svg
                    style={{ height: 25, fill: '#31f956' }}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                </>
              ) : (
                <>
                  <span style={{ color: 'red', marginRight: 8, marginTop: 5 }}>
                    Ei yhteyttä
                  </span>
                  <svg
                    style={{ height: 25, fill: '#f93131' }}
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                </>
              )}
            </div>

            {!game ? (
              <Button
                style={{ marginLeft: 10 }}
                variant="outlined"
                size="large"
                color="primary"
                onClick={() => {
                  window.socket.emit('startGame', () => {
                    setExpanded(true)
                    setGame(true)
                  })
                }}>
                Aloita Peli
              </Button>
            ) : (
              <Button
                variant="contained"
                style={{ background: 'red', marginLeft: 10 }}
                size="large"
                color="primary"
                onClick={() => {
                  window.socket.emit('stopGame', () => {
                    setExpanded(false)
                    setGame(false)
                  })
                }}>
                Peli on päällä!
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <div style={{ maxWidth: 1100, margin: '0 auto', marginTop: 65 }}>
          <h1
            style={{
              fontSize: 32,
              fontFamily: 'Poppins',
              fontWeight: 700,
              marginTop: 20
            }}>
            {!error.error ? 'Peli: ' : `Error: ei onnistunut ${error.text.cmd}`}
          </h1>

          {loading ? (
            <div className="loader">
              <div className="box1" />
              <div className="box2" />
              <div className="box3" />
            </div>
          ) : (
            <div>
              <ButtonLine>
                {!game ? (
                  <Button
                    style={{ marginLeft: 10, maxHeight: 42 }}
                    variant="outlined"
                    size="large"
                    color="primary"
                    onClick={() => {
                      window.socket.emit('startGame', () => {
                        setExpanded(true)
                        setGame(true)
                      })
                    }}>
                    Aloita Peli
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    style={{ background: 'red', marginLeft: 10, maxHeight: 42 }}
                    size="large"
                    color="primary"
                    onClick={() => {
                      window.socket.emit('stopGame', () => {
                        setExpanded(false)
                        setGame(false)
                      })
                    }}>
                    Lopeta peli
                  </Button>
                )}

                <Button
                  style={{ marginLeft: 10, maxHeight: 42 }}
                  size="large"
                  color="primary"
                  onClick={() => {
                    setClearing(true)
                    setSure({
                      open: true,
                      sure: () => {
                        window.socket.emit('clearData', () => {
                          setClearing(false)
                        })
                      },
                      no: () => {
                        setClearing(false)
                      }
                    })
                  }}>
                  {clearing ? (
                    <CircularProgress style={{ height: 28, width: 28 }} />
                  ) : (
                    'Tyhjennä data'
                  )}
                </Button>

                <Button
                  style={{ marginLeft: 10, maxHeight: 42 }}
                  size="large"
                  color="primary"
                  onClick={() => {
                    setReseting(true)

                    setSure({
                      open: true,
                      sure: () => {
                        window.socket.emit('reset', () => {
                          setReseting(false)
                        })
                      },
                      no: () => {
                        setReseting(false)
                      }
                    })
                  }}>
                  {reseting ? (
                    <CircularProgress style={{ height: 28, width: 28 }} />
                  ) : (
                    'Reset'
                  )}
                </Button>

                <Button
                  style={{ marginLeft: 10, maxHeight: 42 }}
                  size="large"
                  color="primary"
                  onClick={() => {
                    fetch('/getData')
                      .then(b => b.json())
                      .then(data => {
                        setTime(data.rankaisu)
                        setScoreboard(data.leaderboards)
                        setPisteEditor(true)
                      })
                  }}>
                  Piste editori
                </Button>

                <Button
                  style={{ marginLeft: 10, maxHeight: 42 }}
                  size="large"
                  color="primary"
                  onClick={() => {
                    setCmdWindow({
                      open: true,
                      sure: () => {
                        window.socket.emit('eval', cmd, data => {
                          if (data.error) {
                            setError(data.errorText)
                            setTimeout(() => {
                              setError(false)
                            }, 2500)
                          } else {
                            setError(data.stdout)
                            setTimeout(() => {
                              setError(false)
                            }, 2500)
                          }
                        })
                      },
                      no: () => {}
                    })
                  }}>
                  bash
                </Button>

                <Dialog
                  open={cmdWindow.open}
                  onClose={() => {
                    handleClose()
                    cmdWindow.no()
                  }}
                  fullScreen={fullScreen}
                  aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">
                    Varo ny vähän
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Ootko ihan varma tästä kato voi rikkoa paikkoja jos peli
                      on päällä ja siis ei Leevi tykkää jos rikot jotai <br />{' '}
                      Tämähän lähettää komennon serverille joka suoritetaan root
                      oikeuksilla <br />
                      <strong style={{ color: 'black' }}>
                        Käytä tätä jos haluat kaataa serverin
                      </strong>
                    </DialogContentText>

                    <TextField
                      value={cmd}
                      onChange={e => setCmd(e.target.value)}
                      style={{ marginTop: 12 }}
                      label="Komento"
                      type="text"
                      variant="outlined"
                      fullWidth
                    />

                    <TextField
                      onChange={e => setPassword(e.target.value)}
                      value={password}
                      style={{ marginTop: 15 }}
                      label="Salasana"
                      type="password"
                      variant="outlined"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        handleClose()
                        cmdWindow.no()
                      }}
                      variant="outlined"
                      color="primary">
                      Eipä tehäkkään
                    </Button>

                    <Button
                      disabled={password !== 'kkona'}
                      onClick={() => {
                        cmdWindow.sure()
                        handleClose()
                      }}
                      color="primary">
                      {sending ? <CircularProgress /> : <span>Tehää tää</span>}
                    </Button>
                  </DialogActions>
                </Dialog>

                <h1 style={{ flex: '1', textAlign: 'right' }}>
                  {processData ? (
                    <div>
                      <Connected users={clients.length} />
                      <CpuChart processData={processData} />
                      <RamChart processData={processData} />
                      <ProcessUptime processData={processData} />
                    </div>
                  ) : (
                    <CircularProgress />
                  )}
                </h1>
                {/* <h1 style={{ flex: '1', textAlign: 'right' }}>
                Sivulle yhdistyneet ihmiset: {clients.length}
              </h1> */}
              </ButtonLine>

              <div>
                <br />

                <Epic>
                  <div>
                    <h1>({clients.length}) Aulassa:</h1>
                    <Paper>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nimi</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Potki</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clients.map((c, i) => {
                            return (
                              <TableRow key={c.id}>
                                <TableCell component="th" scope="row">
                                  {c.username}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {c.id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <Button
                                    onClick={() => {
                                      window.socket.emit('potki', c.id)
                                    }}
                                    variant="outlined"
                                    size="small">
                                    Potki
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </Paper>
                  </div>

                  <div>
                    <h1>({playerProgress.length}) Pelissä:</h1>
                    <Paper>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Nimi</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Kysymys</TableCell>
                            <TableCell>Aika</TableCell>
                            <TableCell>Huijaako</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {game &&
                            playerProgress.map((c, i) => {
                              return (
                                <TableRow key={c.id}>
                                  <TableCell component="th" scope="row">
                                    {c.username}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {c.id}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {c.currentQuestion}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {c.time && HHMMSS(c.time).time}
                                  </TableCell>
                                  <TableCell component="th" scope="row">
                                    {c.devtools ? (
                                      <span style={{ color: 'red' }}>
                                        Huijaa
                                      </span>
                                    ) : (
                                      <span style={{ color: 'green' }}>Ei</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </Paper>
                  </div>
                </Epic>
              </div>

              <ExpansionPanel
                onClick={() => setExpanded(!expanded)}
                expanded={expanded}
                style={{ marginTop: 16 }}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <div style={{ flexBasis: '44.44%' }}>
                    <Typography>Hieno taulukko tilanteesta</Typography>
                  </div>
                  <div>
                    <Typography>oikeesti hieno siis</Typography>
                  </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <OverflowThing>
                    <Chart playerProgress={playerProgress} />
                  </OverflowThing>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <h1 style={{ marginTop: 25 }}>Kysymykset:</h1>

              <Kysymykset>
                {kysymykset.map(k => (
                  <ExpansionPanel key={`${k.id}${k.luokka}`}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header">
                      <div style={{ flexBasis: '44.44%' }}>
                        <Typography>{k.question}</Typography>
                      </div>
                      <div>
                        <Typography>{k.luokka}</Typography>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {k.custom ? (
                        <div style={{ flexBasis: '43%' }}>
                          <div
                            style={{ marginRight: 24 }}
                            className="markdown-body">
                            <Markdown
                              escapeHtml={false}
                              skipHtml={false}
                              source={k.custom}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{ flexBasis: '43%' }}>
                          Vastaukset:
                          {k.answers.map(an => (
                            <h1 key={an}>{an}</h1>
                          ))}
                        </div>
                      )}

                      <div
                        style={{
                          borderLeft: '2px solid #d2d2d2',
                          padding: '12px 16px'
                        }}>
                        <Typography variant="caption">
                          {k.correctAnswer && (
                            <>
                              <span>Oikea vastaus: {k.correctAnswer}</span>
                              <br />
                            </>
                          )}
                          ID: {k.id}
                          <br />
                          {k.typed && <span>Kirjoitustehtävä</span>}
                          {k.custom && <span>Teksti info</span>}
                        </Typography>
                      </div>
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                      <Button
                        onClick={() => {
                          window.socket.emit('deleteQuestion', k.id, () => {
                            window.socket.emit('getAdminData', data => {
                              console.log(data)
                              setLoading(false)
                              setKysymykset(data.kysymykset)
                              setGame(data.game)
                            })
                          })
                        }}
                        size="small">
                        Poista
                      </Button>
                      <Button
                        onClick={() => {
                          setQuestion(k.question)
                          setId(k.id)
                          setClass(k.luokka)
                          setAnswer(k.correctAnswer)
                          setQuestions(k.answers.join(','))
                          setCustom(k.custom)
                          setCustomText(k.custom)
                          setMoreInfo(k.moreInfo)
                          setWritten(k.typed)

                          handleClickOpen()
                        }}
                        size="small"
                        color="primary">
                        Muokkaa
                      </Button>
                    </ExpansionPanelActions>
                  </ExpansionPanel>
                ))}
                <Button
                  style={{ marginTop: 20 }}
                  variant="outlined"
                  onClick={() => {
                    if (!game) return handleClickOpen()
                  }}>
                  {game ? 'Sammuta peli ensin' : 'Lisää kysymys'}
                </Button>
              </Kysymykset>
            </div>
          )}
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          fullScreen={fullScreen}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Luo uusi kysymys</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Kysymyksessä kannattaa olla 4 vaihtoehtoa. Oikea vastaus lasketaan
              ensimmäisestä
            </DialogContentText>
            <TextField
              value={question}
              onChange={e => setQuestion(e.target.value)}
              label="Kysymys"
              type="text"
              fullWidth
              variant="outlined"
            />
            {custom ? (
              <TextField
                value={id}
                onChange={e => setId(e.target.value)}
                style={{ marginTop: 12 }}
                label="id"
                type="number"
                fullWidth
                variant="outlined"
              />
            ) : (
              <TextField
                value={id}
                onChange={e => setId(e.target.value)}
                style={{ width: '48%', marginTop: 12 }}
                label="id"
                type="number"
                variant="outlined"
              />
            )}
            {!custom && (
              <TextField
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                style={{ width: '48%', float: 'right', marginTop: 12 }}
                label="Oikea vastaus (numero)"
                type="number"
                variant="outlined"
              />
            )}

            <TextField
              value={theclass}
              onChange={e => setClass(e.target.value)}
              style={{ marginTop: 12 }}
              label="Luokka / Infoo"
              type="text"
              variant="outlined"
              fullWidth
            />

            {!written ? (
              <div />
            ) : (
              <TextField
                value={moreInfo}
                onChange={e => setMoreInfo(e.target.value)}
                style={{ marginTop: 12 }}
                label="Extra infoo"
                type="text"
                fullWidth
                variant="outlined"
              />
            )}

            <center>
              {!custom && (
                <FormControlLabel
                  style={{ marginTop: 17, marginLeft: 20 }}
                  control={
                    <Checkbox
                      checked={written}
                      onChange={e => setWritten(e.target.checked)}
                      value="Kirjoitustehtävä"
                      color="primary"
                      margin="dense"
                    />
                  }
                  label="Kirjoitustehtävä"
                />
              )}

              {!written && (
                <FormControlLabel
                  style={{ marginTop: 17, marginLeft: 20 }}
                  control={
                    <Checkbox
                      checked={custom}
                      onChange={e => setCustom(e.target.checked)}
                      value="Infopläjäys"
                      color="primary"
                      margin="dense"
                    />
                  }
                  label="Infopläjäys"
                />
              )}
            </center>

            <div style={{ marginTop: 8 }}>
              {written ? (
                <TextField
                  value={questions}
                  onChange={e => setQuestions(e.target.value)}
                  label="Vastaus"
                  type="text"
                  fullWidth
                  rows="1"
                  variant="outlined"
                  style={{ marginTop: 5 }}
                />
              ) : (
                <div>
                  {!custom ? (
                    <TextField
                      value={questions}
                      onChange={e => setQuestions(e.target.value)}
                      margin="dense"
                      label="Vaihtoehdot erotetaan pilkulla (,)"
                      type="text"
                      fullWidth
                      multiline
                      rows="6"
                      variant="outlined"
                    />
                  ) : (
                    <div>
                      <TextField
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                        style={{ marginTop: 12 }}
                        label="Info teksti (markdown)"
                        type="text"
                        variant="outlined"
                        multiline
                        rows="15"
                        fullWidth
                      />
                      <div className="markdown-body">
                        <Markdown
                          escapeHtml={false}
                          skipHtml={false}
                          source={customText}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Peruuta
            </Button>

            <Button
              disabled={sending}
              onClick={() => {
                setSending(true)
                window.socket.emit(
                  'createQuestion',
                  {
                    answer: written ? 1 : answer,
                    questions,
                    theclass,
                    id,
                    question,
                    typed: written,
                    moreInfo,
                    customText,
                    custom
                  },
                  () => {
                    handleClose()
                    window.socket.emit('getAdminData', data => {
                      console.log(data)
                      setLoading(false)
                      setKysymykset(data.kysymykset)
                      setGame(data.game)
                      setSending(false)
                      setQuestion('')
                      setId('')
                      setClass('')
                      setAnswer('')
                      setQuestions('')
                      setWritten(false)
                      setMoreInfo('')
                      setCustom(false)
                      setCustomText('')
                      setCustom(false)
                      setCustomText('')
                      setMoreInfo('')
                      setWritten(false)
                    })
                  }
                )
              }}
              color="primary">
              {sending ? <CircularProgress /> : <span>Luo</span>}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={sure.open}
          onClose={() => {
            handleClose()
            sure.no()
          }}
          fullScreen={fullScreen}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Varo ny vähän</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ootko ihan varma tästä kato voi rikkoa paikkoja jos peli on päällä
              ja siis ei Leevi tykkää jos rikot jotai
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleClose()
                sure.no()
              }}
              variant="outlined"
              color="primary">
              Eipä tehäkkään
            </Button>

            <Button
              disabled={sending}
              onClick={() => {
                sure.sure()
                handleClose()
              }}
              color="primary">
              {sending ? <CircularProgress /> : <span>Tehää tää</span>}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Footer />
    </>
  )
}

export default Admin
