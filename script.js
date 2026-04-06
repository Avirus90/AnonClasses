import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAsSkDiFZpk1eqMWS4qDDxx5ksZBONSJ4Q',
  authDomain: 'odigyan-a5d08.firebaseapp.com',
  projectId: 'odigyan-a5d08',
  storageBucket: 'odigyan-a5d08.firebasestorage.app',
  messagingSenderId: '25985064791',
  appId: '1:25985064791:web:b935dbf321dbc0b2c5e812',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const homeView = document.getElementById('homeView');
const courseView = document.getElementById('courseView');
const adminView = document.getElementById('adminView');

const openCourseContent = document.getElementById('openCourseContent');
const coursesBtn = document.getElementById('coursesBtn');
const backToHome = document.getElementById('backToHome');
const adminBtn = document.getElementById('adminBtn');
const backFromAdmin = document.getElementById('backFromAdmin');

const authBtn = document.getElementById('authBtn');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const courseCards = document.querySelectorAll('.course-card');

const courseTitle = document.getElementById('courseTitle');
const courseSubtitle = document.getElementById('courseSubtitle');
const sectionCards = document.querySelectorAll('.content-card');
const resourceHeading = document.getElementById('resourceHeading');
const resourceForm = document.getElementById('resourceForm');
const resourceList = document.getElementById('resourceList');
const folderNameInput = document.getElementById('folderName');
const folderUrlInput = document.getElementById('folderUrl');

const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');
const studentNameInput = document.getElementById('studentName');
const studentDobInput = document.getElementById('studentDob');
const studentEmailInput = document.getElementById('studentEmail');
const studentPhoneInput = document.getElementById('studentPhone');

const adminUsersList = document.getElementById('adminUsersList');

let selectedCourse = 'OSSC Foundation';
let selectedSection = null;
let currentUser = null;
let unsubscribeResources = null;

function activateTab(tabName) {
  navItems.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
}

function showHome() {
  homeView.classList.add('active');
  courseView.classList.remove('active');
  adminView.classList.remove('active');
  activateTab('Home');
}

function showCourses() {
  homeView.classList.remove('active');
  courseView.classList.add('active');
  adminView.classList.remove('active');
  activateTab('Courses');
}

function showAdmin() {
  homeView.classList.remove('active');
  courseView.classList.remove('active');
  adminView.classList.add('active');
  activateTab('Profile');
}

function renderResourceCard(docItem) {
  const item = docItem.data();
  const wrapper = document.createElement('article');
  wrapper.className = 'resource-item';
  wrapper.innerHTML = `
    <strong>📁 ${item.folderName}</strong>
    <p>${item.section} • ${item.courseName}</p>
    <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.url}</a>
  `;
  return wrapper;
}

function watchResources() {
  if (!selectedSection) {
    resourceList.innerHTML = '';
    return;
  }

  if (unsubscribeResources) {
    unsubscribeResources();
  }

  const resourcesQuery = query(
    collection(db, 'courseResources'),
    where('courseName', '==', selectedCourse),
    where('section', '==', selectedSection),
    orderBy('createdAt', 'desc'),
  );

  unsubscribeResources = onSnapshot(resourcesQuery, (snapshot) => {
    resourceList.innerHTML = '';

    if (snapshot.empty) {
      resourceList.innerHTML = '<div class="resource-item">No folders yet. Add first URL folder.</div>';
      return;
    }

    snapshot.forEach((docItem) => {
      resourceList.appendChild(renderResourceCard(docItem));
    });
  });
}

function setCourse(courseName) {
  selectedCourse = courseName;
  courseTitle.textContent = courseName;
  courseSubtitle.textContent = '6 sections ke andar folder-style URL cards manage karein.';
  showCourses();
}

async function ensureProfile(user) {
  const studentsRef = collection(db, 'students');
  const existing = await getDocs(query(studentsRef, where('uid', '==', user.uid)));

  if (!existing.empty) {
    return;
  }

  studentEmailInput.value = user.email ?? '';
  profileModal.showModal();
}

openCourseContent.addEventListener('click', (event) => {
  event.preventDefault();
  setCourse(selectedCourse);
});

coursesBtn.addEventListener('click', showCourses);
backToHome.addEventListener('click', showHome);
adminBtn.addEventListener('click', showAdmin);
backFromAdmin.addEventListener('click', showHome);

courseCards.forEach((card) => {
  card.addEventListener('click', () => setCourse(card.dataset.course));
});

sectionCards.forEach((card) => {
  card.addEventListener('click', () => {
    sectionCards.forEach((btn) => btn.classList.remove('active'));
    card.classList.add('active');
    selectedSection = card.dataset.section;
    resourceHeading.textContent = `${selectedCourse} • ${selectedSection}`;
    watchResources();
  });
});

resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentUser) {
    alert('Pehle Google login karein.');
    return;
  }

  if (!selectedSection) {
    alert('Pehle koi section select karein.');
    return;
  }

  await addDoc(collection(db, 'courseResources'), {
    courseName: selectedCourse,
    section: selectedSection,
    folderName: folderNameInput.value.trim(),
    url: folderUrlInput.value.trim(),
    createdByEmail: currentUser.email,
    createdAt: serverTimestamp(),
  });

  resourceForm.reset();
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentUser) {
    alert('Session missing. Please login again.');
    return;
  }

  await addDoc(collection(db, 'students'), {
    uid: currentUser.uid,
    name: studentNameInput.value.trim(),
    dob: studentDobInput.value,
    email: studentEmailInput.value,
    phone: studentPhoneInput.value.trim(),
    loggedInAt: serverTimestamp(),
  });

  profileModal.close();
  profileForm.reset();
});

authBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
});

logoutBtn.addEventListener('click', async () => {
  if (!currentUser) {
    alert('Already logged out.');
    return;
  }
  await signOut(auth);
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    if (item.dataset.tab === 'Home') {
      showHome();
      return;
    }

    if (item.dataset.tab === 'Courses') {
      showCourses();
      return;
    }

    showAdmin();
  });
});

onSnapshot(query(collection(db, 'students'), orderBy('loggedInAt', 'desc')), (snapshot) => {
  adminUsersList.innerHTML = '';

  if (snapshot.empty) {
    adminUsersList.innerHTML = '<div class="admin-user-item">No student login records yet.</div>';
    return;
  }

  snapshot.forEach((docItem) => {
    const item = docItem.data();
    const node = document.createElement('article');
    node.className = 'admin-user-item';
    node.innerHTML = `<strong>${item.name || 'Student'}</strong><p>${item.email}</p><small>${item.phone || '-'}</small>`;
    adminUsersList.appendChild(node);
  });
});

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  authBtn.textContent = user ? `✅ ${user.email}` : '🔐 Google Login';

  if (user) {
    await ensureProfile(user);
  }
});

showHome();
