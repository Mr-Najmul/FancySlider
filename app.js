const imagesArea = document.querySelector('.images');
const errorMassage = document.getElementById('error-massage');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


//API KEY

const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  errorMassage.classList.add('d-none');
  imagesArea.classList.remove('d-none');
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  loadingBar();
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=false`)
    .then(response => response.json())
    .then(data => {
      if(data.hits.length > 0){
         showImages(data.hits);
      }else{
        notFind();
      }
    }) 
    .catch(error => notFind())
}


let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
    element.classList.remove('added');
  }
}


var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.classList.add('d-none');
  const durationInput = document.getElementById('duration').value || 1000;
  const duration = durationInput < 1 ? 1000 : durationInput * 1000;  // const duration
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  searchAlbum();
})
search.addEventListener('keypress', function (event) {
  if(event.key === 'Enter'){
    searchAlbum();
  }
})

function searchAlbum(){
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  loadingBar();
  getImages(search.value)
  sliders.length = 0;
}

sliderBtn.addEventListener('click', function () {
  createSlider()
})


// loading spinner added  
function loadingBar(){
  const loading = document.getElementById('loading-spinner');
  loading.classList.toggle('d-none');
}

 
function notFind(){
  loadingBar();
  errorMassage.classList.remove('d-none');
  imagesArea.classList.add('d-none')
}