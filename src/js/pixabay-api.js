import axios from 'axios';

const API_KEY = '46874695-aa87c3456f3cd5bd5c148909d';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;

export async function fetchImages(query) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  page += 1;
  return response.data.hits;
}

export function resetPage() {
  page = 1;
}
