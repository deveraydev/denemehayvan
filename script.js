// ==================== VERİ SETİ & DURUM (STATE) ====================

let currentUser = null; // Login olan kullanıcı
let selectedPetId = null;

// Mock 30 Destekçi Oluşturucu
function generateMockSupporters(count) {
  const names = ["Ahmet K.", "Zeynep T.", "Mehmet S.", "Canan Y.", "Ali M.", "Ayşe B.", "Deniz G.", "Emre C.", "Selin K.", "Burak V."];
  const badges = ["Altın (Pro)", "Gümüş", "Bronz"];
  const list = [];
  
  for (let i = 1; i <= count; i++) {
    const randomName = names[i % names.length] + ` (${i})`;
    const randomBadge = badges[i % 3];
    const amount = randomBadge.includes("Altın") ? 500 : randomBadge.includes("Gümüş") ? 250 : 100;
    list.push({
      rank: i,
      name: randomName,
      amount: amount * (30 - i + 1), // Üst sıradakiler daha yüksek destek vermiş görünsün
      badge: randomBadge
    });
  }
  return list;
}

let petsData = [
  {
    id: 1,
    name: "Pamuk",
    category: "Kedi",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    description: "Arka bacaklarında çift taraflı kırık tespit edildi. Ameliyatı tamamlandı, 6 aylık fizik tedavi desteğine ihtiyacı var.",
    location: "İzmir Barınağı",
    age: "2 Yaşında",
    yearlyGoal: 12000,
    currentRaised: 7500,
    supportersCount: 30,
    topSupporters: generateMockSupporters(30)
  },
  {
    id: 2,
    name: "Dost",
    category: "Köpek",
    image: "https://images.unsplash.com/photo-1534361960057-19889db98b1e?auto=format&fit=crop&w=800&q=80",
    description: "Sokakta yaralı halde bulundu. Gençlik hastalığı tedavisi ve düzenli özel tıbbi beslenme alması gerekiyor.",
    location: "İstanbul Veteriner Kliniği",
    age: "1 Yaşında",
    yearlyGoal: 20000,
    currentRaised: 14200,
    supportersCount: 30,
    topSupporters: generateMockSupporters(30)
  },
  {
    id: 3,
    name: "Tarçın",
    category: "Köpek",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    description: "Göz ameliyatı geçirdi. Yıllık rutin aşıları, kulak damlaları ve özel diyet maması desteği bekleniyor.",
    location: "Ankara Rehabilitasyon Merkezi",
    age: "4 Yaşında",
    yearlyGoal: 15000,
    currentRaised: 3100,
    supportersCount: 15,
    topSupporters: generateMockSupporters(15)
  }
];

const globalLeaderboard = [
  { rank: 1, name: "Ahmet K.", totalDonated: 18500, badge: "Plaket Adayı VIP 🥇" },
  { rank: 2, name: "Canan Y.", totalDonated: 12800, badge: "Plaket Adayı VIP 🥈" },
  { rank: 3, name: "Zeynep T.", totalDonated: 9400, badge: "Plaket Adayı VIP 🥉" },
  { rank: 4, name: "Mehmet S.", totalDonated: 6200, badge: "Süper Destekçi" },
  { rank: 5, name: "Ali M.", totalDonated: 4100, badge: "Pati Dostu" },
];

// ==================== OTURUM (LOGİN) YÖNETİMİ ====================

const loginScreenEl = document.getElementById('login-screen');
const appContainerEl = document.getElementById('app-container');
const loginFormEl = document.getElementById('login-form');
const loginErrorEl = document.getElementById('login-error');
const headerUserNameEl = document.getElementById('header-user-name');

loginFormEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value.trim();

  // Test Giriş Kontrolü
  if (usernameInput === 'admin' && passwordInput === 'admin') {
    currentUser = usernameInput;
    headerUserNameEl.innerText = currentUser;
    
    loginScreenEl.classList.add('hidden');
    appContainerEl.classList.remove('hidden');
    loginErrorEl.classList.add('hidden');
    
    // İlk görünümü çiz
    renderFeed();
    renderLeaderboard();
  } else {
    loginErrorEl.classList.remove('hidden');
  }
});

function handleLogout() {
  currentUser = null;
  appContainerEl.classList.add('hidden');
  loginScreenEl.classList.remove('hidden');
  document.getElementById('password').value = '';
}

// ==================== ARAYÜZ ÇİZİM (RENDER) FONKSİYONLARI ====================

// 1. Akış (Feed) Listesi
const petsListEl = document.getElementById('pets-list');

