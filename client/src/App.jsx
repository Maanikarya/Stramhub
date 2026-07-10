import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [searchTerm , setSearchTerm ] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [newTitle , setNewTitle] = useState("");
  const [newGenre , setNewGenre] = useState("");
  const [token , setToken ] = useState(null);
  const [email , setEmail ] = useState('');
  const [password , setPassword] = useState('');
  const [recommendations , setRecommendations] = useState([]);


  useEffect(() => {
    fetch('http://localhost:5000/api/movies')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data)
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load movies')
        setLoading(false)
        console.log(err);
      })
  }, []);

  const fetchrecommendations = async (movieId) => {
    const response = await fetch(`http://localhost:5000/api/movies/${movieId}/recommendations`);
    const data = await response.json();
    setRecommendations(data.recommendations);
  }



  const handleMovie = async(e) => {
    e.preventDefault();

    if( !newTitle.trim() || !newGenre.trim() ){
      alert(' Title and genre are required ');
      return;
    }

    const response = await fetch('http://localhost:5000/api/movies' , {
      method : 'POST',
      headers : { 
        'Content-Type' : 'application/json' ,
        'Authorization' : `Bearer ${token}`
      },
      body : JSON.stringify({ title : newTitle , genre : newGenre })
    });

    if( !response.ok ){
      const errorData = await response.json();
      alert(errorData?.error || "Something Went Wrong ");
      return; 
    }

    const addedMovie = await response.json();
    setMovies([...movies , addedMovie]);
    setNewGenre('');
    setNewTitle(''); 
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/login' , {
      method : "POST",
      headers : { 'Content-Type' : 'application/json'},
      body : JSON.stringify({email , password})
    });

    if( !response.ok ){
      alert("Login failed");
      return;
    }

    const data = await response.json();
    setToken(data.token);
  }

  if (loading) return <div className="app"><h1>StreamHub 🎬</h1><p>Loading movies...</p></div>
  if (error) return <div className="app"><h1>StreamHub 🎬</h1><p>{error}</p></div>

  const filteredMovies = movies.filter((movie) =>
    movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>StreamHub 🎬</h1>

      {!token ? (
        <form action=""  onSubmit={handleLogin} className='add-form'>
            <input 
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
      ) : ( 
         <p>✅ Logged in!</p>
      )}
      <input 
        type="text"
        placeholder='Search Movies...'
        value = {searchTerm}
        onChange={(e) => {setSearchTerm(e.target.value)}}
        className='search-bar'
      />

      <form action="" onSubmit={handleMovie} className='add-form'>
        <input 
        type="text"
        placeholder='Movie Title'
        value = {newTitle}
        onChange={(e) => setNewTitle(e.target.value)} 
        />

        <input 
        type="text"
        placeholder='Movie Genre'
        value = {newGenre}
        onChange={(e) => setNewGenre(e.target.value)} 
        />

        <button type='submit'> Add Movies </button>
      </form>


      <div className="movie-list">
        {
        filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => {
               setSelectedMovie(movie) 
               fetchrecommendations(movie.id)
            } }
          >
            <h3>{movie.title}</h3>
            <p>{movie.genre}</p>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            <p className="modal-genre">{selectedMovie.genre}</p>
            <p>{selectedMovie.desc}</p>
            {recommendations.length > 0 && (
              <div className="recommendations">
                <h4>You might also like:</h4>
                {recommendations.map(r => <p key={r.id}>🎬 {r.title}</p>)}
              </div>
            )}
            <button onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App