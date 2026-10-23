const app = require('./app');
const config = require('./config');

const startServer = () => {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`🚀 SafeCity Backend server running in ${config.env} mode on port ${config.port} (0.0.0.0)`);
  });
};

startServer();
