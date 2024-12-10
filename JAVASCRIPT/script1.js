/**s
var swiper = new Swiper(".slide-container", {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
});
*/
  
// This should be in your script file or inside a <script> tag at the bottom of the HTML
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',     // Horizontal sliding
  loop: true,                  // Loop slides
  slidesPerView: 3,            // Number of slides visible at once
  spaceBetween: 20,            // Space between slides in px
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
  },
  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
  },
  autoplay: {
      delay: 3000,            // Delay between transitions in ms
      disableOnInteraction: false,
  },
});


