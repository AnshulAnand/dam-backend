import dayjs from 'dayjs'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import logger from './logger'

const logEvents = async (message, logFileName) => {
  const dateTime = dayjs().format()
  const logItem = `${dateTime}\t${message}\n`

  try {
    if (!fs.existsSync(path.join(__dirname, '..', '..', 'logs'))) {
      await fsPromises.mkdir(path.join(__dirname, '..', '..', 'logs'))
    }
    await fsPromises.appendFile(
      path.join(__dirname, '..', '..', 'logs', logFileName),
      logItem
    )
  } catch (err) {
    logger.error(err)
  }
}

export default logEvents
