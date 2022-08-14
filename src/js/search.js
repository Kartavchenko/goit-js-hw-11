import {Spinner} from 'spin.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiServicePixabay from './fetch-search';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const newApiPixabay = new ApiServicePixabay();

form.addEventListener('submit', onSerach);
loadMore.addEventListener('click', onLoadMore);
loadMore.classList.add("is-hidden");
const opts = {
  left: "10%",
  scale: 0.5,
  animation: 'spinner-line-shrink',
};

const spinner = new Spinner(opts).spin();

function onSerach(photo) {
  photo.preventDefault();
  newApiPixabay.quary = photo.currentTarget.elements.searchQuery.value;
  newApiPixabay.resetPage();
  getFetchCall();
  loadMore.classList.remove("is-hidden");
  showBtnDownloading(spinner.spin());
};

function showBtnDownloading(e) {
  loadMore.textContent = "Downloading";
  loadMore.classList.add("download");
  loadMore.appendChild(spinner.el);
};

function hideBtnDownloading() {
  loadMore.textContent = "Load More";
  loadMore.classList.remove("download");
  spinner.stop();
};

async function getFetchCall() {
  try {
    const onMarkupSearch = await newApiPixabay.fetchPixabay();
    hideBtnDownloading();
    if (onMarkupSearch.hits.length < 1) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    };
    if (onMarkupSearch.hits.length < 40) {
      loadMore.classList.add('is-hidden');
      // Notify.info("We're sorry, but you've reached the end of search results.");
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
};

function onLoadMore() {
  newApiPixabay.incrementPage();
  fetchForBtnLoadMore();
  showBtnDownloading(spinner.spin());
};

async function fetchForBtnLoadMore() {
  try {
    const dataOfPixabay = await newApiPixabay.fetchPixabay();
    if (dataOfPixabay.hits.length < 40) {
      loadMore.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    hideBtnDownloading();
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