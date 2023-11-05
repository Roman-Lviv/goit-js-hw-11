import Notiflix from 'notiflix';
import { searchImages } from './js/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init();

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let page = 1;
let query = '';

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  query = searchForm.searchQuery.value.trim();
  page = 1;
  clearGallery();
  if (!query) return;
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

  const cardMarkup = images.map(image => cardTemplate(image)).join('');

  gallery.innerHTML = cardMarkup;

  const lightbox = new SimpleLightbox('.gallery a', {});

  if (images.length === 0) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.failure(
      'На жаль, не знайдено зображень, що відповідають вашому запиту. Спробуйте ще раз.'
    );
  } else {
    loadMoreButton.style.display = 'block';
  }
};

const performSearch = async (searchQuery, page) => {
  if (!searchQuery) {
    Notiflix.Notify.warning('Введіть ключове слово для пошуку.');
    return;
  }

  try {
    const data = await searchImages(searchQuery, page);

    if (data) {
      if (data.totalHits > 0) {
        displayImages(data.hits);

        if (page === 1) {
          Notiflix.Notify.success(
            `Ура! Ми знайшли ${data.totalHits} зображень.`
          );
        }

        const { height: cardHeight } =
          gallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      } else {
        Notiflix.Notify.failure(
          'На жаль, не знайдено зображень, що відповідають вашому запиту. Спробуйте ще раз.'
        );
      }

      const lastPage = Meth.ceil(data.totalHits / 40);

      if (lastPage == page) {
        loadMoreButton.style.display = 'none';
        Notiflix.Notify.warning(
          'На жаль, ви дійшли до кінця результатів пошуку.'
        );
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Сталася помилка під час пошуку зображень. Спробуйте ще раз.'
    );
    console.error('Помилка під час пошуку зображень:', error);
  }
};