function renderFeed() {
  petsListEl.innerHTML = '';
  
  petsData.forEach(pet => {
    const progress = Math.min(Math.round((pet.currentRaised / pet.yearlyGoal) * 100), 100);

    const cardHTML = `
      <div class="pet-card" onclick="openPetDetail(${pet.id})">
        <div class="pet-image-wrapper">
          <img src="${pet.image}" alt="${pet.name}">
          <span class="category-tag">${pet.category}</span>
          <span class="click-hint-badge"><i class="fa-solid fa-arrow-pointer"></i> Gönderiyi İncele</span>
        </div>
        
        <div class="pet-details">
          <div class="pet-header">
            <h2>${pet.name}</h2>
            <span class="supporters-count">${pet.supportersCount} Destekçi</span>
          </div>

          <p class="pet-desc">${pet.description}</p>

          <div class="progress-section">
            <div class="progress-labels">
              <span class="pct">%${progress} Tamamlandı</span>
              <span class="raised">₺${pet.currentRaised.toLocaleString()} / ₺${pet.yearlyGoal.toLocaleString()}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${progress}%;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    petsListEl.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// 2. Gönderi Detay Ekranı (Tıklanan Hayvanın Gönderisi)
const petDetailContentEl = document.getElementById('pet-detail-content');

function openPetDetail(petId) {
  selectedPetId = petId;
  const pet = petsData.find(p => p.id === petId);
  if (!pet) return;

  const progress = Math.min(Math.round((pet.currentRaised / pet.yearlyGoal) * 100), 100);

  // 30 Kişilik Destekçi Listesi HTML
  const supportersHTML = pet.topSupporters.map((sup, index) => {
    let topClass = '';
    if (index === 0) topClass = 'top-1';
    else if (index === 1) topClass = 'top-2';
    else if (index === 2) topClass = 'top-3';

    return `
      <div class="ranking-item ${topClass}">
        <span class="rank-num">#${index + 1}</span>
        <span class="sup-name">${sup.name}</span>
        <span class="sup-amount">₺${sup.amount.toLocaleString()} (${sup.badge})</span>
      </div>
    `;
  }).join('');

  petDetailContentEl.innerHTML = `
    <img src="${pet.image}" class="detail-banner" alt="${pet.name}">
    
    <div class="detail-info-card">
      <div class="pet-header">
        <h2>${pet.name} (${pet.category})</h2>
        <span class="supporters-count">${pet.supportersCount} Aktif Destekçi</span>
      </div>

      <p class="detail-story">${pet.description}</p>

      <div class="pet-spec-grid">
        <div class="spec-item">
          <span>Bulunduğu Yer</span>
          <strong>${pet.location}</strong>
        </div>
        <div class="spec-item">
          <span>Yaş Durumu</span>
          <strong>${pet.age}</strong>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-labels">
          <span class="pct">%${progress} Bakım Fonu Tamamlandı</span>
          <span class="raised">₺${pet.currentRaised.toLocaleString()} / ₺${pet.yearlyGoal.toLocaleString()} Yıllık</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${progress}%;"></div>
        </div>
      </div>

      <button class="btn-login" onclick="openSubscribeModal(${pet.id})">
        <i class="fa-solid fa-heart"></i>
        <span>Aylık Bakımına Katkıda Bulun</span>
      </button>
    </div>

    <!-- 30 Kişilik Sıralama Listesi -->
    <div class="supporters-ranking-box">
      <h3>${pet.name} İçin Destek Sıralaması</h3>
      <p>Bu canımızın bakımına en çok katkı sağlayan ilk 30 destekçi:</p>
      
      <div class="ranking-list">
        ${supportersHTML}
      </div>
    </div>
  `;

  switchTab('detail');
}

// 3. Genel Liderlik Tablosu
const leaderboardListEl = document.getElementById('global-leaderboard-list');

function renderLeaderboard() {
  leaderboardListEl.innerHTML = '';

  globalLeaderboard.forEach(user => {
    const rankClass = user.rank <= 3 ? `rank-${user.rank}` : '';
    const rowHTML = `
      <div class="leader-row">
        <div class="leader-user">
          <span class="rank-circle ${rankClass}">${user.rank}</span>
          <div class="user-meta">
            <p>${user.name}</p>
            <span class="user-badge">${user.badge}</span>
          </div>
        </div>
        <span class="total-amount">₺${user.totalDonated.toLocaleString()}</span>
      </div>
    `;
    leaderboardListEl.insertAdjacentHTML('beforeend', rowHTML);
  });
}

// ==================== NAVİGASYON & MODAL ====================

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  if (tabName === 'feed') {
    document.getElementById('feed-tab').classList.add('active');
    document.getElementById('nav-feed').classList.add('active');
  } else if (tabName === 'detail') {
    document.getElementById('pet-detail-tab').classList.add('active');
    document.getElementById('nav-feed').classList.add('active');
  } else if (tabName === 'leaderboard') {
    document.getElementById('leaderboard-tab').classList.add('active');
    document.getElementById('nav-leaderboard').classList.add('active');
  }
}

const modalEl = document.getElementById('subscribe-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalPetNameEl = document.getElementById('modal-pet-name');

function openSubscribeModal(petId) {
  selectedPetId = petId;
  const pet = petsData.find(p => p.id === petId);
  if (pet) {
    modalPetNameEl.innerText = `${pet.name} İçin Abonelik Paketi`;
    modalEl.classList.remove('hidden');
  }
}

closeModalBtn.addEventListener('click', () => modalEl.classList.add('hidden'));

function processSubscription(amount, tierName) {
  if (!selectedPetId) return;

  petsData = petsData.map(pet => {
    if (pet.id === selectedPetId) {
      const updatedRaised = pet.currentRaised + amount;
      const updatedCount = pet.supportersCount + 1;
      const newSupporter = {
        rank: 1,
        name: `${currentUser} (Siz)`,
        amount: amount * 12,
        badge: tierName
      };

      return {
        ...pet,
        currentRaised: updatedRaised,
        supportersCount: updatedCount,
        topSupporters: [newSupporter, ...pet.topSupporters]
      };
    }
    return pet;
  });

  modalEl.classList.add('hidden');
  openPetDetail(selectedPetId); // Detay ekranını güncelle
  alert(`Tebrikler! ${tierName} paket aboneliğiniz başarıyla başlatıldı.`);
}
