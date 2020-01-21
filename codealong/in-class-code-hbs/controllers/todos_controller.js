var express = require('express');
var router = express.Router();
var data = require('../data.js');
let TodoModel = require('../models/Todo') //importing my Model to be able to do CRUD operation on my DB

/* INDEX TODOS */

router.get('/todos', function(req,res) {
TodoModel.find({})
.then((listoftodos) => {
  res.render('todos/index', {
    todos: listoftodos
        })
    })
})

/* NEW TODO (view)*/

router.get('/todos/new', function(req, res){
  res.render('todos/new');
});

/* UPDATE TODO FORM (view)*/

router.get('/todos/:id/edit', function(req, res){
  const todoid = req.params.id
  TodoModel.findById(todoid)
  .then((todo) => {
    console.log(todo)
    res.render('todos/edit', {
      todo: todo
    });
  })
});

/* SHOW TODO */

router.get('/todos/:id', function(req,res) {
  let todoid = req.params.id
  TodoModel.findById(todoid)
  .then((todosingle) => {
    res.render('todos/show', {
      todo: todosingle
    });
  })
});

/* CREATE/POST TODO */

router.post('/todos', function(req, res){
  var newTodo = {
    "description": req.body.description,
    "urgent": req.body.urgent
  };
let newItem = new TodoModel(newTodo)
newItem.save().then((todo) => {
  res.redirect('/todos');
      })
})

/* DELETE(using post with middleware method-override) TODO */

router.delete('/todos/:id', (req, res) => {
  const todoid = req.params.id
  TodoModel.findByIdAndDelete(todoid)
  .then (()=> {
    res.redirect('/todos')
  })
})

/* UPDATE(using post with middleware method-override) TODO */

router.put('/todos/:id/edit', (req, res) => {
  const todoid = req.params.id
  let updatedtodo = req.body
TodoModel.findByIdAndUpdate(todoid, updatedtodo)
.then((todo) => {
  res.redirect(`/todos/${todoid}`)
})
})

module.exports = router;
