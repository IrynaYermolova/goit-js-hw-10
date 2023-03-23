import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

// const cleanMarkup = ref => (ref.innerHTML = '');

// const onCountrySearch = evt => {
//   const textInput = evt.target.value.trim();

//   if (!textInput) {
//     cleanMarkup(countryList);
//     cleanMarkup(countryInfo);
//     return;
//   }

//   fetchCountries(textInput)
//     .then(data => {
//       console.log(data);
//       if (data.length > 10) {
//         Notify.info(
//           'Too many matches found. Please enter a more specific name'
//         );
//         return;
//       }
//       renderMarkup(data);
//     })
//     .catch(err => {
//       cleanMarkup(countryList);
//       cleanMarkup(countryInfo);
//       Notify.failure('Oops, there is no country with that name');
//     });
// };

// const renderMarkup = data => {
//   if (data.length === 1) {
//     cleanMarkup(countryList);
//     const markupInfo = createInfoMarkup(data);
//     countryInfo.innerHTML = markupInfo;
//   } else {
//     cleanMarkup(countryInfo);
//     const markupList = createListMarkup(data);
//     countryList.innerHTML = markupList;
//   }
// };

input.addEventListener(
  'input',
  debounce(evt => {
    const textInput = input.value.trim();
    cleanHtml();
    if (textInput !== '') {
      fetchCountries(textInput).then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length === 0) {
          Notify.failure('Oops, there is no country with that name');
        } else if (data.length >= 2 && data.length <= 10) {
          createListMarkup(data, countryList);
        } else if (data.length === 1) {
          createInfoMarkup(data, countryList);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

const createListMarkup = countries => {
  const markupList = countries
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
  countryList.innerHTML = markupList;
};

const createInfoMarkup = countries => {
  const markupList = countries
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<img src="${flags.png}" alt="${
          name.official
        }" width="200" height="100">
         <h1>${name.official}</h1>
         <p>Capital: ${capital}</p>
         <p>Population: ${population}</p>
         <p>Languages: ${Object.values(languages)}</p>`
    )
    .join('');
  countryInfo.innerHTML = markupList;
};

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
