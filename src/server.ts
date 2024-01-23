import app from './app';
import { DEFAULT_PORT } from './constants';
import Database from './dbs/config.mongodb';

const PORT = process.env.PORT || DEFAULT_PORT;

const server = app.listen(PORT, () => {
  console.log(`Server is start at PORT: ${PORT}`);
});

process.on('SIGINT', () => {
  Database.disconnect();
  server.close(() => console.log('Exit Server Express'));
});
