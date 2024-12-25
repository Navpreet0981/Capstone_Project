import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import env from 'dotenv';

const app = express();
const port = 4000;
env.config();

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Get all Items
app.get("/items", async (req, res) =>{
  try{
    const result = await db.query("SELECT * FROM to_do_list");
    res.json(result.rows);
  }catch(err){
    console.error(err.message);
    res.status(500).json({message: "Error Fetching Items"});
  }
});

//Get Specific Item by id
app.get("/items/:id" , async (req , res) => {
    try{
      const result = await db.query("SELECT * FROM to_do_list WHERE id = $1",
        [req.params.id,]);

        if(result.rows.length === 0){
          return res.status(404).json({message: "Item Not Found"});
        }

        res.json(result.rows[0]);
    }catch(err){
      res.status(500).json({message: "Error Fetching Item"});
    }
});

//Post a new Item 
app.post("/items", async (req , res) =>{
   const {title, content, time} = req.body;
   try{
    const result = await db.query(
      "INSERT INTO to_do_list (title, content, time) VALUES($1, $2, $3) RETURNING *",
      [title, content, time]
    );
    res.status(201).json(result.rows[0]);
   }catch(err){
    console.error(err.message);
    res.status(500).json({message: "Error Adding Item"});
   }
});

// Patch a post when you just want to update one parameter
app.patch("/items/:id", async (req , res) =>{
   const {title, content, time} = req.body;
   try{
    const result = await db.query(
      `UPDATE to_do_list SET title = COALESCE($1,title),
                            content = COALESCE($2,content),
                            time = COALESCE($3,time)
                            WHERE id = $4 RETURNING *`,
                            [title, content, time, req.params.id]
    );

    if(result.rows.length === 0){
      return res.status(404).json({message: "Item Not Found"});
    }
    res.json(result.rows[0]);
   }catch(err){
    console.error(err.message);
    res.status(500).json({message: "Error Updating Item"});
   }
});

//Delete
app.delete("/items/:id", async (req , res) => {
    try{
      const result = await db.query(
        "DELETE FROM to_do_list WHERE id = $1 RETURNING *",
        [req.params.id]
      );
      if(result.rows.length === 0){
        return res.status(404).json({message: "Item Not Found"});
      }
      res.json({message: "Item Deleted", deletedItem: result.rows[0]});
    }catch(err){
      console.error(err.message);
      res.status(500).json({message: "Error Deleting Item"})
    }
});
  

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
