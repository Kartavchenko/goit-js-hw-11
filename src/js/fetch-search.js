import Axios from 'axios';

export default class ApiServicePixabay {
  constructor() {
      this.searchInput = '';
      this.page = 1;
  }

  async fetchPixabay() {
    const endPoint = 'https://pixabay.com/api/';
      const API_KEY = '29112190-958e52871e0e9d14dd5397067';
      const properties = 'image_type=photo&orientation=horizontal&safesearch=true'

      const fetchUrl = await fetch(
          `${endPoint}?key=${API_KEY}&q=${this.searchInput}&${properties}&per_page=40&page=${this.page}`
      )
      return fetchUrl.json()
    //       .then(response => {
    //       if (!response.ok) {
    //           throw new Error(response.status);
    //       }
    //       return response.json();
    //   });
    };

    resetPage() {
        this.page = 1;
    }

    accretionPage() {
        this.page += 1;
    }

  get quary() {
    return this.searchInput;
  }

  set quary(newQuary) {
    return (this.searchInput = newQuary);
  }
}
