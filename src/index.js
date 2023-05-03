import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/images-service';

const searchImages = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('[data-action="load-more"]');
const target = document.querySelector('.js-guard');

const imagesApiService = new ImagesApiService();

searchImages.addEventListener('submit', onSearch);
// btnLoadMore.addEventListener('click', onLoadMore);
// hide();

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoadMore, options);

async function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;
  imagesApiService.resetPage();
  clearGallery();
  
  const results = await imagesApiService.fetchImages();
  const { hits, total } = results;
  appendImagesMarkup(hits);

  if (hits.length === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  Notify.success(`Hooray! We found ${total} images.`);

  if (hits.length === total) {
    return Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }

  observer.observe(target);
}

async function loadImages() {
  const results = await imagesApiService.fetchImages();
  const { hits, total } = results;
  appendImagesMarkup(hits);
}

// -----------------!варіант з кнопкою "Load More"!---------------------------
// let totalShow = 40;
// async function onLoadMore(e) {
//   hide();
//   const results = await imagesApiService.fetchImages();
//   const { hits, total } = results;
//   totalShow += hits.length;
//   appendImagesMarkup(hits);
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
//   if (totalShow >= total) {
//     hide();
//     return Notify.failure(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
//   show();
// }
// --------------------------------------------------------------------------------------

let totalShow = 40;
async function onLoadMore(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      const results = await imagesApiService.fetchImages();
      const { hits, total } = results;
      const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

      appendImagesMarkup(hits);
      totalShow += hits.length;
      
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });

      if (totalShow >= total) {
        observer.unobserve(target);
        return Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  });
}

function appendImagesMarkup(images) {
  gallery.insertAdjacentHTML('beforeend', createMarkup(images));
  galleryImages.refresh();
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
			<a class="gallery_link" href="${largeImageURL}">
				<img class="gallery_image" src="${webformatURL}" alt="${tags}" loading="lazy" width="330" height="220">
			</a>
			<div class="info">
				<p class="info-item">
					<b>Likes</b><br>${likes}
				</p>
				<p class="info-item">
					<b>Views</b><br>${views}
				</p>
				<p class="info-item">
					<b>Comments</b><br>${comments}
				</p>
				<p class="info-item">
					<b>Downloads</b><br>${downloads}
				</p>
			</div>
		</div>`
    )
    .join('');
}

function clearGallery() {
  gallery.innerHTML = '';
}

function show() {
  btnLoadMore.classList.remove('is-hidden');
}

function hide() {
  btnLoadMore.classList.add('is-hidden');
}

const galleryImages = new SimpleLightbox('.gallery div a');
