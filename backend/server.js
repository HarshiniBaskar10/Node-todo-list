const express=require('express') // to import the Express.js framework for building web applications and APIs
const cors=require('cors') // to enable CORS (Cross-Origin Resource Sharing) for the Express application
const app=express() //to create an express application
const PORT=3000 // to define the port number on which the server will listen for incoming requests
app.use(cors()) // to enable CORS for all routes in the Express application
app.use(express.json()) // to parse incoming JSON requests and make the data available in req.body

let tasks=[
    {
        id:1,text:"learn node.js",completed:false
    },
    {
        id:2,text:"learn express.js",completed:false
    },
    {
        id:3,text:"code my own server using express.js",completed:false
    }

]; // to define an array of task objects, each with an id, text, and completed status

app.get('/api/tasks',(req,res) =>{
    res.status(200).json(tasks); // to handle GET requests to the /api/tasks endpoint and respond with the tasks array in JSON format
})

app.post('/api/tasks',(req,res)=>{
    const {text}=req.body;
    if(!text){
        return res.status(400).json({error:"task is empty!!!"}) 
    }
    const newTask={
        id:Date.now(),
        text:text,
        completed:false
    };
    tasks.push(newTask);
    res.status(201).json(newTask); // to handle POST requests to the /api/tasks endpoint and respond with the newly created task in JSON format
})// to handle POST requests to the /api/tasks endpoint and validate the request body

app.patch('/api/tasks/:id',(req,res)=>{
    const taskId=Number(req.params.id);
    const task=tasks.find(t=>t.id===taskId);
    if(!task){
        return res.status(404).json({error:"task not found!!!"})
    }
    task.completed=!task.completed;
    res.status(200).json(task); // to handle PATCH requests to the /api/tasks/:id endpoint and respond with the updated task in JSON format
})// to handle PATCH requests to the /api/tasks/:id endpoint and toggle the completed status of the specified task

app.delete('/api/tasks/:id',(req,res)=>{
    const taskId=Number(req.params.id);
    tasks=tasks.filter(t=>t.id!==taskId);
    res.status(200).json({message: "task deleted successfully"});
    });    // to handle DELETE requests to the /api/tasks/:id endpoint and respond with a 204 No Content status

console.log(tasks)

app.listen(PORT,()=>{
    console.log("successfully started my express server")
 }) // to start the server and listen for incoming requests on the specified port