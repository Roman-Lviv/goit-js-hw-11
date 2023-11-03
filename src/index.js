import { searchImages } from './js/api';

import Notiflix from 'notiflix';
import 'notiflix';

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

  const lightbox = new SimpleLightbox('.gallery a', {
    /* параметри для SimpleLightbox */
  });

  if (images.length === 0) {
    loadMoreButton.style.display = 'none';
    notiflix.Notify.failure(
      'На жаль, не знайдено зображень, що відповідають вашому запиту. Спробуйте ще раз.'
    );
  } else {
    loadMoreButton.style.display = 'block';
  }
};

const performSearch = async (searchQuery, page) => {
  if (!searchQuery.trim()) {
    notiflix.Notify.warning('Введіть ключове слово для пошуку.');
    return;
  }

  const data = await searchImages(searchQuery, page);

  if (data) {
    if (data.totalHits > 0) {
      displayImages(data.hits);

      if (page === 1) {
        notiflix.Notify.success(`Ура! Ми знайшли ${data.totalHits} зображень.`);
      }

      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } else {
      notiflix.Notify.failure(
        'На жаль, не знайдено зображень, що відповідають вашому запиту. Спробуйте ще раз.'
      );
    }

    if (data.totalHits <= page * data.hits.length) {
      loadMoreButton.style.display = 'none';
      notiflix.Notify.warning(
        'На жаль, ви дійшли до кінця результатів пошуку.'
      );
    }
  }
};
