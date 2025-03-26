require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const List = require('./models/List')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.get('/lists', async (req, res) => {
    try {
        const lists = await List.find()
        res.json(lists)
    } catch (err) {
        res.status(500).json(err)
    }
})

app.post('/lists', async (req, res) =>{
    try{
        const newList = await List.create({
            name: req.body.name,
            tasks: []
        })
        res.json(newList)
    }catch (err){
        res.status(500).json(err)
    }
})

app.delete('/lists/:listId', async (req, res) =>{
    try{
       const deletedList = await List.findByIdAndDelete(req.params.listId)

       if(!deletedList){
        return res.status(404).json({message: 'List not found'})
       }
       res.json(deletedList)
    }catch(err){
        res.status(500).json(err)
    }
})

app.post('/lists/:id/tasks', async (req, res) =>{
    try{
        const list = await List.findById(req.params.id)
        list.tasks.push({
            text: req.body.text,
            isCompleted: false
        })
        await list.save()
        res.json(list)
    }catch (err){
        res.status(500).json(err)
    }
})

app.put('/lists/:listId/tasks/:taskId', async (req, res) =>{
    try{
        const list = await List.findById(req.params.listId)
        const task = list.tasks.id(req.params.taskId)
        task.isCompleted = !task.isCompleted
        await list.save()
        res.json(list)
    }catch (err){
        res.status(500).json(err)
    }
})

app.delete('/lists/:listId/tasks/:taskId', async (req, res) =>{
    try{
        const list = await List.findById(req.params.listId)
        if(!list) return res.status(404).json({message: 'Lista não encontrada'})
        
        const taskIndex = list.tasks.findIndex(task => task._id.toString() === req.params.taskId)
        if(taskIndex === -1) return res.status(404)
        
        list.tasks.splice(taskIndex, 1)

        await list.save()
        res.json(list)
    }catch (err){
        res.status(500).json(err)
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server running in the Port ${process.env.PORT}`)
})