import { fetchImages, resetPage } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');
const loader = document.querySelector('#loader');
let currentQuery = '';

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  currentQuery = event.target.searchQuery.value.trim();
  console.log('Форма подана');

  if (!currentQuery) {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query!' });
    return;
  }

  showLoader();
  clearGallery();
  resetPage();
  loadMoreBtn.style.display = 'none';

  try {
    const images = await fetchImages(currentQuery);
    console.log('Запит API пройшов успішно', images);
    if (images.length === 0) {
      iziToast.info({ title: 'Info', message: 'Sorry, there are no images matching your search query. Please try again!' });
    } else {
      renderImages(images);
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later!' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();

  try {
    const images = await fetchImages(currentQuery);
    console.log('Завантаження додаткових зображень', images);
    renderImages(images);
    
    if (images.length < 15) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({ title: 'Info', message: "We're sorry, but you've reached the end of search results." });
    }
    
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Something went wrong. Please try again later!' });
  } finally {
    hideLoader();
  }
});
