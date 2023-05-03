import axios from 'axios';
const API_KEY = '35939977-4cb2344a1a4537c5389641f6d';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const options = {
      params: {
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '40',
        page: this.page.toString(),
        key: API_KEY,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(BASE_URL, options);

    this.incrementPage();

    const results = {
      hits: response.data.hits,
      total: response.data.totalHits,
    };
    return results;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
