/* packages */
var logger      = require('morgan');
var express     = require('express');
var hbs         = require('hbs');
const methodOverride = require('method-override')
var bodyParser  = require('body-parser');
var todosController = require('./controllers/todos_controller.js');
/* app settings*/
var app         = express();
var port        = process.env.PORT || 3000;

/* set up the application params*/

//  SETTING UP MIDDLE WARES BEFORE USING THE CONTROLLER AS A MIDDLEWARE //
// logger
app.use( logger('dev'));

// body parser converting JSON to js objects and vice versa
app.use(bodyParser.urlencoded({
  extended: true
}));

// Method Override middleware
app.use(methodOverride('_method'))

// Using the controller, can add prefix to the paths as well or leave it as / to set root for the controller
app.use('/', todosController);

/*Views*/
app.set('view engine', 'hbs');

/* HOME */
// app.get('/', function(req,res) {
//   res.send('This is our Home Page');
// });

// Start server
app.listen(port, function() {
  console.info('Server Up -- Ready to serve hot todos on port', port,"//", new Date());
});
