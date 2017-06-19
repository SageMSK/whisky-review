// Import our CSS/SASS
import './../sass/style.scss';

import { $, $$ } from './modules/bling'; // need to use 'on'
import './modules/dropdown';
// import './modules/deleteForm';
// import ajaxDeleteComment from './modules/deleteComment';
import ajaxFavoriteReview from './modules/favorite';

/*
  Favorite Review Form
*/
const favoriteForm = $('form.review__favoriteForm');
favoriteForm.on('submit', ajaxFavoriteReview);

/*
  Delete Comment
*/
// const deleteButton = document.getElementById('comment-box__button');
// console.log(deleteButton);
// deleteButton.on('submit', ajaxDeleteComment);

