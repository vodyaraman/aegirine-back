import { app } from './app.js'
import { logger } from './logger.js'

const port = process.env.PORT
const host = process.env.HOST

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

app.listen(port).then(() => {
  logger.info(`App listening on http://${host}:${port}`)
})
