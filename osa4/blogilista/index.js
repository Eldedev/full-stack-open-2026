const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})