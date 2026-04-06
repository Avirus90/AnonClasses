const homeView = document.getElementById('homeView');
const courseView = document.getElementById('courseView');
const openCourseContent = document.getElementById('openCourseContent');
const backToHome = document.getElementById('backToHome');
const navItems = document.querySelectorAll('.nav-item');

function showHome() {
  homeView.classList.add('active');
  courseView.classList.remove('active');
}

function showCourses() {
  courseView.classList.add('active');
  homeView.classList.remove('active');
}

openCourseContent.addEventListener('click', (event) => {
  event.preventDefault();
  showCourses();
});

backToHome.addEventListener('click', showHome);

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((btn) => btn.classList.remove('active'));
    item.classList.add('active');

    if (item.dataset.tab === 'Home') {
      showHome();
      return;
    }

    if (item.dataset.tab === 'Courses') {
      showCourses();
      return;
    }

    alert('Profile screen demo ke liye abhi placeholder hai.');
  });
});
