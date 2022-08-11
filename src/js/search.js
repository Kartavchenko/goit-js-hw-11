import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiServicePixabay from './fetch-search';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const newApiPixabay = new ApiServicePixabay();

form.addEventListener('submit', onSerach);
loadMore.addEventListener('click', onLoadMore);
loadMore.classList.add("is-hidden");

function onSerach(photo) {
  photo.preventDefault();
  newApiPixabay.quary = photo.currentTarget.elements.searchQuery.value;
  newApiPixabay.resetPage();
  getFetchCall();
  // here put btn "wait" when fetch
  loadMore.classList.remove("is-hidden");
};

async function getFetchCall() {
  try {
    const onMarkupSearch = await newApiPixabay.fetchPixabay();
    console.log(onMarkupSearch)
    if (onMarkupSearch.hits < 1) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    };
    if (onMarkupSearch.hits.length) {
      loadMore.classList.add("is-hidden");
    }
    return resetSearchMarkup(onMarkupSearch);
  } catch (error) {
    console.log(error);
  };
};

function resetSearchMarkup(e) {
  gallery.innerHTML = makePhotoMarkup(e);
};

function appendLoadMoreMarkup(e) {
  gallery.insertAdjacentHTML('beforeend', makePhotoMarkup(e));
  // loadMore.setAttribute("disabled", "");
};

function hideBtnLoadMore() {

}

function onLoadMore() {
  newApiPixabay.incrementPage();
  fetchForBtnLoadMore();
};

async function fetchForBtnLoadMore() {
  try {
    const dataOfPixabay = await newApiPixabay.fetchPixabay();
    return appendLoadMoreMarkup(dataOfPixabay);
  } catch (error) {
    console.log(error);
  };
};

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
};