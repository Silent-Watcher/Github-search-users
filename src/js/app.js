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

  //   header
  const enhance = () => {
    document.querySelectorAll('.word').forEach((word) => {
      const letters = word.innerText.split('');
      word.innerHTML = null;
      letters.forEach((letter) => {
        word.innerHTML += `<span class="letter">${letter}</span>`;
      });
    });
  };
  enhance();
});
