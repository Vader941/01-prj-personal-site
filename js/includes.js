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
  includeHTML("header-nav-placeholder", "/partials/header-nav.html");
});
