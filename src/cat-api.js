import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_KXCY5wJ0dPt9Sk8v6sPeSZFEhSPm6Kzmmi1wuivbQ7tkFjbm4ZVVs3uDLVH5d3Er';

export const fetchBreeds = () => {
  return axios.get('https://api.thecatapi.com/v1/breeds').then(response => {
    return response.data.map(cat => {
      return {
        value: cat.id,
        text: cat.name,
      };
    });
  });
};

export const fetchCatByBreed = breedId => {
  return axios.get(
    'https://api.thecatapi.com/v1/images/search?breed_ids=' + breedId
  );
};
