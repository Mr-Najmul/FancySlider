const imagesArea = document.querySelector('.images');
const errorMessage = document.getElementById('error-message');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

let sliders = [];
//API KEY
const KEY = '15674931-a9d714b6e9d654524df198e00&q';


const showImages = (images) => {
  if (images.length === 0 || searchInput.value === '') {
    imagesArea.style.display = 'none';
    errorMessage.style.display = 'block';

    if (searchInput.value === '') {
      errorMessage.innerHTML = `
      <h2 class="text-center text-danger mt-4">Sorry please try again.</h2>`;
    } else {
      errorMessage.innerHTML = `
      <h2 class="text-center text-danger mt-4">This item does not exist, Sorry please try again.</h2>`;
    }
  } else {
    errorMessage.style.display = 'none';
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
 
    galleryHeader.style.display = 'flex';
    images.forEach((image) => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
    searchInput.value = '';
  }
  document.getElementById('duration').value = '';
  showSpinner(false);
};


searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

const getImages = (query) => {
  showSpinner(true);
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }
};
var timer;
const createSlider = () => {
  if (sliders.length < 2) {
    alert('Select at least 2 image.');
    return;
  }

  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className =
    'prev-next d-flex w-100 justify-content-between align-items-center';
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector('.main').style.display = 'block';

  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  if (duration >= 1000) {
    duration = duration;
  } else {
    duration = 1000;
  }
  sliders.forEach((slide) => {
    let item = document.createElement('div');
    item.className = 'slider-item';
    item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = 'none';
  });

  items[index].style.display = 'block';
};

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value);
  sliders.length = 0;
});

sliderBtn.addEventListener('click', function () {
  createSlider();
});

//Show Spinner
const showSpinner = (show) => {
  const spinner = document.getElementById('lodding-spinner');
  show ? spinner.classList.remove('d-none') : spinner.classList.add('d-none');
  errorMessage.classList.toggle('d-none');
  imagesArea.classList.toggle('d-none');
};
