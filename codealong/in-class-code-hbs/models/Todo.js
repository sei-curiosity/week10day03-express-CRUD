let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/todos', {useNewUrlParser: true,
useUnifiedTopology: true})
let db = mongoose.connection
db.on('error', (err) => console.log(err)) //to see any errors during connection
db.once('open', ()=> console.log("Database successfully connected"))  //successful connection

let Schema = mongoose.Schema

let TodoSchema = new Schema ({
    description: String,
    urgent: Boolean
})

let TodoModel = mongoose.model("Todo", TodoSchema)

module.exports = TodoModel