import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

//Memory Data
let items = [
    {
      id: 1,
      title: "Web Development",
      content:
        "JavaScript -> Node , Express, npm, EJS; SpringBoot, Tailwind",
      time: "4 Hours",
      date: "2025-1-30T10:00:00Z",
    },
    {
      id: 2,
      title: "App Development",
      content: "Java, FireStore ",
      time: "5 Hours",
      date: "2024-12-07T14:30:00Z",
    },
    
  ];
  let lastId = 2;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Get all Items
app.get("/items", (req, res) =>{
    console.log(items);
    res.json(items);
});

//Get Specific Item by id
app.get("/items/:id" , (req , res) => {
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if(!item) return res.status(404).json({message: "Post Not Found"});
    res.json(item);
});

//Post a new Item 
app.post("/items", (req , res) =>{
    const newId = lastId +1;
    const item ={
        id: newId,
        title: req.body.title,
        content: req.body.content,
        time: req.body.time,
        date: new Date(),
    };
    lastId = newId;
    items.push(item);
    res.status(201).json(item);
});

// Patch a post when you just want to update one parameter
app.patch("/items/:id", (req , res) =>{
    const item = items.find((i) => i.id === parseInt(req.params.id));
    if(!item) return res.status(404).json({message: "Item Not Exist"});
    if(res.body.title) item.title = req.body.title;
    if(res.body.content) item.content = req.body.content;
    if(res.body.time) item.time = req.body.time;
    res.json(item);
})

//Delete
app.delete("/items/:id", (req , res) => {
    const index = items.findIndex((i) => i.id === parseInt(req.params.id));
    if(index === -1) return res.status(404).json({message: "Item Bot Exist"});
    items.splice(index, 1);
    res.json({message: "Item Deleted"});
});
  

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
