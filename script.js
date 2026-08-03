// --- Veri Durumu (State) ---
let petsData = [
  {
    id: 1,
    name: "Pamuk",
    category: "Kedi",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    description: "Arka bacaklarında kırık var, ameliyat ve 6 aylık rehabilitasyon sürecinde.",
    yearlyGoal: 12000,
    currentRaised: 7500,
    supportersCount: 18,
    topSupporters: [
      { id: 101, name: "Ahmet K.", amount: 3000, badge: "Altın" },
      { id: 102, name: "Zeynep T.", amount: 1500, badge: "Gümüş" },
      { id: 103, name: "Mehmet S.", amount: 600, badge: "Bronz" },
    ]
  },
  {
    id: 2,
    name: "Dost",
    category: "Köpek",
    image: "https://images.unsplash.com/photo-1534361960057-19889db98b1e?auto=format&fit=crop&w=800&q=80",
    description: "Barınaktan yeni kurtarıldı. Gençlik hastalığı tedavisi görüyor.",
    yearlyGoal: 20000,
    currentRaised: 4200,
    supportersCount: 9,
    topSupporters: [
      { id: 104, name: "Canan Y.", amount: 2000, badge: "Altın" },
      { id: 105, name: "Ali M.", amount: 1000, badge: "Gümüş" },
    ]
  }
];

const globalLeaderboard = [
  { rank: 1, name: "Ahmet K.", totalDonated: 14500, badge: "Plaket Adayı VIP" },
  { rank: 2, name: "Canan Y.", totalDonated: 9800, badge: "Plaket Adayı VIP" },
  { rank: 3, name: "Zeynep T.", totalDonated: 5400, badge: "Süper Destekçi" },
  { rank: 4, name: "Mehmet S.", totalDonated: 3200, badge: "Destekçi" },
];

let selectedPetId = null;

// --- DOM Elemanları ---
const petsListEl = document.getElementById('pets-list');
const leaderboardListEl = document.getElementById('global-leaderboard-list');
const modalEl = document.getElementById('subscribe-modal');
const modalPetNameEl = document.getElementById('modal-pet-name');
const closeModalBtn = document.getElementById('close-modal-btn');

// --- Arayüzü Çizme (Render) Fonksiyonları ---

// 1. Hayvan Kartlarını Çiz
function renderFeed() {
  petsListEl.innerHTML = '';
  
  petsData.forEach(pet => {
    const progress = Math.min(Math.round((pet.currentRaised / pet.yearlyGoal) * 100), 100);

    // Destekçiler Listesini Oluştur
    const supportersHTML = pet.topSupporters.slice(0, 3).map((sup, idx) => `
      <div class="supporter-item">
        <span class="sup-name">${idx + 1}. ${sup.name}</span>
        <span class="sup-badge">₺${sup.amount.toLocaleString()}/ay (${sup.badge})</span>
      </div>
    `).join('');

    const cardHTML = `
      <div class="pet-card">
        <div class="pet-image-wrapper">
          <img src="${pet.image}" alt="${pet.name}">
          <span class="category-tag">${pet.category}</span>
        </div>
        
        <div class="pet-details">
          <div class="pet-header">
            <h2>${pet.name}</h2>
            <span class="supporters-count">${pet.supportersCount} Aktif Destekçi</span>
          </div>

          <p class="pet-desc">${pet.description}</p>

          <div class="progress-section">
            <div class="progress-labels">
              <span class="pct">%${progress} Tamamlandı</span>
              <span class="raised">₺${pet.currentRaised.toLocaleString()} / ₺${pet.yearlyGoal.toLocaleString()} Yıllık</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${progress}%;"></div>
            </div>
          </div>

          <div class="top-supporters-box">
            <h4>En Çok Destek Olanlar</h4>
            ${supportersHTML}
          </div>

          <button class="btn-primary" onclick="openModal(${pet.id})">
            <i class="fa-solid fa-heart"></i>
            <span>Aylık Bakımına Destek Ol</span>
          </button>
        </div>
      </div>
    `;

    petsListEl.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// 2. Genel Liderlik Tablosunu Çiz
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

// --- Etkileşim Yönetimi ---

// Sekme Değiştirme
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  if (tabName === 'feed') {
    document.getElementById('feed-tab').classList.add('active');
    document.getElementById('nav-feed').classList.add('active');
  } else if (tabName === 'leaderboard') {
    document.getElementById('leaderboard-tab').classList.add('active');
    document.getElementById('nav-leaderboard').classList.add('active');
  }
}

// Modal Aç / Kapat
function openModal(petId) {
  selectedPetId = petId;
  const pet = petsData.find(p => p.id === petId);
  if (pet) {
    modalPetNameEl.innerText = `${pet.name} İçin Bakım Destek Paketi`;
    modalEl.classList.remove('hidden');
  }
}

function closeModal() {
  modalEl.classList.add('hidden');
  selectedPetId = null;
}

// Abonelik Satın Alma İşlemi (Simülasyon)
function handleSubscribe(amount, tierName) {
  if (!selectedPetId) return;

  petsData = petsData.map(pet => {
    if (pet.id === selectedPetId) {
      return {
        ...pet,
        currentRaised: pet.currentRaised + amount,
        supportersCount: pet.supportersCount + 1,
        topSupporters: [
          { id: Date.now(), name: "Siz (Test Kullanıcısı)", amount: amount, badge: tierName },
          ...pet.topSupporters
        ]
      };
    }
    return pet;
  });

  renderFeed();
  closeModal();
  alert(`Tebrikler! ${tierName} paket aboneliğiniz başlatıldı.`);
}

// Etkinlik Dinleyicileri
closeModalBtn.addEventListener('click', closeModal);
modalEl.addEventListener('click', (e) => {
  if (e.target === modalEl) closeModal();
});

// Sayfa Yüklendiğinde Başlat
document.addEventListener('DOMContentLoaded', () => {
  renderFeed();
  renderLeaderboard();
});
