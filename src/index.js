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
            <img src=${cat.url} width='${cat.width}px' height='${cat.height}px'></img>
            <p><b>Denumirea rasei</b>: ${catDetails.name}</p>
            <p><b>Temperament</b>: ${catDetails.temperament}</p>
            <p><b>Descriere</b>: ${catDetails.description}</p>`;

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
