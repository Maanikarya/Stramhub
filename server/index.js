const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use( cors() ); 
app.use( express.json() );  // middleware


// Creating Middleware for Authentication
function verifyToken( req , res , next )
{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if( !token ){
        return res.status(401).json({error : "No token provided"});
    }

    jwt.verify( token , SECRET_KEY , (err , decoded) => {
        if( err ){
            return res.status(403).json({error : "Invalid or expire token"});
        }

        req.user = decoded; // decoded data (userId , email) will send in the req.user
        next(); 
    });
}

const movies = [
    { id: 1, title: "Bhoot Bangla", genre: "Comedy-Horror" },
    { id: 2, title: "Rab Ne Bana Di Jodi", genre: "Romance" },
    { id: 3, title: "Welcome to the Jungle", genre: "Comedy" },
    { id: 4, title: "Bodyguard", genre: "Romance" },
    { id: 5, title: "Dilwale Dulhania Le Jayenge", genre: "Romance" },
    { id: 6, title: "3 Idiots", genre: "Comedy-Drama" },
    { id: 7, title: "Kabir Singh", genre: "Drama" },
    { id: 8, title: "Dangal", genre: "Sports-Drama" },
    { id: 9, title: "Pathaan", genre: "Action" },
    { id: 10, title: "Stree", genre: "Comedy-Horror" },
    { id: 11, title: "Drishyam", genre: "Thriller" },
    { id: 12, title: "Zindagi Na Milegi Dobara", genre: "Adventure-Drama" }
];

const bycrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'my_super_secret_key_change_this_in_production';

const users = [];

app.post('/api/signup' , async(req , res) => {
    const { email , password } = req.body; 

    if( !email ||  !password ){
        return res.status(400).send({error : "Email and password required!"});
    }

    const existingUser = users.find( u => u.email === email );

    if ( existingUser ){
        return res.status(400).send({error : "User already exist"});
    }

    const hashPassword = await bycrpt.hash(password , 10);

    const newUser = { id : users.length+1 , email , password : hashPassword};
    users.push(newUser);

    res.status(201).send({message : "User Created Successfully"});

});

app.post('/api/login' , async(req , res) => {
    const {email , password} = req.body; 

    if( !email ||  !password ){
        return res.status(400).send({error : "Email and password required!"});
    }

    const user = users.find( u => u.email === email );

    if( !user ){
        return res.status(400).send({error : "Invalid Credentials"});
    }

    const isPasswordValid = await bycrpt.compare( password , user.password );
    if (!isPasswordValid  ){
        return res.status(400).send({message : "Invalid Credentials"});
    }

    const token = jwt.sign({ userId : user.id , email : user.email } , SECRET_KEY , { expiresIn : '1h' });
    res.status(201).send({message : "User is Successfully Login" , token , email : user.email});
});

app.get('/' , (req , res) => {
    res.send("Streaming API is runing!");
});

// Get all movies
app.get('/api/movies'  ,  (req , res) => {
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

app.post('/api/movies' , verifyToken , (req , res) => {
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

app.get('/api/movies/:id/recommendations' , (req, res)=>{
    const movie = movies.find( m => m.id === parseInt(req.params.id));

    if( !movie ){
        return res.status(404).json({ error : "Movie not found" });
    }

    const recommendations = movies
                        .filter( m => m.id !== movie.id && m.genre === movie.genre)
                        .slice(0,3);
    
    res.json({
        basedOn : movie.title,
        recommendations
    });
});

app.listen(PORT , () => {
    console.log( `Server running on the http://localhost:${PORT}`);
});