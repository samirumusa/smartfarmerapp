  const express = require('express')
  const cors = require('cors');
  
  const app = express()
  app.use(cors())

app.use(express.json());
const Pid = require('./models/plantId');

app.use('/', Pid);
  //console.log(decodeImage())

app.listen(8000, console.log('server started at port 8000 !'))

 