/* eslint-disable no-path-concat */
const app = require('express')()
const express = require('express')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const os = require('os-utils')

const admin = require('firebase-admin')
const serviceAccount = require('./firebase.json')
const { exec } = require('child_process')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tet-tapahtuma.firebaseio.com'
})
const firestore = admin.firestore()
const firebase = admin.database()
let players = []
let currentProgress = {}

io.on('connection', function(socket) {
  console.log('a user connected')
  socket.on('fortnite', msg => {
    io.emit('start')
  })

  socket.on('name', (name, cb) => {
    socket.username = name
    players.push({ username: name, id: socket.id })
    cb(name)
  })

  socket.on('checkName', cb => {
    const user = players.filter(pl => pl.id === socket.id)
    cb(user)
  })

  socket.on('eval', (cmd, fn) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(err)
        fn({ error: true, errorText: err })
        return
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
      fn({ error: false, stdout: stdout })
    })
  })

  socket.on('started', async () => {
    const snap = await firebase.ref('gameOn').once('value')
    const game = snap.val()
    if (game) {
      const snap2 = await firebase.ref('rankaisu').once('value')
      const rankaisu = snap2.val()
      const data = await firestore.collection('kysymykset').get()
      const questions = data.docs.map(d => d.data())
      questions.sort((a, b) => {
        return a.id - b.id
      })
      socket.emit('start', questions, rankaisu)
    }
  })

  socket.on('getAdminData', async fn => {
    const data = await firestore.collection('kysymykset').get()
    const dataArray = data.docs.map(d => d.data())
    const snap = await firebase.ref('gameOn').once('value')
    const game = snap.val()

    const send = {
      kysymykset: dataArray,
      game
    }
    fn(send)
  })

  socket.on('startGame', async fn => {
    const data = await firestore.collection('kysymykset').get()
    const questions = data.docs.map(d => d.data())
    firebase.ref('gameOn').set(true)
    const snap2 = await firebase.ref('rankaisu').once('value')
    const rankaisu = snap2.val()
    questions.sort((a, b) => {
      return a.id - b.id
    })
    io.emit('start', questions, rankaisu)

    fn(true)
  })

  socket.on('stopGame', async fn => {
    firebase.ref('gameOn').set(false)
    io.emit('stop')

    fn(true)
  })

  socket.on('deleteQuestion', async (id, fn) => {
    await firestore
      .collection('kysymykset')
      .doc(id)
      .delete()
    fn(true)
  })

  socket.on('clearData', async fn => {
    currentProgress = {}
    players = []
    fn()
  })

  socket.on('reset', async fn => {
    currentProgress = {}
    players = []
    io.emit('resetGame')
    fn()
  })

  socket.on('process', async (id, currentQuestion, devtools, time, fn) => {
    currentProgress[id] = {
      currentQuestion,
      id,
      username: socket.username,
      devtools,
      time
    }
    fn()
  })

  socket.on('getProcess', async fn => {
    fn(currentProgress)
  })

  socket.on('potki', async id => {
    io.emit('potkiUlos', id)
  })

  socket.on('setPoints', async (ye, fn) => {
    await firestore
      .collection('leaderboards')
      .doc(ye.id)
      .set({
        id: ye.id,
        name: ye.name,
        time: ye.points
      })

    fn()
  })

  socket.on('removePoints', async (ye, fn) => {
    await firestore
      .collection('leaderboards')
      .doc(ye.id)
      .delete()
    fn(true)
  })

  socket.on('clients', async fn => {
    io.clients((_, clients) => {
      players.forEach((user, i) => {
        if (!clients.includes(user.id)) {
          players.splice(i, 1)
          delete currentProgress[user.id]
        }
      })

      os.cpuUsage(value => {
        const memData = {
          freeMemory: os.freememPercentage(),
          cpuUsage: value,
          processUptime: os.processUptime()
        }

        const data = {
          processData: memData,
          clients: players
        }

        fn(data)
      })
    })
  })

  socket.on('rankaisu', async (a, fn) => {
    firebase.ref('rankaisu').set(a)
  })

  socket.on('createQuestion', async (data, fn) => {
    const {
      answer,
      questions,
      theclass,
      id,
      question,
      typed,
      moreInfo,
      customText,
      custom
    } = data
    if (custom) {
      const ref = await firestore
        .collection('kysymykset')
        .doc(id)
        .set({
          id,
          question,
          correctAnswer: answer,
          luokka: theclass,
          answers: questions.split(','),
          typed,
          moreInfo,
          custom: customText
        })
      fn(ref.id)
    } else {
      const ref = await firestore
        .collection('kysymykset')
        .doc(id)
        .set({
          id,
          question,
          correctAnswer: answer,
          luokka: theclass,
          answers: questions.split(','),
          typed,
          moreInfo
        })
      fn(ref.id)
    }
  })
})

app.use(express.static('dist'))
app.get('/data', async (req, res) => {
  const { id, time, name } = req.query
  await firestore
    .collection('leaderboards')
    .doc(id)
    .set({
      id,
      time,
      name
    })
  const snap = await firestore
    .collection('leaderboards')
    .orderBy('time')
    .get()

  const send = snap.docs.map(data => data.data())
  res.send({ leaderboards: send })
})

app.get('/getData', async (req, res) => {
  const snap = await firestore
    .collection('leaderboards')
    .orderBy('time')
    .get()

  const snap2 = await firebase.ref('rankaisu').once('value')
  const rankaisu = snap2.val()

  const send = snap.docs.map(data => data.data())
  res.send({ leaderboards: send, rankaisu })
})

app.get('/ei/lopeta/restart', async (req, res) => {
  exec('dokku ps:restart tet', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err)
      res.send({ error: true, text: err })
      return
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
    res.send({ error: false })
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + './../dist/index.html'))
})

http.listen(3000, () => console.log('Listening on port 3000!'))
