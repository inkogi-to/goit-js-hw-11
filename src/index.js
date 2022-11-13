import PixelBayApiService from './js/pixelnayApi'
import {Notify} from "notiflix/build/notiflix-notify-aio";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import templateMarkup from './js/template/markupItem.hbs'

const guardOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 1,
}

const observer = new IntersectionObserver(onScrollLoading, guardOptions)

const refs = {
  form: document.forms[0],
  search_value: document.forms[0][0],
  search_query: document.forms[0][1],
  gallery: document.querySelector('.gallery'),
  gallery_card: document.querySelector('.gallery>a'),
  load_more: document.querySelector('.load-more'),
  guard: document.querySelector('.guard'),
  to_top: document.querySelector(".top-btn")
};

let total
const pixelBayApiService = new PixelBayApiService()

refs.search_query.addEventListener('click', onSearch)
toTop()


async function onSearch(e) {
  e.preventDefault()

  pixelBayApiService.query = refs.search_value.value
  if (pixelBayApiService.query === '') return Notify.warning('Please entered text!')

  pixelBayApiService.resetPage()

  const promise = await pixelBayApiService.getArticles()
  addBgGradient()
  total = Math.ceil(promise.totalHits / 40) + 2

  if (promise.hits.length === 0) {
    clearInputValue()
    return Notify.failure('Sorry, there are no images matching your search query. Please try again.')
  }

  observer.observe(refs.guard)
  clearGalleryContainer()
  Notify.success(`Hooray! We found ${promise.totalHits} images`)
  postMarkup(promise.hits)
  clearInputValue()
  createSimpleLightbox()

}

function createSimpleLightbox() {
  const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  gallerySimpleLightbox.refresh();
}

function postMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', templateMarkup(data))
  lastPage()

}


function lastPage() {
  if (total === pixelBayApiService.page) {
    return Notify.info('We\'re sorry, but you\'ve reached the end of search results.')
  }
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = ''
}

function clearInputValue() {
  refs.form.reset()
}


function onScrollLoading(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      pixelBayApiService.getArticles().then(res => {
        postMarkup(res.hits)

      })
    }
  })
}

function toTop() {
  refs.to_top.onclick = () => window.scrollTo({top: 0, behavior: "smooth"});
  window.onscroll = () => window.scrollY > 500 ? refs.to_top.style.opacity = '1' : refs.to_top.style.opacity = '0'
}

function addBgGradient() {
  refs.gallery.style.background = 'linear-gradient(#e66465, #9198e5)'

}







