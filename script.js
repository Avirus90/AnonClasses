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

const ADMIN_EMAIL = 'bimbadharbaghel0@gmail.com';
const DEFAULT_COURSES = [
  { name: 'OSSC Foundation', desc: 'Videos + Notes + Mocktest', theme: 'red-blue', badge: '⚡ New' },
  { name: 'Odisha GK Pro', desc: 'Daily Current Affairs', theme: 'green', badge: '🔥 Trending' },
  { name: 'English Booster', desc: 'Vocab + Practice Sets', theme: 'violet', badge: '✅ Updated' },
  { name: 'Static GK Master', desc: 'Chapterwise Cards', theme: 'yellow', badge: '📘 Core' },
];

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
const profileNavBtn = document.getElementById('profileNavBtn');

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
const courseForm = document.getElementById('courseForm');
const newCourseNameInput = document.getElementById('newCourseName');
const newCourseDescInput = document.getElementById('newCourseDesc');

const ADMIN_EMAIL = 'bimbadharbaghel0@gmail.com';
const DEFAULT_COURSES = [
  { name: 'OSSC Foundation', desc: 'Videos + Notes + Mocktest', theme: 'red-blue', badge: '⚡ New' },
  { name: 'Odisha GK Pro', desc: 'Daily Current Affairs', theme: 'green', badge: '🔥 Trending' },
  { name: 'English Booster', desc: 'Vocab + Practice Sets', theme: 'violet', badge: '✅ Updated' },
  { name: 'Static GK Master', desc: 'Chapterwise Cards', theme: 'yellow', badge: '📘 Core' },
];

let selectedCourse = DEFAULT_COURSES[0].name;
let selectedSection = null;
let currentUser = null;
let unsubscribeResources = null;

const courseGrid = document.getElementById('courseGrid');

function isAdmin() {
  return currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

function activateTab(tabName) {
  navItems.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
}

const courseGrid = document.getElementById('courseGrid');
const courseTitle = document.getElementById('courseTitle');
const courseSubtitle = document.getElementById('courseSubtitle');
const sectionCards = document.querySelectorAll('.content-card');
const resourceHeading = document.getElementById('resourceHeading');
const resourceForm = document.getElementById('resourceForm');
const nodeTypeInput = document.getElementById('nodeType');
const folderNameInput = document.getElementById('folderName');
const folderUrlInput = document.getElementById('folderUrl');
const resourceList = document.getElementById('resourceList');
const goRootBtn = document.getElementById('goRootBtn');
const goUpBtn = document.getElementById('goUpBtn');
const folderPathText = document.getElementById('folderPathText');

const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');
const studentNameInput = document.getElementById('studentName');
const studentDobInput = document.getElementById('studentDob');
const studentEmailInput = document.getElementById('studentEmail');
const studentPhoneInput = document.getElementById('studentPhone');

const adminUsersList = document.getElementById('adminUsersList');
const courseForm = document.getElementById('courseForm');
const newCourseNameInput = document.getElementById('newCourseName');
const newCourseDescInput = document.getElementById('newCourseDesc');

let selectedCourse = DEFAULT_COURSES[0].name;
let selectedSection = null;
let currentUser = null;
let currentFolderId = 'root';
let allCurrentNodes = [];
let unsubscribeNodes = null;

function isAdmin() {
  return currentUser?.email?.toLowerCase() === ADMIN_EMAIL;
}

function updateAdminVisibility() {
  const showAdmin = isAdmin();
  adminBtn.classList.toggle('hidden', !showAdmin);
  profileNavBtn.classList.toggle('hidden', !showAdmin);
  courseForm.style.display = showAdmin ? 'grid' : 'none';
}

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
  if (!isAdmin()) {
    return;
  }

  homeView.classList.remove('active');
  courseView.classList.remove('active');
  adminView.classList.add('active');
  activateTab('Profile');
}

function renderCourseCard(courseData) {
  const wrapper = document.createElement('article');
  wrapper.className = 'course-card';
  wrapper.dataset.course = courseData.name;
  wrapper.innerHTML = `
    <div class="course-thumb ${courseData.theme || 'red-blue'}"><span class="badge">${courseData.badge || '📘 Course'}</span></div>
    <div class="course-body">
      <h3>${courseData.name}</h3>
      <p>${courseData.desc || ''}</p>
    </div>
  `;
  wrapper.addEventListener('click', () => setCourse(courseData.name));
  return wrapper;
}

function getFolderNameById(folderId) {
  if (!folderId || folderId === 'root') {
    return 'Root';
  }
  return allCurrentNodes.find((item) => item.id === folderId)?.title || 'Folder';
}

function buildPathTitles(folderId) {
  const titles = ['Root'];
  let cursor = folderId;

  while (cursor && cursor !== 'root') {
    const node = allCurrentNodes.find((item) => item.id === cursor);
    if (!node) {
      break;
    }
    titles.unshift(node.title);
    cursor = node.parentId || 'root';
  }

  return titles;
}

function renderNodeItem(node) {
  const wrapper = document.createElement('article');
  wrapper.className = 'resource-item';

  if (node.type === 'folder') {
    wrapper.innerHTML = `<strong>📁 ${node.title}</strong><p>Open folder</p>`;
    wrapper.addEventListener('click', () => {
      currentFolderId = node.id;
      renderCurrentFolder();
    });
  } else {
    wrapper.innerHTML = `
      <strong>🔗 ${node.title}</strong>
      <a href="${node.url}" target="_blank" rel="noopener noreferrer">${node.url}</a>
    `;
  }

  return wrapper;
}

