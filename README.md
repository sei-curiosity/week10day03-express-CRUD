[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)
![Misk Logo](https://i.ibb.co/KmXhJbm/Webp-net-resizeimage-1.png)

# Create and Read with Express

### Objectives

- Write an HTML form that can make POST/PUT requests
- Describe how inputs transform into a req.body object on the server side
- Use bodyParser to read parameters passed from forms via POST requests
- Build RESTful routes that are wired to the correct semantically named view

### Preparation

*Before this lesson, students should already be able to:*

- Identify HTTP verbs, with crud actions, and view layers
- Build routes
- Pass parameters via dynamic segments and query parameters

<br>

## Intro

SEPARATION OF CONCERNS

- Without Separation of Concerns (SoC), it becomes incredibly hard to maintain or change an application.
- Large applications like Facebook and Google utilize SoC since they are always adding new features, changing existing features, and working in large teams.
- SoC decomposes apps into parts with minimal overlap of code.
- SoC allows people to work on individual pieces of the system in isolation,
 facilitate reusability, and enable everyone to better understand the system.

FORMS

- Forms gives users the ability to pass information from the client to the server.  For example, a sign up form.

So far we've created routes in Express and passed parameters from the browser to our server. We've constructed our views and dynamically built our html using Handlebars.

<!-- But now we're going to see the glue that ties this all together – forms. -->

<!-- For brevity, we're going to start with some starter code. While it would absolutely be good for you to build this all from scratch, it's important to make sure we focus right now on the one _new_ piece of our application structure: passing information from the client to our server and persisting that data in a data structure, and sending it back. -->

The ultimate goal of this lesson is to make our own form that will give the user the ability to create new todos.

First, in following with the principles of SoC, we are going to take our 'todos' route and logic and put it in it's own separate controller.  We are creating our first modular application.

So in your `/labs/express` folder, you should see a starter application named `starter-code-hbs` with a bunch of work done already to get us going.

<br>

&#x1F535; **I DO, THEN YOU DO: PART 1 - Starter Code Set-up**

1. `cd` into `starter-code-hbs` and run the command `npm install` which will read the `package.json` file and install all of the dependencies specified in a `node_modules` folder.

2. Then, add a "start" script to your `package.json` that has the value `nodemon server.js`. Run `npm start` to start our server.

    In `server.js`, notice that we have a `/todos` route. It contains `var seededTodos` which is an array of 2 seeded todos:

```javascript
/* INDEX */
app.get('/todos', function(req,res) {
      var seededTodos = [
        {
          description: "get beer",
          urgent: true
        }, {
          description: "dry cleaning",
          urgent: false
        }
      ];

      res.render('/todos/index', {
        todos: seededTodos
      });
})
```


3. Walk back through yesterday's Express Router lesson and refactor this app with the following:

    - A `controllers/todos.js` file
    - Move your `/todos` route to the file.

<details>

<summary>**Set-up Solution**</summary>


# Set-up Solution


These routes are all related to todos.  Let's put them in a separate "controller" file and directory.  Create a a "controllers" directory and create a file called `todos.js`.  This will be our todos controller file.

Now move the routes pertaining to todos into that todos.js file.

```javascript
/* INDEX TODOS */
app.get('/todos', function(req,res) {
  var seededTodos = [
    {
      description: "get juicer",
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
```

Require express at the top of that `todos.js` file

```javascript
var express = require('express');
```

invoke the router

```javascript
var router = express.Router();
```

Change app to router

```javascript
/* INDEX TODOS */
router.get('/todos', function(req,res) {
  ...
});
```

At the bottom of the file, export the router

```javascript
module.exports = router;
```

Now in your `server.js`, require the controller file we created.  **Be sure to include ./ at the beginning of the path to the controller, so node knows that this is not an NPM package.**

```javascript
var todosController = require('./controllers/todos.js');
```

Use the controller for all routes that start with `/todos`

```javascript
app.use('/todos', todosController);
```

Since we are specifying that the controller will be used for all routes starting with `/todos`, we don't need to show `/todos` in our actual routes within our controller file.

```javascript
/* INDEX TODOS */
router.get('/', function(req,res) {
  ...
});
```
</details>

&#x1F535; **Ask yourself**

- Why are we requiring the todos controller in the server.js?
- We put module.exports = router at the bottom of the todos.js file.  What is this line doing here?
- Why can we use ‘/‘ instead of ‘/todos’ in the todos controller?


<br>



<br>

## module.exports

&#x1F535; **I DO, THEN YOU DO**

In `server.js`, we have a `var seededTodos` which is an array of 2 seeded todos.

As our app grows in size and complexity, we'll want to move logic out of our `server.js` file. One method for doing so is by using an object called `module.exports`. This allows us to clean up and share code throughout our app through breaking our code into separate files.

`module.exports` allows us to separate our js files by exposing their contents
as one global variable. The global variable isn't assigned until we require the
file.

1. For example, let's remove the `seededTodos` data from `controllers/todos.js` to our `data.js` file by adding it as a property to `module.exports` like so:

```javascript
    module.exports = {
     seededTodos: [
        {
          description: "get juice",
          urgent: true
        }, {
          description: "dry cleaning",
          urgent: false
        }
     ]
    };
```

Now our `module.exports` will have a property of `seededTodos` which is an Array of todo objects.

2. In `controllers/todos.js`, instantiate a variable to grant access to module we've created:

```javascript
  var data = require('../data.js');
```

3. Now, our variable `data` is our `module.exports` object. We can access our `seededTodos` via our `controllers/todos.js` file like so:

```javascript
    res.render('todos/index.hbs', {
       todos: data.seededTodos
    });
```
> This is essentially like calling `module.exports.data`


> Refresh the page and you can see that nothing changed in our browser, really we just moved the functionality into a different file.

<details>

<summary>What advantages does that bring to us with regard to separation of concerns in MVC?</summary>

1) The code is more organized and easier to understand by having separate controllers for our routes.

