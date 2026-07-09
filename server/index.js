const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use( cors() ); 
app.use( express.json() ); 

const movies = [
    { id : 1 , title : "Bhoot Bangla" , genre : "Comedy-Horor" },
    { id : 2 , title : "Rab ne bna di Jodi" , genre : "Romantic" },
    { id : 3 , title : "Welcome to the Jungle" , genre : "Comedy" },
    { id : 4 , title : "Bodygaurd" , genre : "Romance" },
];

app.get('/' , (req , res) => {
    res.send("Streaming API is runing!");
});

// Get all movies
app.get('/api/movies' , (req , res) => {
    res.json(movies);
});

// Get single movie by id
app.get('/api/movies/:id' , (req , res) => {
    const movie = movies.find( m => m.id === parseInt(req.params.id));
    if( !movie ){
        return res.status(404).json({ "error" : "Movie not found!"});
    }

    res.json(movie);
});

app.listen(PORT , () => {
    console.log( `Server running on the http://localhost:${PORT}`);
});