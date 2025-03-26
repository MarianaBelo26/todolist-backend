const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
      text: String,
      isCompleted: Boolean
})

const ListSchema = new mongoose.Schema({
      name: String,
      tasks: [TaskSchema]
})

const List = mongoose.model('list', ListSchema)

module.exports = List
