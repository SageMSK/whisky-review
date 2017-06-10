import axios from 'axios';
/*
  Delete Forms: AJAX calls
*/
var deleteFormButton = document.getElementById('deleteFormButton');

function deleteReview(review) {
  const reviewId = review._id;
  axios.delete(`/whisky/${reviewId}/delete`);
}

export default deleteReview;