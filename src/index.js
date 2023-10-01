import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

Notiflix.Notify.init();

// prepare default option
const none = 'None';
const defaultSelectOption = {
  text: none,
  value: none,
};

// hide select until data is fetched
document.querySelector('#single').style.display = 'none';

const onSelectOptionChange = option => {
  document.querySelector('.cat-info').style.display = 'none';
  // if option is none don't send request
  if (option?.value == none) {
    return;
  }
  // display loader
  document.querySelector('.loader').style.display = '';

  // fetch cat details
  fetchCatByBreed(option?.value)
    .then(response => {
      // prepare cat detils
      const cat = response.data[0];
      const catDetails = cat.breeds[0];
      const markup = `
      <div class="cat-pic">
            <img class="cat-img" src=${cat.url}></img>
            </div>
            <div class="cat-description">
            <h2 class="cat-name"> ${catDetails.name}</h2>
            <p class="cat-temp"><b>Temperament</b>: ${catDetails.temperament}</p>
            <p class="cat-desc"><b>Description</b>: ${catDetails.description}</p></div>`;

      document.querySelector('.cat-info').innerHTML = markup;
    })
    .catch(error =>
      Notiflix.Notify.failure(` ${error?.response?.data?.message || error}`)
    )
    .finally(() => {
      // hide loader
      document.querySelector('.loader').style.display = 'none';

      // display div with details
      document.querySelector('.cat-info').style.display = '';
    });
};

const renderSelect = data => {
  new SlimSelect({
    select: '#single',
    data: [defaultSelectOption, ...data],
    events: {
      afterChange: option => onSelectOptionChange(option[0]),
    },
  });
};

// fetch data and add into select
fetchBreeds()
  .then(response => renderSelect(response))
  .catch(error =>
    Notiflix.Notify.failure(` ${error?.response?.data?.message || error}`)
  )
  .finally(() => {
    // hide loader
    document.querySelector('.loader').style.display = 'none';

    // display select
    document.querySelector('#single').style.display = '';
  });