2) By putting the data in a separate file, we can now utilize that data in different files without replicating code.  This can be really useful down the road when we create large files with functions associated with a specific task.


</details>

You'll start to see the necessity of `module.exports` once we add
models and more routes to our application.  Keeping everything in `server.js` will quickly become a headache.

<br>

## Get To Know The Code - REST-ful Routing

In general, programming is very free form — there are many solutions and many possible and perfectly acceptable answers and means of solving problems. However, `Express` is a framework and has opinions about how we should write our code. Similarly, over the last 20 years or so programmers have developed several patterns to help clarify the purpose and design of routes in the context of HTTP and databases.

Our key words here today are:

- **RESTful** routes
- **CRUD**

|   HTTP    | CRUD      | RESTful View names            |
|-------:   |--------   |---------------------------    |
| GET       | Read      | show / index / new / edit     |
| POST      | Create    | no views rendered             |
| PUT/PATCH    | Update    | no views rendered             |
| DELETE    | Delete    | no views rendered             |

<br>

We're going to follow a very specific pattern at first.

|           View    | Purpose                                                                       | Blog example                                              | RESTful route example                                 |
|---------------:   |----------------------------------------------------------------------------   |---------------------------------------------------------  |---------------------------------------------------    |
| show.hbs      | Shows an individual resource                                                  | A page that shows a single blog post                      | localhost:3000/posts/1 | GET /posts/:id               |
| index.hbs     | Shows all instances of a resource                                             | A page that shows all blog posts                          | localhost:3000/posts | GET /posts                     |
| new.hbs       | Displays a form to create a new resource (form makes a post request)          | A page that lets you create a new blog post               | localhost:3000/posts/new | GET /posts/new                 |
| edit.hbs      | Displays a form that lets you edit a resource (form makes a post request)     | A page that lets you edit an already created blog post    | localhost:3000/posts/1/edit | GET /posts/:id/edit     |



<br>


Roughly, here's how the table above would look in our `server.js` (this generic example is BEFORE DRY-ing up our code with express.Router and a separate controller file.):

