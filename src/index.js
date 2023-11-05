import 'notiflix';
import Notiflix from 'notiflix';
import { searchImages } from './js/api';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const endMessage = document.querySelector('.end-message'); // Повідомлення про кінець результатів
let page = 1;
let query = '';

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  query = searchForm.searchQuery.value;
  page = 1;
  clearGallery();
  await performSearch(query, page);
});

loadMoreButton.addEventListener('click', async () => {
  page++;
  await performSearch(query, page);
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
    endMessage.style.display = 'none';
  } else {
    loadMoreButton.style.display = 'block';
  }
};

const performSearch = async (searchQuery, page) => {
  if (!searchQuery.trim()) {
    notiflix.Notify.warning('Please enter a search keyword.');
    return;
  }

  const data = await searchImages(searchQuery, page);

  if (data) {
    if (data.totalHits > 0) {
      notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      displayImages(data.hits);

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
      loadMoreButton.style.display = 'none';
      endMessage.style.display = 'none';
    }

    if (data.totalHits <= page * data.hits.length) {
      loadMoreButton.style.display = 'none';
      endMessage.style.display = 'block';
    } else {
      endMessage.style.display = 'none';
    }
  }
};
