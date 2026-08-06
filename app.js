// --- UYGULAMA DURUMU (STATE) ---
const state = {
    user: {
        totalDonation: 4500, // 3000 TL üstü olduğu için çark aktif
        canSpinWheel: true,
        lastSpinTime: null
    },
    cart: [],
    animals: [
        { id: 1, name: 'Luna', issue: 'Sol arka bacak kırığı.', shelter: 'İzmir Umut Evi', raised: 8250, target: 15000, img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500' },
        { id: 2, name: 'Maviş', issue: 'Göz enfeksiyonu ve beslenme yetersizliği.', shelter: 'Alsancak Barınağı', raised: 2100, target: 5000, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500' }
    ],
    products: [
        { id: 101, name: 'Pro-Plan Kuru Mama 750gr', price: 250, img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300' },
        { id: 102, name: 'Yaş Mama Mix 6\'lı', price: 180, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300' },
        { id: 103, name: 'İç Dış Parazit Bakımı', price: 450, img: 'https://images.unsplash.com/photo-1628009368231-7710deaf490c?w=300' },
        { id: 104, name: 'Sıcak Kedi Yastığı', price: 320, img: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=300' }
    ],
    leaderboard: [
        { name: 'Irmak Günay', amount: '₺24,500', badge: 'Diamond Supporter' },
        { name: 'Ahmet Y.', amount: '₺18,200', badge: 'Platinum Supporter' },
        { name: 'Selin K.', amount: '₺12,100', badge: 'Gold Supporter' }
    ],
    wheelPrizes: [
        '250gr Kuru Mama', '750gr Kuru Mama', '250gr Yaş Mama', 
        '750gr Yaş Mama', '2 Adet Ödül Maması', '5 Adet Ödül Maması', 
        'Premium İç/Dış Parazit'
    ]
};

// --- BAŞLATMA ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSplash();
    drawWheel();
});

// --- SPLASH & AUTH YÖNETİMİ ---
function initSplash() {
    // Videonun 8 saniye oynadıktan sonra Login ekranına atması
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.classList.add('hidden');
            document.getElementById('view-auth').classList.remove('hidden');
        }, 1000);
    }, 8000); // İsteğe göre 8000ms

    // Giriş Formu
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('login-user').value;
        const p = document.getElementById('login-pass').value;
        
        if(u === 'admin' && p === 'admin') {
            document.getElementById('view-auth').classList.add('hidden');
            document.getElementById('main-header').classList.remove('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            document.getElementById('bottom-nav').classList.remove('hidden');
            
            navTo('home');
            renderAnimals();
            renderStore();
            renderLeaderboard();
        } else {
            alert('Test için kullanıcı adı: admin, şifre: admin giriniz.');
        }
    });
}

function toggleAuth(mode) {
    const login = document.getElementById('login-section');
    const register = document.getElementById('register-section');
    if (mode === 'register') {
        login.classList.add('hidden');
        register.classList.remove('hidden');
    } else {
        register.classList.add('hidden');
        login.classList.remove('hidden');
    }
}

function logout() {
    document.getElementById('main-header').classList.add('hidden');
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('bottom-nav').classList.add('hidden');
    document.getElementById('view-auth').classList.remove('hidden');
    toggleAuth('login');
}

// --- NAVİGASYON ---
function navTo(tabId) {
    // İçerik Toggler
    ['home', 'petfon', 'leaderboard', 'profile'].forEach(id => {
        document.getElementById(`tab-${id}`).classList.add('hidden');
    });
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');

    // Renk Toggler
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-brand-orange');
        btn.classList.add('text-gray-400');
    });
    const activeBtn = document.querySelector(`.nav-btn[data-target="${tabId}"]`);
    activeBtn.classList.remove('text-gray-400');
    activeBtn.classList.add('text-brand-orange');
}

// --- RENDER FONKSİYONLARI ---
function renderAnimals() {
    const container = document.getElementById('tab-home');
    container.innerHTML = state.animals.map(animal => {
        const percent = Math.min((animal.raised / animal.target) * 100, 100);
        return `
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
            <div class="relative h-56">
                <img src="${animal.img}" class="w-full h-full object-cover">
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                    <i data-lucide="map-pin" class="w-3 h-3 text-brand-orange"></i> ${animal.shelter}
                </div>
            </div>
            <div class="p-5 space-y-4">
                <div>
                    <h3 class="text-xl font-black text-gray-900">${animal.name}</h3>
                    <p class="text-sm text-gray-500 mt-1">${animal.issue}</p>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between text-sm font-bold">
                        <span class="text-brand-orange">Toplanan: ₺${animal.raised}</span>
                        <span class="text-gray-500">Hedef: ₺${animal.target}</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-3">
                        <div class="bg-brand-orange h-3 rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
                    </div>
                </div>

                <div class="flex gap-2 pt-2">
                    <button class="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><i data-lucide="share-2" class="w-5 h-5"></i></button>
                    <button class="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><i data-lucide="bookmark" class="w-5 h-5"></i></button>
                    <button onclick="openDonation('${animal.name}')" class="flex-1 bg-brand-orange text-white font-bold rounded-xl shadow-md hover:bg-orange-600 transition">Destek Ol</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
    lucide.createIcons();
}

function renderStore() {
    const container = document.getElementById('store-grid');
    container.innerHTML = state.products.map(p => `
        <div class="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between">
            <img src="${p.img}" class="w-full h-28 object-cover rounded-xl mb-3">
            <div>
                <h4 class="font-bold text-xs text-gray-800 line-clamp-2">${p.name}</h4>
                <p class="text-brand-orange font-black text-sm mt-1">₺${p.price}</p>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full mt-3 py-2 bg-brand-cream text-brand-orange font-bold text-xs rounded-xl border border-orange-100 hover:bg-brand-orange hover:text-white transition">Sepete Ekle</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const container = document.getElementById('leaderboard-list');
    container.innerHTML = state.leaderboard.map((l, index) => `
        <div class="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm">
            <div class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'} flex items-center justify-center font-black">
                    #${index + 1}
                </div>
                <div>
                    <h4 class="font-bold text-gray-900 text-sm">${l.name}</h4>
                    <span class="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-bold">${l.badge}</span>
                </div>
            </div>
            <span class="font-black text-brand-orange">${l.amount}</span>
        </div>
    `).join('');
}

// --- BAĞIŞ SİSTEMİ (%12 Kesinti) ---
function openDonation(name) {
    document.getElementById('donate-animal-name').innerText = name;
    document.getElementById('donate-amount').value = '';
    document.getElementById('fee-consent').checked = false;
    calculateFee();
    toggleDonationBtn();
    
    const modal = document.getElementById('donation-modal');
    const sheet = document.getElementById('donation-sheet');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('modal-active');
        sheet.classList.add('sheet-active');
    }, 10);
}

