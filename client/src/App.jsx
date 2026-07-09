import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [searchTerm , setSearchTerm ] = useState('');
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)

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
  }, [])

  if (loading) return <div className="app"><h1>StreamHub 🎬</h1><p>Loading movies...</p></div>
  if (error) return <div className="app"><h1>StreamHub 🎬</h1><p>{error}</p></div>

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <h1>StreamHub 🎬</h1>
      <input 
        type="text"
        placeholder='Search Movies...'
        value = {searchTerm}
        onChange={(e) => {setSearchTerm(e.target.value)}}
        className='search-bar'
      />
      <div className="movie-list">
        {
        filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card"
            onClick={() => setSelectedMovie(movie)}
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
            <button onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App