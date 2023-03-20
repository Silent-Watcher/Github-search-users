'use strict';

const $ = document;
const search = $.querySelector('#search');
const btn = $.querySelector('#search_btn');
const input = $.querySelector('#search_input');
const userName = $.querySelector('#name');
const userId = $.querySelector('#id');
const userBlog = $.querySelector('#blog');
const followers = $.querySelector('#followers_count');
const followings = $.querySelector('#following_count');
const publicRepo = $.querySelector('#publicRepo_count');
const avatar = $.querySelector('#avatar');
const view_btn = $.querySelector('#view_btn');

// github profile fetch
input.addEventListener('input', function () {
  let value = this.value;
  if (value) {
    fetch(`https://api.github.com/users/${value}`, {
      headers: { Authorization: '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' },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) return res.json();
        else return new Error('error fetching data');
      })
      .then((user) => {
        fetchUserData(user);
        fetchUserProjects(user.login);
      });
  }
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

function fetchUserData(user) {
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
  console.log(`https://api.github.com/users/${id}/repos`);
  fetch(`https://api.github.com/users/${id}/repos`, {
    headers: { Authorization: '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' },
  })
    .then((res) => {
      console.log(res);
      if (res.status === 200) return res.json();
      else return new Error('error fetching repos');
    })
    .then((repos) => {
      console.log(repos);
      let projectsFragment = $.createDocumentFragment();
      repos.forEach((repo) => {
        let project = $.createElement('a');
        project.className =
          'fs-4 p-1 ps-3 text-light text-decoration-none d-block';
        project.rel = 'noopener noreferrer';
        project.target = "_blank";
        project.innerHTML = repo.name;
        project.href = repo.html_url;
        console.log(project)
        projectsFragment.append(project);
        console.log(repo.name);
      });
      $.querySelector('#project_list').appendChild(projectsFragment);
    });
}

// github token : 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
// please keep this token ! 🤗
