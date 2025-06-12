function includeHTML(id, url) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return res.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML("header-nav-placeholder", "./partials/header-nav.html");
  
  const images = document.querySelectorAll('.carousel-image');
  let index = 0;

  function showNextImage() {
    images.forEach((img, i) => {
      img.classList.remove('active');
      if (i === index) img.classList.add('active');
    });
    index = (index + 1) % images.length;
  }

  // Show first image immediately
  showNextImage();
  // Rotate every 4 seconds
  setInterval(showNextImage, 4000);
});
