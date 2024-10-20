import express from 'express';
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
