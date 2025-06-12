/**
 * Accessibility Image Carousel
 * This script automatically rotates through images with descriptive captions
 * to showcase accessibility features.
 */

// Carousel data containing image information
const carouselData = [
  {
    src: "./img/accessibility1.png",
    alt: "A young man in a wheelchair typing on a keyboard while filling out a clearly labeled online form.",
    caption: "Filling Out Accessible Forms"
  },
  {
    src: "./img/accessibility2.png",
    alt: "A young woman with sunglasses and headphones uses a braille display and screen reader at her desk.",
    caption: "Using a Screen Reader"
  },
  {
    src: "./img/accessibility3.png",
    alt: "A young man watches a captioned video while using a keyboard.",
    caption: "Watching Captioned Video"
  },
  {
    src: "./img/accessibility4.png",
    alt: "A smiling young man navigates a contact form using mouse and keyboard, with labeled fields.",
    caption: "Clear Form Field Labels"
  },
  {
    src: "./img/accessibility5.png",
    alt: "A woman hovers over a descriptive download link on a laptop with a tooltip showing.",
    caption: "Descriptive Link Hover"
  },
  {
    src: "./img/accessibility6.png",
    alt: "A man in glasses adjusts font size and contrast settings using a keyboard and mouse.",
    caption: "Adjusting Text and Contrast"
  }
];

// Wait for the DOM to be fully loaded before running
document.addEventListener("DOMContentLoaded", function() {
  // Find the carousel container
  const carouselContainer = document.getElementById("accessibility-carousel");
  
  if (!carouselContainer) {
    console.error("Carousel container not found!");
    return;
  }
  
  // Create elements for the carousel
  const imgElement = document.createElement("img");
  imgElement.classList.add("carousel-image");
  imgElement.setAttribute("role", "img"); // Ensure proper role for accessibility
  
  const captionElement = document.createElement("figcaption");
  captionElement.classList.add("carousel-caption");
  
  // Add elements to the container
  carouselContainer.appendChild(imgElement);
  carouselContainer.appendChild(captionElement);
  
  let currentIndex = 0;
  
  // Function to update the displayed image and caption
  function updateCarousel() {
    const currentItem = carouselData[currentIndex];
    
    // Update the image and its attributes
    imgElement.src = currentItem.src;
    imgElement.alt = currentItem.alt;
    
    // Update the caption
    captionElement.textContent = currentItem.caption;
    
    // Announce for screen readers that the image has changed
    const announcement = document.getElementById("carousel-announcement");
    if (announcement) {
      announcement.textContent = `Showing image ${currentIndex + 1} of ${carouselData.length}: ${currentItem.caption}`;
    }
    
    // Increment index for next image
    currentIndex = (currentIndex + 1) % carouselData.length;
  }
  
  // Show initial image
  updateCarousel();
  
  // Set interval to rotate images every 4 seconds
  setInterval(updateCarousel, 4000);
});