```javascript
app.get('/posts', function(req, res) {
  console.log("index");
  res.render("/posts/index");
});

app.get('/posts/new', function(req, res) {
  console.log("new");
  res.render('/posts/new');
});

app.get('/posts/:id', function(req, res) {
  console.log("show");
  res.render("/posts/show");
});

app.post('/posts', function(req, res) {
  console.log("create");
  res.send("CREATE");
});

app.get('/posts/:id/edit', function(req, res) {
  console.log("edit");
  res.render("/posts/edit");
});

app.put('/posts/:id', function(req, res) {
  console.log("update");
  res.send("UPDATE");
});

app.delete('/posts/:id', function(req, res) {
  console.log("delete");
  res.send("DELETE");
});
```
<br>

<details>
    <summary>**Nested Resources**</summary>

A restful architecture specifies the path to be constructed as a resource, the unique identifier of that resource and then another resource.

That second resource might be another object like a blog post or it might be a page.

So if we had users in our blog example above and users had blog posts and we wanted to see all of the blog posts of a specific user our route would like as follows:

`localhost:3000/users/1/posts` | `/users/:id/posts` | `views/posts/index.hbs` (file path)

Don't worry about this idea of nested resources for now, but know this is where we're moving toward.
</details>
<br>


## Todo `SHOW` Route

Convention dictates that the `show` route returns one instance of a given resource.

&#x1F535; **Review the attached code**

In previous lessons we learned about 'wildcard params'. (e.g. - `http://localhost:3000/:id`)

Can someone remind me what a wildcard is and how we use it?


1) Create a SHOW route for a single Todo

2) Create a show.hbs view

3) Render a single todo from our `data.seededTodos` array.

For example:

