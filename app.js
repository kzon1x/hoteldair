// ══════════════════════════════════════════
//  GRAND AZUR HOTEL — app.js
// ══════════════════════════════════════════

/* ── DATA STORE (localStorage) ── */
const DB = {
  get: k => JSON.parse(localStorage.getItem(k) || 'null'),
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

/* ── SEED DEFAULT DATA ── */
function seedData() {
  if (!DB.get('hotel_seeded')) {
    DB.set('users', [
      { id: 1, name: 'Администратор', email: 'admin@hotel.com', password: 'admin123', role: 'admin' },
      { id: 2, name: 'Диар',   email: 'diar@gmail.com',   password: '123456',   role: 'client' },
    ]);
    DB.set('rooms', [
      {
        id: 1, name: 'Стандартный номер', category: 'Стандарт',
        price: 8500, capacity: 2, area: 24,
        desc: 'Уютный номер с видом на внутренний дворик, идеален для деловых поездок.',
        features: ['Wi-Fi', 'Кондиционер', 'Телевизор', 'Сейф'],
        available: true,
        img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'
      },
      {
        id: 2, name: 'Делюкс с видом на море', category: 'Делюкс',
        price: 14000, capacity: 2, area: 36,
        desc: 'Просторный номер с панорамными окнами и роскошной ванной комнатой.',
        features: ['Wi-Fi', 'Мини-бар', 'Балкон', 'Джакузи', 'Телевизор'],
        available: true,
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80'
      },
      {
        id: 3, name: 'Семейный люкс', category: 'Люкс',
        price: 22000, capacity: 4, area: 55,
        desc: 'Двухкомнатный люкс для всей семьи с детской зоной и полным сервисом.',
        features: ['Wi-Fi', 'Кухня', 'Детская кровать', 'Игровая зона', 'Балкон'],
        available: true,
        img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'
      },
      {
        id: 4, name: 'Президентский сьют', category: 'Президентский',
        price: 55000, capacity: 2, area: 120,
        desc: 'Вершина роскоши: панорамный вид 180°, персональный батлер, приватный джакузи.',
        features: ['Wi-Fi', 'Батлер', 'Джакузи', 'Столовая', 'Рабочий кабинет', 'Терраса'],
        available: true,
        img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80'
      },
      {
        id: 5, name: 'Классический одноместный', category: 'Стандарт',
        price: 6000, capacity: 1, area: 18,
        desc: 'Компактный и функциональный номер со всем необходимым для комфортного отдыха.',
        features: ['Wi-Fi', 'Кондиционер', 'Телевизор'],
        available: true,
        img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80'
      },
      {
        id: 6, name: 'Студия с балконом', category: 'Делюкс',
        price: 11500, capacity: 2, area: 30,
        desc: 'Современная студия с кухонным уголком и большим балконом.',
        features: ['Wi-Fi', 'Кухонный уголок', 'Балкон', 'Стиральная машина'],
        available: false,
        img: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80'
      },
    ]);
    DB.set('bookings', [
      { id: 1, userId: 2, roomId: 1, checkIn: '2025-06-10', checkOut: '2025-06-15', guests: 2, total: 42500, status: 'confirmed', createdAt: '2025-05-30' },
    ]);
    DB.set('hotel_seeded', true);
  }
}

/* ── AUTH ── */
let currentUser = DB.get('currentUser');

function login(email, password) {
  const users = DB.get('users') || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    DB.set('currentUser', user);
    return user;
  }
  return null;
}

function register(name, email, password) {
  const users = DB.get('users') || [];
  if (users.find(u => u.email === email)) return { error: 'Email уже зарегистрирован' };
  const newUser = { id: Date.now(), name, email, password, role: 'client' };
  users.push(newUser);
  DB.set('users', users);
  currentUser = newUser;
  DB.set('currentUser', newUser);
  return newUser;
}

function logout() {
  currentUser = null;
  DB.set('currentUser', null);
  window.location.href = 'auth.html';
}

function requireAuth(role) {
  if (!currentUser) { window.location.href = 'auth.html'; return false; }
  if (role && currentUser.role !== role) {
    window.location.href = currentUser.role === 'admin' ? 'admin.html' : 'client.html';
    return false;
  }
  return true;
}

/* ── TOAST ── */
function showToast(msg, type = 'info') {
  let cont = document.querySelector('.toast-container');
  if (!cont) {
    cont = document.createElement('div');
    cont.className = 'toast-container';
    document.body.appendChild(cont);
  }
  const icons = { success: '✓', error: '✕', info: '✦' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span> ${msg}`;
  cont.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ── MODAL ── */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

/* ── UTILS ── */
function formatPrice(n) { return n.toLocaleString('ru-RU') + ' ₸'; }
function formatDate(s)  { return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }); }
function diffDays(a, b) { return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000)); }

function getRoom(id) { return (DB.get('rooms') || []).find(r => r.id == id); }
function getUser(id) { return (DB.get('users') || []).find(u => u.id == id); }

/* ── STATUS LABEL ── */
function statusBadge(s) {
  const map = { confirmed: ['badge-green', 'Подтверждено'], pending: ['badge-gold', 'Ожидает'], cancelled: ['badge-red', 'Отменено'] };
  const [cls, label] = map[s] || ['badge-gray', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

/* ── NAV USER BLOCK ── */
function renderNavUser(container) {
  if (!container) return;
  if (currentUser) {
    container.innerHTML = `
      <span class="user-name">${currentUser.name}</span>
      ${currentUser.role === 'admin'
        ? `<a href="admin.html" class="btn btn-outline btn-sm">Панель</a>`
        : `<a href="client.html" class="btn btn-outline btn-sm">Кабинет</a>`}
      <button class="btn btn-ghost btn-sm" onclick="logout()">Выйти</button>`;
  } else {
    container.innerHTML = `<a href="auth.html" class="btn btn-gold btn-sm">Войти</a>`;
  }
}

seedData();
