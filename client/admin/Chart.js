import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import useMedia from 'use-media'

function Chart({ playerProgress }) {
  const isWide = useMedia({ maxWidth: '750px' })
  const data = playerProgress.map(prog => {
    return {
      name: prog.username,
      Kysymys: prog.currentQuestion,
      Aika: prog.time
    }
  })

  return (
    <center style={{ marginTop: 35, marginBottom: 10 }}>
      {isWide ? (
        <BarChart width={450} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Kysymys" fill="#3cff45" />
          <Bar dataKey="Aika" fill="#5f70ff" />
        </BarChart>
      ) : (
        <BarChart width={1000} height={500} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Kysymys" fill="#3cff45" />
          <Bar dataKey="Aika" fill="#5f70ff" />
        </BarChart>
      )}
    </center>
  )
}

export default Chart
