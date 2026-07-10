const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use( cors() ); 
app.use( express.json() );  // middleware


// Creating Middleware
// function checkAuth(req, res, next){
//     const token = req.headers['Aruthorization'];
//     if( !token ){
//         res.status(400).json({
//             "success" : false ,
//             "message" : "Aceess Denied! Token is not present."
//         });
//     }
//     next(); 
// }

const movies = [
    { id : 1 , title : "Bhoot Bangla" , genre : "Comedy-Horor" },
    { id : 2 , title : "Rab ne bna di Jodi" , genre : "Romantic" },
    { id : 3 , title : "Welcome to the Jungle" , genre : "Comedy" },
    { id : 4 , title : "Bodygaurd" , genre : "Romantic" },
    { id : 4 , title : "Dilwale Dulhaniya le Jayenge" , genre : "Romantic" },
];

app.get('/' , (req , res) => {
    res.send("Streaming API is runing!");
});

// Get all movies
app.get('/api/movies' , (req , res) => {
    res.json(movies);
});

// Get single movie by id
app.get('/api/movies/:id'  , (req , res) => {
    const movie = movies.find( m => m.id === parseInt(req.params.id));
    if( !movie ){
        return res.status(404).json({ "error" : "Movie not found!"});
    }

    res.json(movie);
});

app.post('/api/movies' , (req , res) => {
    const {title , genre , desc } = req.body ; 

    if( !title || !genre ){
        return res.status(400).json({ error : "Title and genre are required" });
    }

    const newMovie = {
        id : movies.length + 1 , 
        title,
        genre, 
        desc : desc || "No description available" 
    }; 

    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.listen(PORT , () => {
    console.log( `Server running on the http://localhost:${PORT}`);
});