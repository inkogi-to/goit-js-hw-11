import axios from "axios";


const BASE_URL = "https://pixabay.com/api/"
const KEY = "29655136-df87d1ad5ef93725220582361"
export default class PixelBayApiService {
  constructor() {
    this.searchQuery = ''
    this.totalHits = ''
    this.page = 1
    this.per_page = 40
  }

  async getArticles() {
    try {
      const options = {
        params: {
          key: KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: this.per_page,
          page: this.page
        }
      }

      const res = await axios.get(BASE_URL, options)
      this.incrementPage()
      return res.data


    } catch (err) {
      this.resetPage()
    }

  }


  get query() {
    return this.searchQuery
  }

  set query(newQuery) {
    this.searchQuery = newQuery
  }

  resetPage() {
    this.page = 1
  }

  incrementPage() {
    this.page++;
  }


}