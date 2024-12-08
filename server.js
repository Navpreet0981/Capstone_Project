import express from"express";
import bodyParser  from "body-parser";
import axios from "axios";

const app = express();
const port = 8000;
const API_URL = "http://localhost:4000"

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", async(req, res) =>{
    try{
        const response = await axios.get(`${API_URL}/items`);
        console.log(response);
        res.render("index.ejs", {items: response.data});
    }catch(error)
    {
        res.status(500).json({message: "Error While Fetching Data"});
    }
});

//Route And Ender Edit Page
app.get("/new", (req , res)=>{
    res.render("modify.ejs", {
        heading: "Add New Item", submit:"Create Item"
    });
});

app.get("/edit/:id", async(req , res)=>{
    try{
        const response = await axios.get(`${API_URL}/items/${req.params.id}`);
        console.log(response.data);
        res.render("modify.ejs", {
            heading: "Edit Item",
            submit: "Update Item",
            item: response.data,
            });
    }catch(error){
        res.status(500).json({message: "Error Fetching Post"});
    }
});


//Create New Item
app.post("/api/items", async(req , res) =>{
    try{
        const response = await axios.post(`${API_URL}/items`, req.body)
        console.log(response.data);
        res.redirect("/");
    }catch(error){
        res.status(500).json({message: "Error Creating Post"});
    }
});

//Partially Update 
app.post("/api/items/:id" , async(req , res) => {
    console.log("called");
    try{
        const response = await axios.patch(`
            ${API_URL}/items/${req.params.id}`,
        res.body);
    }catch(error){
        res.status(500).json({message:"Error Updating item"})
    }
});

//Delete Item
app.get("/api/items/delete/:id", async( req, res) =>{
    try{
        await axios.delete(`${API_URL}/items/${req.params.id}`);
        res.redirect("/");
    }catch(error){
        res.status(500).json({message: "Error Deleting Item"});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});