![](https://i.imgur.com/xOpoMui.png)

<br>

&#x1F535; **Ask yourself**

- How is the line ` var todo = data.seededTodos[req.params.id];` grabbing a single todo?
- What does this line allow us to do in our show.hbs view? `todo: todo `

<details>
    <summary>**SOLUTION**</summary>
Route

```js
/* SHOW TODO */
router.get('/:id', function(req,res) {
  var todo = data.seededTodos[req.params.id];

  res.render('todos/show', {
    todo: todo
  });
});
```

Sample `views/todos/show.hbs` template

```html
<h1>Todo - {{todo.description}}</h1>
<p>Urgent: {{todo.urgent}}</p>
```
</details>

<br>


## Todo `NEW` Route

Forms take user input and save it to a database, so let's start with a form to make a new todo item, as we need todos in our database.


Based on our table earlier. What view name do we want to use to create a page that has a form that will allow us to make a new resource?


1. Let's create a view for our form:  `touch views/todos/new.hbs`

2. Inside of `/todos/new.hbs` add the html form tags:

```html
<form>
</form>
```

Now, forms need to know where to _send_ information and the HTTP verb they'll be using to submit a request. Which verb do we use to **create** a new resource?

`POST`

What's the route we need to `POST` to?

`http://localhost:3000/todos`


All forms must have a `method` and an `action`.

1. Add method and action attributes to our form. The value of method will be `POST` and the value of action will `/todos`

```html
<form method="POST" action="/todos">
</form>
```

- Why can we use the /todos route for the form when the /todos route is already used to lead us to the index page?

    Now we've got a form that's going to `POST` to `/todos` – it'll hit our server, find an action with that combination of URL & verb, and run that code.

    There are no input fields or a submit button, but we'll add that next.

<br>

#### Let's add some form fields!

Luckily, form fields aren't that different from something we've seen before in JS – an object. In an object there are keys & values. Each input in a form is a key/value pair. Let's see a semi-complete example & dissect it.

```html
<form method="POST" action="/todos">

  <label for="description">description:</label>
  <input name="description">

  <label for="urgent">urgent: </label>
  <span>yes</span><input type='radio' name='urgent' value="true" checked>
  <span>no</span><input type='radio' name='urgent' value="false"/>

</form>
```

The `name` attribute contains our key. What the user types into the text field or selects as a radio button is our `value`. This would get parsed server side as:

```js
req.body = {
    description: 'whatever the user wrote in the input box',
    urgent: 'true'
}
```

So if you did send that over, how would you access the entire todo object (i.e.- the form body itself)?

`req.body`

How would you access the todo's description?

`req.body.description`


#### How to send information in a form!

To submit a form we need a submit button. But you know the designer's rule – never submit, always something specific. Plus, let's encapsulate our label/input combos with some `divs` to get some grouping going on.

```html
<form action="/todos" method="POST">
  <div>
    <label for="description">description:</label>
    <input type="text" name="description">
  </div>
  <div>
    <label for="urgent">urgent:</label>
    <span>yes</span><input type="radio" name="urgent" value="true" checked>
    <span>no</span><input type="radio" name="urgent" value="false">
  </div>
  <div>
    <input type="submit" value="Add a New Todo">
  </div>
</form>
```

Boom! Form, done.


<br>


#### Server Side

Some of the `controllers/todos.js` (specifically an INDEX route to show all of our todos, which we're storing in an array and our server/express configuration) is already written for you in the `starter-code`, we should walk through it to reiterate how it works.

```javascript
// controllers/todos.js

// This pulls in the module.exports object from
// data.js and assigns it to var data
// specifically it contains our seeded todos
var data = require('../data.js');


// Index shows all of a specific resource
// INDEX TODOS - returns All todos
router.get('/', function(req,res) {
  res.render('todos/index.hbs', {
    todos: data.seededTodos
  });
});
```

<br>


## Rendering `new.hbs`

Remember, the *new* action is just there to render the form to allow us to create a new Todo. The _form_ is the part saying "when you hit enter/hit my button, I'm going to POST to `/todos`!"

> NOTE: If you have errors, be mindful of our discussion about why order matters when creating Express routes.

<br>



<details>
    <summary>New Todo Route </summary>

```js
/* NEW TODO */
router.get('/new', function(req, res){
  res.render('todos/new');
});
```
</details>

<br>

## Review

How are feeling about your understanding of the lesson so far?

- 1: Things are a bit shaky at the moment.
- 2: Not sure about a few things, but I'm understanding the overall concepts.
- 3: I'm feeling pretty good.

Get in groups of 3. Answer your question first, then work on the others. We'll come back and each group will explain the answer to your assigned question.

1. What does `CRUD` stand for? What are the 4 HTTP verbs that we're using to accomplish this?
3. What does REST stand for? What does it mean for our app to be stateless? How many REST-ful routes are in a conventional CRUD application?
4. Which REST-ful routes have views associated with them? What do they all have in common?
5. Assume an `actor` resource and a `views/actors/` directory. Create an INDEX route. The response object will return a view containing `{ data: actors }`.
1. Assume an `actor` resource and a `views/actors/` directory. Create a NEW route. The response will return a view.
2. Create a form to create a new instance of an `actor`. The form will contain `name` and `mostRecentFilm` fields
3. Explain `module.exports` and why we use it.
4. Explain `require()` and why we use it.

<br>


## Todo `CREATE` Route

Awesome so now we have a form that renders on the page. So let's engage in some Error driven development.


<br>

- What happens when we add data and click the submit button?
- What's the difference between the 'new' route and 'create' route in terms of functionality?

&#x1F535; **Review the attached code**

Build a todo CREATE route using `router.post`. Don't worry about accessing the params from the form yet. Just send a response back ("Create a new todo is working!") to the client so you can verify the route works.

<details>
    <summary>Create Todo Route Solution</summary>

```js
/* CREATE TODO */
router.post('/', function(req, res){
  res.send("Create a new todo is working!");
});
```
</details>

<br>

## Receiving parameters from forms

So what happens when we hit submit? The request is made and we can see that the correct route is getting hit.

Up until now, how have we passed data/information from the client to server?

Forms send data inside of what we call the **body** of a request (rather than inside `params` or `queries`).

**GET** requests only send headers.

**POST** requests will send a header, and the parameters get sent in the body.

By default, Express doesn't have the ability to read the body sent by POST requests so we need to `npm install` another package.


<br>

## Install `body-parser`

`body-parser` (https://github.com/expressjs/body-parser), is a library that parses the body of incoming POST requests and stores the data as a key value pair on our `req` argument.

We access it via the `body` property.


Remember this npm command will fetch the module in question, install it on our server, and load it into our `package.json`

1. Then inside our `server.js` we need to `require()` the module and configure it.

```javascript
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
```
The params passed with a request will be "decoded" automatically, allowing you to use dot notation when working with JavaScript objects! The `extended: true` makes the objects more JSON-like.

1. In our `.post` route, change `res.send("Create working");` to `res.send(req.body);`

Now what happens when we submit a form?

<br>

&#x1F535; **Ask Yourself**

- Why are we using bodyParser?


&#x1F535; **YOU DO**

Install `body-parser` in your app.


<br>

## What is middleware?

You might have noticed that we just used a slightly different method than we have in the past (`.use`). We've used `app.listen()` and `app.set()` so far and now we've used `app.use(bodyParser...`

<br>

&#x1F535; **YOU DO**

Take ten minutes to read about middleware http://expressjs.com/en/guide/using-middleware.html

&#x1F535; **Ask yourself**

- What kind of middleware is body-parser?

---


Middleware is simply code that can be executed anywhere between a request and a response.

In our app we are logging out the server port once it has started - that is it. We get no other information about requests or errors. This is where Middleware comes in.

<!-- For an example, Let's write some middleware code that logs the type of request for any route that matches `/user`. We're gonna use a third-party library that's already required in the starter-app (`morgan`).

```javascript
app.use('/user/*', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
```

The `next()` is a function built into express, which will, when evoked, move on to the next function in the chain. In this case it explicitly means to continue with the request/response cycle and call the appropriate route based on the request. -->

<br>

## Use `body-parser`

Body-parser is third-party middleware. It will:

- add a `body` property to our `req` object
- parse the body of the incoming request, if there is one
- add the data as the value of `req.body`

Now the form data is accessible via `req.body`. Our next step is to add our todo to the array.


<br>

<details>
    <summary>Todo create route Solution</summary>

```js
/* CREATE TODO */
router.post('/', function(req, res){
    var newTodo = {
        description: req.body.description,
        urgent: req.body.urgent
    };

    data.seededTodos.push(newTodo);
    // res.send("Create a new todo is working!");
    res.redirect('/todos');
});
```

</details>

Why do we need to redirect after a `.post` action?


<br>

---

<details>

<summary>**RECAP: ClientSide**</summary>

## CLIENT vs SERVER

Data is sent from the client to the server, (from our browser to our express app). In the browser, we use HTML forms as an easy, user-friendly way to set up the write structure for muggles using our website.

This way our users can create new todos and update our database without any knowledge of http, routes, javascript, arrays or any of it really! The submit button is a one stop shop that as we've now learned triggers a whole series of processes.


## The form

It's just an html element that allows us to define how we want the data to be sent. The various attributes we configure let us set where the data is sent when the button is triggered. Remember how in our last unit we wanted to preventDefault behavior when the button was clicked? No longer, let that default behavior run free!

#### action form attribute

The action attribute is _essential_, it configures what route to send the data in the form to. In our example above that's to `/todos` but could be anything we want. if we had a song storage app that route might be `/songs`, if we had a ufo sightings database it might be `/sightings`

#### method form attribute

The method attribute refers to which HTTP verb we want to use. As you'll see tomorrow this can get a little hairy with PUT and DELETE, but today we're just specifying that it needs to be a POST request. Why is it not _essential_ like the action attribute is? Because the form will always default to making a GET request to whatever route is set in the action attribute.


## POST vs GET

You might remember that we sent all kinds of data to the server on Tuesday using our :dynamic_segments and query parameters using GET requests. So why don't we just use that method to add ToDos? Semantics.

A GET request, is specifically used by the browser to ask for some resource, an image, a song, a todo, etc, and use the data appended in the url to augment that request.

POST requests are specifically used to create a resource on the server.


POST requests send their data in the body, hidden from the user

The http request looks like this:

```
POST / HTTP/1.1
Host: /todos
Content-Type: application/x-www-form-urlencoded
Content-Length: 36

description=take%20out%20the%20trash

```

<br />

</details>

<details>

<summary>**RECAP: ServerSide**</summary>

---
# RECAP: Server Side
---

## Routes

Routes are defined in server.js and when the server is running, they listen for incoming HTTP requests on the specified PORT

the basic route syntax looks as follows:

```javascript

app.method('/route', function(req, res) {
  // the code that needs to run when this route is called
})

```

## req vs res

#### req argument

The `req` argument is an object that contains information about the incoming HTTP request:

- req.route
- req.query
- req.params
- req.body (see bodyParser below)

#### res argument

the `res` argument is another object that contains information about the response we want to send to the server.

We initially started with using res.send to just send text to the browser, when using hbs however, we can use res.render to render an html/hbs file.

We can also use res.redirect to trigger another route before sending a response back to the browser

## bodyParser

Express is a very lightweight framework and doesn't have the functionality to read data sent in the body of POST requests without including this module of code.

Configuring bodyParser on our server adds the `body` property to our `req` object so that we can easily access parameters sent by POST requests

you configure it as follows after installing the module to our application

```bash
$ npm install body-parser --save
```

```javascript
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
```
</details>

</details>

## Resources

[Bit further ahead: module.exports vs exports](http://www.hacksparrow.com/node-js-exports-vs-module-exports.html)


---


# Express - Update and Delete

## Lesson Objectives
1. Create a Delete Route
2. Make the index page send a DELETE request
3. Create an edit route
4. Create a link to the edit route
5. Create an update route
6. Make the edit page send a PUT request

## Recap

CRUD

HTTP

MVC

Acronyms galore. But let's quickly revisit what these are, and how we have applied them thus far.

RESTful Routes:

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /photos/         | GET       | index  | 
| /photos/new         | GET    | new    |
| /photos          | POST      | create  | 
| /photos/:id      | GET       | show     |  
| /photos/:id/edit | GET       | edit      | 
| /photos/:id      | PATCH/PUT | update    |
| /photos/:id      | DELETE    | destroy  |

## Steps to Create a Node App

### Naming Conventions

1. controller files (plural)

2. routes (plural or singular depending)

3. views dir (plural)

4. view files (index, new, show, edit)

### Create a Delete Route

Inside of our `controllers/todos_controller.js` file, add a DELETE route:

```javascript
router.delete('/:id', function(req, res) {
    data.seededTodos.splice(req.params.id, 1); // remove the item from the array

    res.redirect('/todos');  // redirect back to the index route
});
```

### Make the index page send a DELETE request

In our `controllers/todos_controller.js` file, make sure that your index route looks something like this:

```javascript
router.get('/', function(req, res) {

  res.render('todos/index', {
    todos: data.seededTodos
  });
});

```

**Inside of our `todos/index.hbs` file**, add a form with just a delete button.

```html
<h1> Todos </h1>
<ul>
  {{#each todos}}
    <li>Description: {{description}}</li>
    <li>Urgent: {{urgent}}</li>
    <br>
    <form action="/todos/{{@index}}">
      <input type="submit" value="DELETE"/>
    </form>
  {{/each}}
</ul>

```

When we click "DELETE" on our index page (index.hbs), the form needs to make a DELETE request to our DELETE route.

Click the button and watch your server logs in the terminal. Where did the request go?

The problem is that forms can't make DELETE requests.  Only POST and GET requests.  There is a way around this fact.  First, we need to install an npm package called `method-override`.

```
npm install method-override --save
```

Now, in our `server.js` file, add:

```javascript
// include the method-override package
var methodOverride = require('method-override');
//...
// after the app has been defined
// use methodOverride.  We will be adding a query parameter to our delete form named _method
app.use(methodOverride('_method'));
```

Now, go back and set up the delete form to send a DELETE request to the appropriate route

```html
<form action="/todos/{{@index}}?_method=DELETE" method="POST">
```

### Why do we use a POST request with method override?

Several reasons:

1. When HTML and HTTP were first specked out there wasn't a real user story around Updating and Deleting, or even Posting content. Updates and deletions were made by the authors of the content, not by external users. Initially, HTTP was simply a GET method.

2. As the internet developed into something closer to what we understand it to be now, HTTP added PUT and DELETE methods in 1997 (HTTP/1.1). HTML was not updated to handle them, so developers created workarounds to allow web users to still make PUT and DELETE requests using POST as the thoroughfare.

3. These workarounds are now so ubiquitous (often included by default in frameworks) that providing a solution in HTML has become redundant.

You can read the conversation about adding PUT and DELETE form functionality to HTML5 [here](https://www.w3.org/Bugs/Public/show_bug.cgi?id=10671)

4. A more technical reason does exist, if it gives you any solace.
  - A PUT request wouldn't look any different than a post, the data still needs to be sent in the body vs. the header. Therefore, the server would still need some kind of flag to differentiate between a PUT and POST request, otherwise the requests look the same and provide a similar output.
  - A DELETE request, doesn't have any data or content in the body. Forms add data to the body of an HTTP request, so making an HTML form have DELETE functionality also doesn't really make sense.

<br />

## Update

### Create an Edit Route

In our `controllers/todos_controller.js`, create a **GET route** that will display an edit form for a single todo item.

```javascript
router.get('/:id/edit', function(req, res){
  res.render('todos/edit', {
    todo: {
      id: req.params.id
      description: data.seededTodos[req.params.id].description,
      urgent: data.seededTodos[req.params.id].urgent,
    }
  });
});
```

Now create an edit.hbs file in your views folder, and then create a very basic form for editing in the `views/edit.hbs`.

```html
<h1>Edit {{todo.description}}</h1>

<div class="row">
  <form class="col-md-6 col-md-offset-3">
    <div class="form-group">
      <label for="description">description:</label>
      <input type="text" name="description" class="form-control" value="{{todo.description}}">
    </div>
    <div class="form-group">
      <label for="location">location:</label>
      <input type="text" name="location" class="form-control" value="{{todo.location}}">
    </div>
    <div class="form-group">
      <label for="urgent">urgent:</label>
      <input type="text" name="urgent" class="form-control" value="{{todo.urgent}}" />
    </div>
    <div>
      <input type="submit" value="Update Todo" class="btn btn-default">
    </div>
  </form>
</div>
```

<!-- <form >
  <input type="text" name="description" value="{{todo.description}}" />
  <input type="text" name="urgent" value="{{todo.urgent}}" />
  <input type="submit" value="Submit Changes"/>
</form> -->

### Create a Link to the Edit Route

Inside our `index.hbs` file, add a link to our edit route that passes in the index/id of that item in the url

```html
<h1> Todos </h1>
<ul>
  {{#each todos}}
    <li>Description: {{description}}</li>
    <li>Urgent: {{urgent}}</li>
    <br>
    <div><a href="/todos/{{@index}}/edit">Edit</a></div>
    <form action="/todos/{{@index}}">
      <input type="submit" value="DELETE"/>
    </form>
    <hr>
  {{/each}}
</ul>
```

### Create an Update Route

In order to UPDATE an item, we use the HTTP verb **PUT**.

Inside the `todos_controller.js` add the following:

```javascript
router.put('/:id', function(req, res) {
  var todoToEdit = data.seededTodos[req.params.id];

  todoToEdit.description = req.body.description;
  todoToEdit.urgent = req.body.urgent;

  res.redirect('/todos');
})
```

### Make the Edit Page Send a PUT Request

Check the server logs. What happens when we submit our changes?

When we click on the "Submit Changes" button on our edit page (edit.hbs), the form needs to make a PUT request to our update route.

```html
<div class="row">
  <form action="/todos/{{todo.id}}" method="" class="col-md-6 col-md-offset-3">
    <div class="form-group">
      <label for="description">description:</label>
      <input type="text" name="description" class="form-control" value="{{todo.description}}">
    </div>
    <div class="form-group">
      <label for="location">location:</label>
      <input type="text" name="location" class="form-control" value="{{todo.location}}">
    </div>
    <div class="form-group">
      <label for="urgent">location:</label>
      <input type="text" name="urgent" class="form-control" value="{{todo.urgent}}" />
    </div>
    <div>
      <input type="submit" value="Update Todo" class="btn btn-default">
    </div>
  </form>
</div>
```

The problem is that forms can't make PUT requests.  Only POST and GET requests.  So we need to use method-override again.

Now go back and set up our edit form to send a PUT request.

```html
<form action="/todos/{{todo.id}}?_method=PUT" method="POST" class="col-md-6 col-md-offset-3">
```

<br />

### Codealong

Now that we see from the attached example how we can work with the Views and change data in a static array we used as seed data. Now we will move on to implimenting the model and making sure our controller works with our model and our live database. The full CRUD operations will be performed on the model. The views will be rendered using HBS and an additional method-modifier package so as we can use forms to make Delete and Put requests which are not the defaults for the form operations.
