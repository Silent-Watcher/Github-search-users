'use strict';
window.addEventListener('load', () => {
  const $ = document;

  const search = $.querySelector('#search');
  const btn = $.querySelector('#search_btn');
  const input = $.querySelector('#search_input');

  btn.addEventListener('click', (e) => {
    search.classList.toggle('active');
    input.focus();
  });
});
