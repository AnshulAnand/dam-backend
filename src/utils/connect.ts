import config from 'config'
import mongoose from 'mongoose'
import logger from './logger'

const connectDB = async () => {
  const MONGO_URI = config.get<string>('mongoURI')
  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(MONGO_URI)
    logger.info(`Mongodb connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default connectDB