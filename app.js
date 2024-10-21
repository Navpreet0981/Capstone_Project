import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the "public" directory
app.use(express.static('public'));



let items= [];
app.post("/",(req, res) =>{
    const name = req.body.itemName;
    const time = req.body.itemTime;
    const date = req.body.itemDate;
    const description = req.body.itemDescription;

    items.push({name, time, date, description});
    res.redirect("/");
});
app.get("/", (req, res) => {
    console.log(items)
    res.render("index.ejs", { data: items});
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
