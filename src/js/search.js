import Axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiServicePixabay from './fetch-search';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const newApiPixabay = new ApiServicePixabay();

form.addEventListener('submit', onSerach);
loadMore.addEventListener('click', onLoadMore);

function onSerach(photo) {
  photo.preventDefault();
  newApiPixabay.quary = photo.currentTarget.elements.searchQuery.value;

  newApiPixabay.resetPage();
  newApiPixabay
    .fetchPixabay()
    .then(resetSearchMarkup)
    .catch(error => {
      error;
    });
}

function makePhotoMarkup(q) {
  return q.hits
    .map(photo => {
      return `
      <div class="photo-card">
        <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" width = 350px height = 200px />
          <div class="info">
            <p class="info-item">
            <b>Likes</b>
            ${photo.likes}
            </p>
            <p class="info-item">
            <b>Views</b>
            ${photo.views}
            </p>
            <p class="info-item">
            <b>Comments</b>
            ${photo.comments}
            </p>
            <p class="info-item">
            <b>Downloads</b>
            ${photo.downloads}
            </p>
          </div>
      </div>`;
    })
    .join('');
}

function resetSearchMarkup(e) {
  gallery.innerHTML = makePhotoMarkup(e);
}

function appendLoadMoreMarkup(e) {
  gallery.insertAdjacentHTML('beforeend', makePhotoMarkup(e));
}

async function onLoadMore() {
  newApiPixabay.accretionPage();
  newApiPixabay
    .fetchPixabay()
    .then(appendLoadMoreMarkup)
    .catch(error => {
      error;
    });
}
