document.addEventListener('DOMContentLoaded', () => {
  const introVideo = document.getElementById('intro-video');

  if (introVideo) {
    // Mobil Safari & Chrome için sessiz otomatik oynatma
    introVideo.play().catch(error => {
      console.log("Autoplay başlatıldı:", error);
    });

    // 8 saniyelik video tam bittiğinde otomatik geçiş (Geç butonu yok)
    introVideo.addEventListener('ended', closeIntro);
  }
});

// Intro Otomatik Kapatma Fonksiyonu
function closeIntro() {
  const introOverlay = document.getElementById('intro-overlay');
  
  if (introOverlay && introOverlay.style.display !== 'none') {
    introOverlay.style.opacity = '0';
    
    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 600);
  }
}

// Mobil Alt Menü (Tab) Geçişleri
function switchTab(tabId, element) {
  // Tüm içerik alanlarını gizle
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));

  // Seçilen sekme alanını göster
  document.getElementById(tabId).classList.add('active');

  // Menü butonlarının aktifliğini güncelle
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  element.classList.add('active');
}

// Filtre Hapları (Pills)
function filterCards(category, element) {
  const pills = document.querySelectorAll('.pill-btn');
  const cards = document.querySelectorAll('.mobile-card');

  pills.forEach(pill => pill.classList.remove('active'));
  element.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Bottom Sheet / Modal Yönetimi
let currentItem = '';

function openModal(itemName, amount) {
  currentItem = itemName;
  document.getElementById('modal-title').innerText = `${itemName}`;
  document.getElementById('base-amount').value = amount;
  calculateTotal();
  document.getElementById('payment-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('payment-modal').style.display = 'none';
}

function calculateTotal() {
  const baseAmount = parseFloat(document.getElementById('base-amount').value) || 0;
  const includeTip = document.getElementById('include-tip').checked;
  
  // %12 Platform Desteği
  const tipAmount = includeTip ? baseAmount * 0.12 : 0;
  const total = baseAmount + tipAmount;

  document.getElementById('final-amount').innerText = `₺${total.toFixed(2)} TL`;
}

function processPayment() {
  const totalText = document.getElementById('final-amount').innerText;
  alert(`Teşekkürler! ${currentItem} için ${totalText} ödemeniz tamamlandı.`);
  closeModal();
}
