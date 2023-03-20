'use strict';

const $ = document,
  search = $.querySelector('#search'),
  btn = $.querySelector('#search_btn'),
  input = $.querySelector('#search_input'),
  userName = $.querySelector('#name'),
  userId = $.querySelector('#id'),
  userBlog = $.querySelector('#blog'),
  followers = $.querySelector('#followers_count'),
  followings = $.querySelector('#following_count'),
  publicRepo = $.querySelector('#publicRepo_count'),
  avatar = $.querySelector('#avatar'),
  view_btn = $.querySelector('#view_btn'),
  repositories = $.querySelector('#project_list');

window.addEventListener('load', () => callGithub());

// github profile fetch
input.addEventListener('input', function () {
  repositories.innerHTML = '';
  callGithub(this.value);
});

// search box
btn.addEventListener('click', (e) => {
  search.classList.toggle('active');
  input.focus();
});

// header
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

function addUserData(user) {
  userName.innerHTML = user.name ?? 'not found ! 🤔';
  userId.innerHTML = user.login ?? 'not found ! 🤔';
  userBlog.innerHTML = user.blog ?? 'not found !';
  followers.innerHTML = user.followers ?? '..';
  followings.innerHTML = user.following ?? '..';
  publicRepo.innerHTML = user.public_repos ?? '..';
  avatar.src = user.avatar_url ?? 'img/male_avatar.png';
  view_btn.href = user.html_url ?? '#';
}

function fetchUserProjects(id) {
  fetch(`https://api.github.com/users/${id}/repos`, {
    headers: { Authorization: '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' },
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      if (res.status === 403) {
        Swal.fire({
          title: 'Github 403 ⚠',
          text: 'too many requests! try again later ',
          icon: 'error',
          confirmButtonText: 'fine',
        });
      }
    })
    .then((repos) => {
      if (repos.length) addUserProjectsElement(repos);
      else
        repositories.innerHTML =
          "<p class=' fs-4 p-1 ps-3 text-light text-center'>nothing !<p>";
    });
}

function createUserProjectsElement(name, href) {
  let project = $.createElement('a');
  project.className = 'fs-4 p-1 ps-3 text-light text-decoration-none d-block';
  project.target = '_blank';
  project.innerHTML = name;
  project.href = href;
  return project;
}

function addUserProjectsElement(repos) {
  let projectsFragment = $.createDocumentFragment();
  repos.forEach(({ name, html_url }) => {
    projectsFragment.append(createUserProjectsElement(name, html_url));
  });
  repositories.appendChild(projectsFragment);
}

function callGithub(userName = 'silent-watcher') {
  fetch(
    `https://api.github.com/users/${!!userName ? userName : 'silent-watcher'}`,
    {
      headers: { Authorization: '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' },
    }
  )
    .then((res) => {
      if (res.status === 200) return res.json();
      else return new Error('error fetching data');
    })
    .then((user) => {
      addUserData(user);
      fetchUserProjects(user.login);
    })
    .catch();
}
