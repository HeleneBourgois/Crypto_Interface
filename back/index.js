import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

export const app = express()

app.use(cors())
app.use(bodyParser.json())

require('./src/router.js')

app.listen(3000, () => {
  console.log(`Back listening on port 3000!`)
})