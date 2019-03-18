import jwt from 'jsonwebtoken'
import moment from 'moment'
import { CLIENT_KEY, CLIENT_SECRET } from './constants'
// import axios from 'axios'

async function setHeader () {
  const date = moment().unix()
  const token = await jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 2 * 60,
      data: {
        date,
        client_key: CLIENT_KEY
      }
    },
    CLIENT_SECRET
  )

  // axios.defaults.headers.post['x-toorhop-date'] = date
  // axios.defaults.headers.post['x-toorhop-key'] = CLIENT_KEY
  // axios.defaults.headers.post['x-toorhop-token'] = token

  return {
    'x-toorhop-date': date,
    'x-toorhop-key': CLIENT_KEY,
    'x-toorhop-token': token
  }
}

export default setHeader
