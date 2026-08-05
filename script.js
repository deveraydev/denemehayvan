document.addEventListener('DOMContentLoaded', () => {
  const introVideo = document.getElementById('intro-video');

  if (introVideo) {
    // Otomatik videoyu oynat
    introVideo.play().catch(error => {
      console.log("Autoplay kısıtlaması nedeniyle video sessiz devam ediyor:", error);
    });

    // 8 saniyelik video tamamlandığında otomatik kapat
    introVideo.addEventListener('ended', closeIntro);
  }
});

// Intro Kapatma Fonksiyonu
function closeIntro() {
  const introOverlay = document.getElementById('intro-overlay');
  
  if (introOverlay && introOverlay.style.display !== 'none') {
    introOverlay.style.opacity = '0';
    
    setTimeout(() => {
      introOverlay.style.display = 'none';
    }, 500);
  }
}

// Filtreleme Sekmeleri
function filterCards(category) {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.card');

  tabs.forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Modal Yönetimi & Bahşiş Hesaplama
let currentItem = '';

function openModal(itemName, amount) {
  currentItem = itemName;
  document.getElementById('modal-title').innerText = `${itemName} için Destek`;
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
  
  // %12 Platform Bahşişi
  const tipAmount = includeTip ? baseAmount * 0.12 : 0;
  const total = baseAmount + tipAmount;

  document.getElementById('final-amount').innerText = `₺${total.toFixed(2)} TL`;
}

function processPayment() {
  const totalText = document.getElementById('final-amount').innerText;
  alert(`Teşekkürler! ${currentItem} için ${totalText} tutarındaki şeffaf bağışınız başarıyla tamamlandı.`);
  closeModal();
}
