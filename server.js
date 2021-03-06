const express = require('express'),
  app = express(),
  port = process.env.PORT || 1337;
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

var client = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'app93897030@heroku.com',
    pass: 'mahowmdt2911'
  }
});

app.use(bodyParser.json());

app.get('/api/v1', (req, res) => {
  res.send('check');
})

app.post('/api/v1', (req, res) => {
  let msg = '';
  req.body.tasks.forEach(task => {
    msg += `<p style="font-weight: bold">${task.title}</p>`
    if(typeof task.value === 'string' || task.value instanceof String) {
      msg += `<p>${task.value}</p>`
    } else if(task.value.length) {
      for(var key in task.value) {
        if(task.value.hasOwnProperty(key)){
          console.log(task.value[key]);
          msg += `<p>${task.value[key].title} <span style="font-weight: bold;"> Стоимость: <span style="color: green">${task.value[key].value}</span></span></p>`
        }
      }
    } else if(task.value.title) {
      msg += `<p>${task.value.title} <span style="font-weight: bold;">Стоимость: <span style="color: green">${task.value.value}</span></span></p>`;
    }
  });

  msg += `<h2>Сумма: <span style="color: green">${req.body.sum}</span></h2>`;

  const messageProducer = {
    from: 'app93897030@heroku.com',
    to: 'kanutan93@gmail.com',
    subject: 'Prototype. Заявка на тестирование.',
    html: msg
  };
  
  client.sendMail(messageProducer, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});

app.use('/', express.static(__dirname + '/dist'));
app.all('*', (req, res) =>  {
  res.redirect(`https://ibsec.herokuapp.com/`);
});
app.listen(port, () => {
  console.log('server successfully started on port '+ port);
});
