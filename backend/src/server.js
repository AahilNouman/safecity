const app = require('./app');
const config = require('./config');

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`🚀 SafeCity Backend server running in ${config.env} mode on port ${config.port}`);
  });
};

startServer();