function closeDonation() {
    const modal = document.getElementById('donation-modal');
    const sheet = document.getElementById('donation-sheet');
    modal.classList.remove('modal-active');
    sheet.classList.remove('sheet-active');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function calculateFee() {
    const amt = parseFloat(document.getElementById('donate-amount').value) || 0;
    const fee = amt * 0.12;
    const total = amt + fee;
    
    document.getElementById('summary-base').innerText = `₺${amt.toFixed(2)}`;
    document.getElementById('summary-fee').innerText = `₺${fee.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `₺${total.toFixed(2)}`;
}

function toggleDonationBtn() {
    const checked = document.getElementById('fee-consent').checked;
    const amt = parseFloat(document.getElementById('donate-amount').value) || 0;
    const btn = document.getElementById('btn-submit-donate');
    
    if (checked && amt > 0) {
        btn.disabled = false;
        btn.classList.remove('bg-gray-300', 'cursor-not-allowed');
        btn.classList.add('bg-brand-orange');
    } else {
        btn.disabled = true;
        btn.classList.add('bg-gray-300', 'cursor-not-allowed');
        btn.classList.remove('bg-brand-orange');
    }
}

function processDonation() {
    alert("Payment System Under Maintenance\n\n(Ödeme Sistemi Bakımda)");
    closeDonation();
}

// --- SEPET SİSTEMİ (PETFON) ---
function addToCart(id) {
    const prod = state.products.find(p => p.id === id);
    if(prod) {
        state.cart.push(prod);
        updateCartBadge();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    badge.innerText = state.cart.length;
    if(state.cart.length > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    const sheet = document.getElementById('cart-sheet');
    const container = document.getElementById('cart-items');
    
    if(state.cart.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-500 mt-10 text-sm">Sepetiniz boş. Sokaktaki dostlarımız için bir şeyler ekleyin.</p>`;
        document.getElementById('cart-total').innerText = '₺0';
    } else {
        let total = 0;
        container.innerHTML = state.cart.map(c => {
            total += c.price;
            return `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <span class="text-sm font-semibold">${c.name}</span>
                <span class="text-brand-orange font-bold">₺${c.price}</span>
            </div>
            `;
        }).join('');
        document.getElementById('cart-total').innerText = `₺${total}`;
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('modal-active');
        sheet.classList.add('sheet-active');
    }, 10);
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    const sheet = document.getElementById('cart-sheet');
    modal.classList.remove('modal-active');
    sheet.classList.remove('sheet-active');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function checkout() {
    if(state.cart.length === 0) return alert('Sepetiniz boş!');
    alert("Payment System Under Maintenance\n\nÜrünler barınak adresine iletilecektir.");
    state.cart = [];
    updateCartBadge();
    closeCart();
}

// --- PATİ ÇARKI (Canvas Tabanlı) ---
function drawWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prizes = state.wheelPrizes;
    const colors = ['#FF7A00', '#FFB703', '#2E7D32', '#5D4037', '#FB8500', '#023047', '#E76F51'];
    
    const arc = Math.PI * 2 / prizes.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX;

    for (let i = 0; i < prizes.length; i++) {
        const angle = i * arc;
        
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arc);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Inter';
        ctx.translate(centerX + Math.cos(angle + arc / 2) * (radius * 0.65), 
                      centerY + Math.sin(angle + arc / 2) * (radius * 0.65));
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        const textWidth = ctx.measureText(prizes[i]).width;
        ctx.fillText(prizes[i], -textWidth / 2, 0);
        ctx.restore();
    }
}

function spinWheel() {
    if (!state.user.canSpinWheel) return;
    
    const canvas = document.getElementById('wheel-canvas');
    const btn = document.getElementById('btn-spin');
    const timerEl = document.getElementById('wheel-timer');
    
    btn.disabled = true;
    btn.innerText = 'Çevriliyor...';
    btn.classList.add('bg-gray-400');
    
    // Rastgele dönüş açısı (Min 5 tur)
    const randomDeg = Math.floor(1800 + Math.random() * 1800);
    canvas.style.transform = `rotate(${randomDeg}deg)`;
    
    setTimeout(() => {
        // Çark durdu
        alert('Tebrikler! Sokak hayvanları için sürpriz destek ödülü kazandınız!');
        state.user.canSpinWheel = false;
        
        // 72 Saat bekleme durumu UI güncellemesi
        btn.classList.add('hidden');
        timerEl.classList.remove('hidden');
    }, 4000); // CSS transition süresi ile aynı
}
