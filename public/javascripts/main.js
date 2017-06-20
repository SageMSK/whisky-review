// Import our CSS/SASS
import './../sass/style.scss';

import { $, $$ } from './modules/bling'; // need to use 'on'
import './modules/dropdown';
import ajaxFavoriteReview from './modules/favorite';

/*
  Favorite Review Form
*/
const favoriteForm = $('form.review__favoriteForm');
favoriteForm.on('submit', ajaxFavoriteReview);