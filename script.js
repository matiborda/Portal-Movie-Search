const apiKey = '0462c13916ba229ebba5bae4c3158d07'; // Reemplaza 'TU_API_KEY' con tu clave real
const apiUrl = 'https://api.themoviedb.org/3/search/movie';

async function searchMovie() {
  const query = document.getElementById('search-input').value;
  if (!query) return;

  const url = `${apiUrl}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayMovies(movies) {
  const movieResults = document.getElementById('movie-results');
  movieResults.innerHTML = ''; // Limpiar resultados anteriores

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
    `;
    movieElement.addEventListener('click', () => showMovieDetails(movie.id));
    movieResults.appendChild(movieElement);
  });
}
async function showMovieDetails(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;
  
    try {
      const [movieResponse, providersResponse] = await Promise.all([
        fetch(url),
        fetch(providersUrl)
      ]);
  
      const movie = await movieResponse.json();
      const providersData = await providersResponse.json();
  
      const country = 'AR'; // Cambia 'AR' al código de país que quieras usar
      const providers = providersData.results[country]?.flatrate || [];
  
      const providersList = providers.map(provider => provider.provider_name).join(', ') || 'Not available';
  
      // Mostrar detalles en un modal
      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-button" onclick="closeModal()">×</span>
          <h2>${movie.title}</h2>
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          <p><strong>Release Date:</strong> ${movie.release_date}</p>
          <p><strong>Qualification:</strong> ${movie.vote_average}</p>
          <p><strong>Description:</strong> ${movie.overview}</p>
          <p><strong>Available in:</strong> ${providersList}</p>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Error al obtener detalles de la película:', error);
    }
  }
  
  function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
  }
  