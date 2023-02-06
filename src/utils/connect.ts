import mongoose from 'mongoose'
import logger from './logger'

const connectDB = async () => {
  const MONGO_URI = process.env['MONGO_URI']! // "!" tells the compiler that the value won't be undefined
  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(MONGO_URI)
    logger.info(`Mongodb connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error('Could not connect to database')
    process.exit(1)
  }
}

export default connectDB
