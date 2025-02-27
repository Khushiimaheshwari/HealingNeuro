const carousel = document.querySelector('.carousel');  
const items = document.querySelectorAll('.carousel-item');  
const dots = document.querySelectorAll('.dot');  

let currentIndex = 0; // Tracks the current visible image  

function showSlide(index) {  
    // Ensure index is within bounds  
    if (index < 0) index = items.length - 1; // Wrap to last item if going back from the first  
    if (index >= items.length) index = 0; // Wrap to first item if going forward from the last  

    // Update the carousel's transform property  
    const translateXValue = -index * (100 / items.length); // Slide by 100% divided by number of items  
    carousel.style.transform = `translateX(${translateXValue}%)`;  

    // Update active dot  
    dots.forEach(dot => dot.classList.remove('active'));  
    dots[index].classList.add('active');  

    // Update currentIndex  
    currentIndex = index;  
}  

// Add click events to dots  
dots.forEach((dot, index) => {  
    dot.addEventListener('click', () => showSlide(index));  
});  

// Initialize first slide  
showSlide(0);  

// Auto carousel feature (optional)  
setInterval(() => {  
    currentIndex = (currentIndex + 1) % items.length; // Increment index, wrap around  
    showSlide(currentIndex);  
}, 3000); // Change every 3 seconds