import PixelBayApiService from './js/pixelnayApi'
import {Notify} from "notiflix/build/notiflix-notify-aio";
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css
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
};

const pixelBayApiService = new PixelBayApiService()

refs.search_query.addEventListener('click', onSearch)

function onSearch(e) {
  e.preventDefault()

  pixelBayApiService.query = refs.search_value.value
  if (pixelBayApiService.query === '') return Notify.warning('Please entered text!')
  pixelBayApiService.resetPage()
  pixelBayApiService.getArticles().then(res => {
    observer.observe(refs.guard)

    clearGalleryContainer()
    Notify.success(`Hooray! We found ${res.totalHits} images`)
    postMarkup(res.hits)
    refs.form.reset()
    const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    gallerySimpleLightbox.refresh();

  })

}


function postMarkup(data) {
  refs.gallery.insertAdjacentHTML('beforeend', templateMarkup(data))


}


function clearGalleryContainer() {
  refs.gallery.innerHTML = ''
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







