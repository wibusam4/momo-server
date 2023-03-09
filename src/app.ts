import express from 'express';
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('from wibusama without love 🖕');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});