const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : 'https://stockfreeimage.onrender.com/api';


let currentUser = null;
let token = localStorage.getItem('token');
    let currentPage = 1;
    let currentQuery = '';
    let selectedImage = null;

    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userMenu = document.getElementById('user-menu');
    const usernameSpan = document.getElementById('username');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const showMoreButton = document.getElementById('show-more-button');
    const favoritesContainer = document.getElementById('favorites-container');
    const playlistsContainer = document.getElementById('playlists-container');
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const createPlaylistModal = document.getElementById('create-playlist-modal');
    const addToPlaylistModal = document.getElementById('add-to-playlist-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const createPlaylistForm = document.getElementById('create-playlist-form');
    const addToPlaylistForm = document.getElementById('add-to-playlist-form');

    document.addEventListener('DOMContentLoaded', () => {
      checkAuthStatus();
      if (token) {
        loadFavorites();
        loadPlaylists();
      }
    });

    async function checkAuthStatus() {
      if (token) {
        try {
          const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            currentUser = { name: data.name };
            updateUIForAuth(true);
          } else {
            throw new Error('Invalid token');
          }
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          token = null;
          updateUIForAuth(false);
        }
      } else {
        updateUIForAuth(false);
      }
    }

    function updateUIForAuth(isAuthenticated) {
      if (isAuthenticated) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        usernameSpan.textContent = currentUser.name || 'User';
      } else {
        loginBtn.classList.remove('hidden');
        registerBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
        favoritesContainer.innerHTML = '<p>Please log in to view favorites.</p>';
        playlistsContainer.innerHTML = '<p>Please log in to view playlists.</p>';
      }
    }

    loginBtn.addEventListener('click', () => {
      loginModal.style.display = 'flex';
    });

    registerBtn.addEventListener('click', () => {
      registerModal.style.display = 'flex';
    });

    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal.style.display = 'none';
      registerModal.style.display = 'flex';
    });

    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerModal.style.display = 'none';
      loginModal.style.display = 'flex';
    });

    createPlaylistBtn.addEventListener('click', () => {
      if (!token) {
        alert('Please login to create playlists');
        loginModal.style.display = 'flex';
        return;
      }
      createPlaylistModal.style.display = 'flex';
    });

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
        createPlaylistModal.style.display = 'none';
        addToPlaylistModal.style.display = 'none';
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.style.display = 'none';
      if (e.target === registerModal) registerModal.style.display = 'none';
      if (e.target === createPlaylistModal) createPlaylistModal.style.display = 'none';
      if (e.target === addToPlaylistModal) addToPlaylistModal.style.display = 'none';
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          token = data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('userName', data.name); // Store name for fallback
          currentUser = { name: data.name };
          updateUIForAuth(true);
          loginModal.style.display = 'none';
          loginForm.reset();
          loadFavorites();
          loadPlaylists();
          alert(`Welcome, ${data.name}!`);
        } else {
          alert(data.message || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      try {
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
          token = data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('userName', data.name); // Store name for fallback
          currentUser = { name: data.name };
          updateUIForAuth(true);
          registerModal.style.display = 'none';
          registerForm.reset();
          loadFavorites();
          loadPlaylists();
          alert(`Welcome, ${data.name}!`);
        } else {
          alert(data.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
      }
    });

    logoutBtn.addEventListener('click', () => {
      token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      currentUser = null;
      updateUIForAuth(false);
      searchResults.innerHTML = '';
      showMoreButton.classList.add('hidden');
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        searchInput.value = category;
        performSearch();
      });
    });

    async function performSearch() {
      currentQuery = searchInput.value.trim();
      if (!currentQuery) {
        searchResults.innerHTML = '<p>Please enter a search term.</p>';
        return;
      }
      if (!token) {
        alert('Please login to search images');
        loginModal.style.display = 'flex';
        return;
      }

      currentPage = 1;
      searchResults.innerHTML = '<p>Searching...</p>';

      try {
        const response = await fetch(`${API_BASE}/images/search?query=${encodeURIComponent(currentQuery)}&page=${currentPage}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          displaySearchResults(data.results || []);
          showMoreButton.classList.toggle('hidden', !data.results || data.results.length === 0);
        } else {
          throw new Error(data.message || 'Search failed');
        }
      } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = `<p>Error searching images: ${error.message}. Please try again.</p>`;
      }
    }

    function displaySearchResults(images) {
      if (images.length === 0) {
        searchResults.innerHTML = '<p>No images found. Try a different search term.</p>';
        return;
      }

      searchResults.innerHTML = '';
      images.forEach(image => {
        const imageCard = createImageCard(image, false);
        searchResults.appendChild(imageCard);
      });
    }

    showMoreButton.addEventListener('click', async () => {
      currentPage++;
      try {
        const response = await fetch(`${API_BASE}/images/search?query=${encodeURIComponent(currentQuery)}&page=${currentPage}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          data.results.forEach(image => {
            const imageCard = createImageCard(image, false);
            searchResults.appendChild(imageCard);
          });
        } else {
          throw new Error(data.message || 'Failed to load more images');
        }
      } catch (error) {
        console.error('Load more error:', error);
        searchResults.innerHTML += `<p>Error loading more images: ${error.message}.</p>`;
      }
    });

    async function loadFavorites() {
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          displayFavorites(data);
        } else {
          throw new Error(data.message || 'Failed to load favorites');
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        favoritesContainer.innerHTML = `<p>Error loading favorites: ${error.message}.</p>`;
      }
    }

    function displayFavorites(favorites) {
      favoritesContainer.innerHTML = '';
      if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorites yet. Start adding some!</p>';
        return;
      }

      favorites.forEach(favorite => {
        const imageCard = createImageCard(favorite, true);
        favoritesContainer.appendChild(imageCard);
      });
    }

    async function addToFavorites(image) {
      if (!token) {
        alert('Please login to add favorites');
        loginModal.style.display = 'flex';
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: image.id,
            url: image.urls.small,
            alt_description: image.alt_description,
            user: { name: image.user.name },
            links: { html: image.links.html },
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Added to favorites!');
          loadFavorites();
        } else {
          throw new Error(data.message || 'Failed to add favorite');
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        alert(`Failed to add to favorites: ${error.message}`);
      }
    }

    async function removeFromFavorites(imageId) {
      try {
        const response = await fetch(`${API_BASE}/favorites/${imageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          alert('Removed from favorites!');
          loadFavorites();
        } else {
          throw new Error(data.message || 'Failed to remove favorite');
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        alert(`Failed to remove from favorites: ${error.message}`);
      }
    }

    async function loadPlaylists() {
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE}/playlists`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          displayPlaylists(data);
        } else {
          throw new Error(data.message || 'Failed to load playlists');
        }
      } catch (error) {
        console.error('Error loading playlists:', error);
        playlistsContainer.innerHTML = `<p>Error loading playlists: ${error.message}.</p>`;
      }
    }

    function displayPlaylists(playlists) {
      playlistsContainer.innerHTML = '';
      if (playlists.length === 0) {
        playlistsContainer.innerHTML = '<p>No playlists yet. Create your first one!</p>';
        return;
      }

      playlists.forEach(playlist => {
        const playlistCard = createPlaylistCard(playlist);
        playlistsContainer.appendChild(playlistCard);
      });
    }

    createPlaylistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('playlist-name').value;

      try {
        const response = await fetch(`${API_BASE}/playlists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Playlist created!');
          createPlaylistModal.style.display = 'none';
          createPlaylistForm.reset();
          loadPlaylists();
        } else {
          throw new Error(data.message || 'Failed to create playlist');
        }
      } catch (error) {
        console.error('Error creating playlist:', error);
        alert(`Failed to create playlist: ${error.message}`);
      }
    });

    async function addImageToPlaylist(playlistId, image) {
      try {
        const response = await fetch(`${API_BASE}/playlists/${playlistId}/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: image.id,
            url: image.urls.small,
            alt_description: image.alt_description,
            user: { name: image.user.name },
            links: { html: image.links.html },
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Image added to playlist!');
          loadPlaylists();
          addToPlaylistModal.style.display = 'none';
        } else {
          throw new Error(data.message || 'Failed to add image to playlist');
        }
      } catch (error) {
        console.error('Error adding image to playlist:', error);
        alert(`Failed to add image to playlist: ${error.message}`);
      }
    }

    async function deletePlaylist(playlistId) {
      if (!confirm('Are you sure you want to delete this playlist?')) return;

      try {
        const response = await fetch(`${API_BASE}/playlists/${playlistId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          alert('Playlist deleted!');
          loadPlaylists();
        } else {
          throw new Error(data.message || 'Failed to delete playlist');
        }
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert(`Failed to delete playlist: ${error.message}`);
      }
    }

    async function showPlaylistSelection(image) {
      selectedImage = image;
      if (!token) {
        alert('Please login to add to playlists');
        loginModal.style.display = 'flex';
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/playlists`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          const select = document.getElementById('playlist-select');
          select.innerHTML = '';
          if (data.length === 0) {
            select.innerHTML = '<option value="">No playlists available</option>';
          } else {
            data.forEach(playlist => {
              const option = document.createElement('option');
              option.value = playlist._id;
              option.textContent = playlist.name;
              select.appendChild(option);
            });
          }
          addToPlaylistModal.style.display = 'flex';
        } else {
          throw new Error(data.message || 'Failed to fetch playlists');
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
        alert(`Error fetching playlists: ${error.message}`);
      }
    }

    addToPlaylistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const playlistId = document.getElementById('playlist-select').value;
      if (!playlistId) {
        alert('Please create a playlist first');
        return;
      }
      await addImageToPlaylist(playlistId, selectedImage);
    });

    function createImageCard(image, isFavorite) {
      const card = document.createElement('div');
      card.className = 'image-card';
      
      card.innerHTML = `
        <img src="${image.urls?.small || image.imageUrl || image.url}" alt="${image.alt_description || 'Image'}">
        <div class="image-info">
          <h3>${(image.alt_description || 'Untitled').substring(0, 30)}</h3>
          <p>By ${image.user?.name || image.photographer || 'Unknown'}</p>
          <div class="image-actions">
            <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}">
              <i class="fas fa-heart"></i>
            </button>
            <button class="action-btn add-to-playlist-btn">
              <i class="fas fa-folder-plus"></i>
            </button>
            <a href="${image.links?.html || image.unsplashLink || '#'}" target="_blank" class="action-btn">
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      `;

      const favoriteBtn = card.querySelector('.favorite-btn');
      favoriteBtn.addEventListener('click', () => {
        if (isFavorite) {
          removeFromFavorites(image._id || image.id);
        } else {
          addToFavorites(image);
        }
      });

      const addToPlaylistBtn = card.querySelector('.add-to-playlist-btn');
      addToPlaylistBtn.addEventListener('click', () => {
        showPlaylistSelection(image);
      });

      return card;
    }

    function createPlaylistCard(playlist) {
      const card = document.createElement('div');
      card.className = 'playlist-card';
      
      const thumbnails = playlist.images?.slice(0, 3) || [];
      
      card.innerHTML = `
        <div class="playlist-header">
          <div class="playlist-title">${playlist.name}</div>
          <button class="action-btn delete-playlist-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <div class="playlist-images">
          ${thumbnails.map(img => 
            `<img src="${img.imageUrl || img.url}" class="playlist-thumb" alt="Thumbnail">`
          ).join('')}
          ${thumbnails.length === 0 ? '<p>No images yet</p>' : ''}
        </div>
        <p class="mt-2">${playlist.images?.length || 0} images</p>
      `;

      const deleteBtn = card.querySelector('.delete-playlist-btn');
      deleteBtn.addEventListener('click', () => {
        deletePlaylist(playlist._id);
      });

      return card;
    }