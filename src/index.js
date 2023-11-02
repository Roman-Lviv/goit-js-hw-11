const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let query = '';

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  query = searchForm.searchQuery.value;
  page = 1;
  clearGallery();
  searchImages(query);
});

loadMoreButton.addEventListener('click', () => {
  page++;
  searchImages(query);
});

const clearGallery = () => {
  gallery.innerHTML = '';
};

const displayImages = images => {
  const cardTemplate = image => `
        <div class="photo-card">
            <a href="${image.largeImageURL}" data-lightbox="gallery" data-title="${image.tags}">
                <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes:</b> ${image.likes}</p>
                <p class="info-item"><b>Views:</b> ${image.views}</p>
                <p class="info-item"><b>Comments:</b> ${image.comments}</p>
                <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
            </div>
        </div>
    `;

  images.forEach(image => {
    gallery.innerHTML += cardTemplate(image);
  });

  const lightbox = new SimpleLightbox('.gallery a', {});

  if (images.length === 0) {
    loadMoreButton.style.display = 'none';
    notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    loadMoreButton.style.display = 'block';
  }
};

const searchImages = async searchQuery => {
  const apiKey = 'YOUR_API_KEY';
  const perPage = 40;

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.totalHits > 0) {
      displayImages(data.hits);

      if (page === 1) {
        notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } else {
      notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (data.totalHits <= page * perPage) {
      loadMoreButton.style.display = 'none';
      notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
