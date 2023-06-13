function fetchBooks(searchQuery) {
    const apiUrl = `https://openlibrary.org/search.json?q=${searchQuery}&has_cover=true&limit=200`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const booksContainer = document.getElementById('books-container');
        booksContainer.innerHTML = ''; 
  
        data.docs.forEach(doc => {
          if (!doc.hasOwnProperty('cover_i')) {
            return; 
          }
  
          const bookTitle = doc.title;
          const bookCoverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
  
          const numCopies = Math.floor(Math.random() * 10) + 1; 
          let availability = numCopies > 1 ? 'Available' : 'Not Available'; 
  
          const bookElement = document.createElement('div');
          bookElement.classList.add('book');
  
          const coverElement = document.createElement('img');
          coverElement.src = bookCoverUrl;
  
          const titleElement = document.createElement('h3');
          titleElement.textContent = bookTitle;
  
          const bookDetailsElement = document.createElement('div');
          bookDetailsElement.classList.add('book-details');
          bookDetailsElement.innerHTML = `
            <p>Author: ${doc.author_name ? doc.author_name.join(', ') : 'Unknown'}</p>
            <p>First Published: ${doc.first_publish_year ? doc.first_publish_year : 'Unknown'}</p>
            <p>Number of Copies: <span class="num-copies">${numCopies}</span></p>
            <p>Availability: <span class="availability">${availability}</span></p>
            <button class="add-to-cart-btn">Add to Cart</button>
          `;
  
          bookElement.appendChild(coverElement);
          bookElement.appendChild(titleElement);
          bookElement.appendChild(bookDetailsElement);
  
          booksContainer.appendChild(bookElement);
        });
  
        
        document.getElementById('loading-container').style.display = 'none';
        booksContainer.style.display = 'flex';
  
       
        updateCartCount(0);
      })
      .catch(error => {
        console.error('Error:', error);
     
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('books-container').innerHTML = 'Error fetching book details. Please try again later.';
        document.getElementById('books-container').style.display = 'flex';
      });
  }
  
  function fetchSuggestions(searchQuery) {
    const apiUrl = `https://openlibrary.org/search.json?q=${searchQuery}&limit=5`;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const searchSuggestions = document.getElementById('search-suggestions');
        searchSuggestions.innerHTML = ''; 
  
        const ulElement = document.createElement('ul');
  
       
        data.docs.forEach(doc => {
          const liElement = document.createElement('li');
          liElement.textContent = doc.title;
  
          liElement.addEventListener('click', function() {
            const searchInput = document.getElementById('search-input');
            searchInput.value = doc.title;
            fetchBooks(doc.title);
            searchSuggestions.innerHTML = ''; 
          });
  
          ulElement.appendChild(liElement);
        });
  
        searchSuggestions.appendChild(ulElement);
  
        // Show the search suggestion box
        searchSuggestions.style.opacity = '1';
        searchSuggestions.style.visibility = 'visible';
      })
      .catch(error => console.error('Error:', error));
  }
  
  function closeSuggestions() {
    const searchSuggestions = document.getElementById('search-suggestions');
    searchSuggestions.innerHTML = ''; 
    searchSuggestions.style.opacity = '0';
    searchSuggestions.style.visibility = 'hidden';
  }
  
  
  document.addEventListener('click', function(event) {
    const searchSuggestions = document.getElementById('search-suggestions');
    const isClickInsideSuggestions = searchSuggestions.contains(event.target);
    if (!isClickInsideSuggestions) {
      closeSuggestions();
    }
  });
  
  // Handle form submission
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
  
    const searchQuery = searchInput.value;
    fetchBooks(searchQuery);
  });
  
  
  searchInput.addEventListener('input', function() {
    const searchQuery = this.value;
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      const initialSearchQuery = 'Fiction'; 
      fetchBooks(initialSearchQuery);
    }
  });
  
  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
      const numCopiesElement = event.target.parentNode.querySelector('.num-copies');
      const availabilityElement = event.target.parentNode.querySelector('.availability');
  
      let numCopies = parseInt(numCopiesElement.textContent);
      let availability = availabilityElement.textContent;
  
      if (numCopies > 1) {
        numCopies--;
        numCopiesElement.textContent = numCopies;
        availabilityElement.textContent = 'Available';
      } else {
        availabilityElement.textContent = 'Not Available';
        event.target.disabled = true;
      }
  
      updateCartCount(1);
      alert('Book added to cart successfully!');
    }
  });
  
  
  window.addEventListener('load', function() {
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.style.display = 'flex';
  
    
    setTimeout(fetchBooks, 500, 'Fiction');
  });
  
  
  setTimeout(function() {
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.style.display = 'none';
    document.body.style.opacity = '1';
  }, 3000);
  
  
  function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    const currentCount = parseInt(cartCountElement.textContent);
    cartCountElement.textContent = currentCount + count;
  }
  
  
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('book')) {
      const bookElement = event.target;
      const overlayElement = document.getElementById('overlay');
      const overlayContentElement = document.getElementById('overlay-content');
      const bookDetailsElement = bookElement.querySelector('.book-details');
  
      overlayContentElement.innerHTML = bookDetailsElement.innerHTML;
  
      overlayElement.style.display = 'block';
      overlayContentElement.style.display = 'block';
    }
  });
  
  
  document.getElementById('overlay').addEventListener('click', function(event) {
    if (event.target.classList.contains('close-btn') || event.target.id === 'overlay') {
      const overlayElement = document.getElementById('overlay');
      const overlayContentElement = document.getElementById('overlay-content');
  
      overlayElement.style.display = 'none';
      overlayContentElement.style.display = 'none';
    }
  });