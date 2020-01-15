/* packages */
let path        = require('path');
let logger      = require('morgan'); //for logging only
let express     = require('express');
let hbs         = require('hbs');
/* app settings*/
let app         = express();
let port        = process.env.PORT || 3000;
/* set up the application params*/

// log
app.use( logger('dev'));

/*Views*/
app.set('view engine', 'hbs');

/* HOME */
app.get('/', function(req,res) {
  res.send('This is our Home Page');
});

/* INDEX TODOS */
app.get('/todos', function(req,res) {
  let seededTodos = [
    {
      description: "get beer",
      urgent: true
    }, {
      description: "dry cleaning",
      urgent: false
    }
  ];

  res.render('todos/index', {
    todos: seededTodos
  });
});

// Start server
app.listen(port, function() {
  console.info('Server Up -- Ready to serve hot todos on port', port,"//", new Date());
});