function renderCurrentFolder() {
  const visibleNodes = allCurrentNodes.filter((node) => (node.parentId || 'root') === currentFolderId);
  const path = buildPathTitles(currentFolderId);
  folderPathText.textContent = `Path: ${path.join(' / ')}`;

  resourceList.innerHTML = '';

  if (!visibleNodes.length) {
    resourceList.innerHTML = '<div class="resource-item">Folder empty hai. Naya folder ya URL add karein.</div>';
    return;
  }

  visibleNodes
    .sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title))
    .forEach((node) => {
      resourceList.appendChild(renderNodeItem(node));
    });
}

function watchCourseNodes() {
  if (!selectedSection) {
    allCurrentNodes = [];
    renderCurrentFolder();
    return;
  }

  if (unsubscribeNodes) {
    unsubscribeNodes();
  }

  const nodesQuery = query(
    collection(db, 'courseNodes'),
    where('courseName', '==', selectedCourse),
    where('section', '==', selectedSection),
    orderBy('createdAt', 'desc'),
  );

  unsubscribeNodes = onSnapshot(
    nodesQuery,
    (snapshot) => {
      allCurrentNodes = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
      renderCurrentFolder();
    },
    () => {
      allCurrentNodes = [];
      resourceList.innerHTML = '<div class="resource-item">Data load nahi ho paya. Firestore rules check karein.</div>';
    },
  );
}

function setCourse(courseName) {
  selectedCourse = courseName;
  selectedSection = null;
  currentFolderId = 'root';
  sectionCards.forEach((btn) => btn.classList.remove('active'));
  courseTitle.textContent = courseName;
  courseSubtitle.textContent = 'Section select karke nested folders/URLs manage karein.';
  resourceHeading.textContent = 'Select any section';
  folderPathText.textContent = 'Path: Root';
  resourceList.innerHTML = '<div class="resource-item">Section select karein.</div>';
  showCourses();
}

async function ensureProfile(user) {
  if (user.email?.toLowerCase() === ADMIN_EMAIL) {
    return;
  }

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

sectionCards.forEach((card) => {
  card.addEventListener('click', () => {
    sectionCards.forEach((btn) => btn.classList.remove('active'));
    card.classList.add('active');
    selectedSection = card.dataset.section;
    currentFolderId = 'root';
    resourceHeading.textContent = `${selectedCourse} • ${selectedSection}`;
    watchCourseNodes();
  });
});

nodeTypeInput.addEventListener('change', () => {
  folderUrlInput.required = nodeTypeInput.value === 'url';
  folderUrlInput.disabled = nodeTypeInput.value === 'folder';
  if (nodeTypeInput.value === 'folder') {
    folderUrlInput.value = '';
  }
});
nodeTypeInput.dispatchEvent(new Event('change'));

goRootBtn.addEventListener('click', () => {
  currentFolderId = 'root';
  renderCurrentFolder();
});

goUpBtn.addEventListener('click', () => {
  if (currentFolderId === 'root') {
    return;
  }
  const currentFolder = allCurrentNodes.find((item) => item.id === currentFolderId);
  currentFolderId = currentFolder?.parentId || 'root';
  renderCurrentFolder();
});

resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    alert('Yeh action sirf admin ke liye hai.');
    return;
  }

  if (!selectedSection) {
    alert('Pehle section select karein.');
    return;
  }

  const nodeType = nodeTypeInput.value;
  const title = folderNameInput.value.trim();
  const url = folderUrlInput.value.trim();

  if (!title) {
    alert('Title mandatory hai.');
    return;
  }

  if (nodeType === 'url' && !url) {
    alert('URL mandatory hai.');
    return;
  }

  await addDoc(collection(db, 'courseNodes'), {
    courseName: selectedCourse,
    section: selectedSection,
    type: nodeType,
    title,
    url: nodeType === 'url' ? url : null,
    parentId: currentFolderId,
    createdByEmail: currentUser.email,
    createdAt: serverTimestamp(),
  });

  resourceForm.reset();
  nodeTypeInput.value = 'folder';
  nodeTypeInput.dispatchEvent(new Event('change'));
});

courseForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    alert('Sirf admin course bana sakta hai.');
    return;
  }

  await addDoc(collection(db, 'courses'), {
    name: newCourseNameInput.value.trim(),
    desc: newCourseDescInput.value.trim(),
    theme: 'red-blue',
    badge: '🆕 New',
    createdAt: serverTimestamp(),
    createdBy: currentUser.email,
  });

  courseForm.reset();
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentUser) {
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

onSnapshot(
  query(collection(db, 'students'), orderBy('loggedInAt', 'desc')),
  (snapshot) => {
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
  },
  () => {
    adminUsersList.innerHTML = '<div class="admin-user-item">Student list load nahi ho paayi. Rules check karein.</div>';
  },
);

onSnapshot(
  query(collection(db, 'courses'), orderBy('createdAt', 'desc')),
  (snapshot) => {
    const courses = snapshot.empty
      ? DEFAULT_COURSES
      : snapshot.docs.map((docItem) => ({ ...docItem.data(), id: docItem.id }));

    courseGrid.innerHTML = '';
    courses.forEach((courseData) => {
      courseGrid.appendChild(renderCourseCard(courseData));
    });
  },
  () => {
    courseGrid.innerHTML = '';
    DEFAULT_COURSES.forEach((courseData) => {
      courseGrid.appendChild(renderCourseCard(courseData));
    });
  },
);

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  authBtn.textContent = user ? `✅ ${user.email}` : '🔐 Google Login';
  updateAdminVisibility();

  if (user) {
    await ensureProfile(user);
  }
});

showHome();
