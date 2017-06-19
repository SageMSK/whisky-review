import axios from 'axios';
import { $ } from './bling';

function ajaxFavoriteReview(e) {
  e.preventDefault();
  console.log('Favorite Review');
  axios
    .post(this.action) // this = form, action = link
    .then(res => {
      // favorite = name attr
      // toggle the active class
      const isFavorited = this.favorite.classList.toggle('favorite-button--favorited');
    })
    .catch(err => console.error(err));
}

export default ajaxFavoriteReview;