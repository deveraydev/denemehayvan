// Supabase Yapılandırması
const SUPABASE_URL = 'https://bzzmordwmlngbqrasuwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w44uuUXk_MT1bQ1IbK8Lzg_oDOTrF10';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Uygulama Durum Yönetimi
let cart = [];
let currentTab = 'home';
let currentUserProfile = null;

// --- SAYFA BAŞLATICI & SPLASH ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initWheel();

    const splash = document.getElementById('splash-screen');
    const app = document.getElementById('app');
    const introVideo = document.getElementById('intro-video');

    let isAppShown = false;

    // Uygulama ekranını açan güvenli fonksiyon
    const showApp = () => {
        if (isAppShown) return;
        isAppShown = true;

        splash.classList.add('opacity-0');
        
        setTimeout(() => {
            splash.style.display = 'none';
            app.classList.remove('hidden');

            // Oturum durumuna göre görünürlük ayarı
            if (!currentUserProfile) {
                document.getElementById('view-auth').classList.remove('hidden');
                document.getElementById('bottom-nav').classList.add('hidden');
            } else {
                switchTab('home');
            }
        }, 700);
    };

    if (introVideo) {
        // Video bittiğinde çalıştır
        introVideo.onended = showApp;

        // Tarayıcı autoplay engeline takılırsa doğrudan geç
        introVideo.play().catch(() => {
            showApp();
        });

        // 4 saniyelik maksimum güvenlik zamanlayıcısı
        setTimeout(showApp, 4000);
    } else {
        setTimeout(showApp, 1000);
    }

    renderFeed();
    renderStore();
    renderLeaderboard();
});

// --- AUTH (GİRİŞ / KAYIT) İŞLEMLERİ ---

function toggleAuthMode(mode) {
    const loginCard = document.getElementById('auth-login-card');
    const registerCard = document.getElementById('auth-register-card');

    if (mode === 'register') {
        loginCard.classList.add('hidden');
        registerCard.classList.remove('hidden');
    } else {
        registerCard.classList.add('hidden');
        loginCard.classList.remove('hidden');
    }
}

// KAYIT OL (Supabase Auth + Storage + Profiles Tablosu)
async function handleRegister(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-register');
    
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const username = document.getElementById('reg-username').value;
    const fullName = document.getElementById('reg-fullname').value;
    const city = document.getElementById('reg-city').value;
    const district = document.getElementById('reg-district').value;
    const tcNo = document.getElementById('reg-tc').value;
    const phone = document.getElementById('reg-phone').value;
    const avatarFile = document.getElementById('reg-avatar').files[0];

    try {
        btn.disabled = true;
        btn.innerText = 'Kayıt Yapılıyor...';

        // 1. Supabase Auth Kaydı
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (authError) throw authError;
        const user = authData.user;
        let avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

        // 2. Profil Resmi Yükleme (Avatars Bucket)
        if (avatarFile && user) {
            const fileExt = avatarFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, avatarFile);

            if (!uploadError) {
                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
                avatarUrl = urlData.publicUrl;
            }
        }

        // 3. Profiles Tablosuna Veri Ekleme
        const { error: profileError } = await supabase.from('profiles').insert([{
            id: user.id,
            username: username,
            full_name: fullName,
            city: city,
            district: district,
            tc_no: tcNo,
            phone: phone,
            avatar_url: avatarUrl
        }]);

        if (profileError) throw profileError;

        alert('Kayıt başarıyla tamamlandı! Giriş yapabilirsiniz.');
        document.getElementById('register-form').reset();
        toggleAuthMode('login');

    } catch (err) {
        alert('Kayıt Hatası: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Kayıt Ol';
    }
}

// GİRİŞ YAP
async function handleLogin(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-login');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        btn.disabled = true;
        btn.innerText = 'Giriş Yapılıyor...';

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (authError) throw authError;

        // Kullanıcı Profilini Çek
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profile) {
            currentUserProfile = profile;
            updateProfileUI(profile, authData.user.email);
        }

        // Ana Akışa Yönlendir
        document.getElementById('view-auth').classList.add('hidden');
        document.getElementById('bottom-nav').classList.remove('hidden');
        switchTab('home');

    } catch (err) {
        alert('Giriş Hatası: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = 'Giriş Yap';
    }
}

// ÇIKIŞ YAP
async function handleLogout() {
    await supabase.auth.signOut();
    currentUserProfile = null;
    
    // Bottom nav gizle
    document.getElementById('bottom-nav').classList.add('hidden');
    
    // Tüm sekmeleri gizle
    const views = ['view-home', 'view-petfon', 'view-detail', 'view-leaderboard', 'view-profile', 'view-admin'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    // Auth ekranını göster
    document.getElementById('view-auth').classList.remove('hidden');
    toggleAuthMode('login');
}

// PROFİL BİLGİLERİNİ EKRANA DOLDURMA
function updateProfileUI(profile, email) {
    if (!profile) return;
    document.getElementById('profile-img').src = profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    document.getElementById('profile-name').innerText = profile.full_name || 'Kullanıcı';
    document.getElementById('profile-email').innerText = email;
    
    document.getElementById('info-username').innerText = profile.username || '-';
    document.getElementById('info-tc').innerText = profile.tc_no || '-';
    document.getElementById('info-phone').innerText = profile.phone || '-';
    document.getElementById('info-location').innerText = `${profile.district || ''} / ${profile.city || ''}`;
}

// --- TAB SEÇİMİ VE SAYFA GEÇİŞLERİ ---
function switchTab(tab) {
    currentTab = tab;
    const views = ['home', 'petfon', 'detail', 'leaderboard', 'profile', 'admin'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    const activeView = document.getElementById(`view-${tab}`);
    if (activeView) activeView.classList.remove('hidden');

    // Bottom nav aktifliği güncelleme
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('text-brand-orange');
        nav.classList.add('text-gray-400');
    });

    const activeNav = document.getElementById(`nav-${tab}`);
    if (activeNav) {
        activeNav.classList.remove('text-gray-400');
        activeNav.classList.add('text-brand-orange');
    }
}

// --- VERİ DOLDURMA (MOCK FEED & STORE) ---
const animalsData = [
    { id: 1, name: 'Luna', category: 'Acil', shelter: 'İzmir Dostlar Barınağı', urgency: 'Kritik Ameliyat', target: 5000, raised: 3250, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500' },
    { id: 2, name: 'Maviş', category: 'Kedi', shelter: 'Alsancak Pati Evi', urgency: 'Kan Tedavisi', target: 2000, raised: 1800, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500' }
];

const storeProducts = [
    { id: 101, name: 'Pro-Plan Yetişkin Kedi Maması 3kg', category: 'mama', price: 450, image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300' },
    { id: 102, name: 'Ortopedik Köpek Yatağı (L)', category: 'barinma', price: 620, image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=300' }
];

function renderFeed() {
    const container = document.getElementById('animal-feed-list');
    if (!container) return;
    container.innerHTML = animalsData.map(item => `
        <div class="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <img src="${item.image}" class="w-full h-48 object-cover">
            <div class="p-4 space-y-2">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold text-gray-900">${item.name}</h3>
                    <span class="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">${item.urgency}</span>
                </div>
                <p class="text-xs text-gray-500">${item.shelter}</p>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-brand-orange h-2 rounded-full" style="width: ${(item.raised/item.target)*100}%"></div>
                </div>
                <div class="flex justify-between text-xs font-bold pt-1">
                    <span class="text-gray-400">Toplanan: ₺${item.raised}</span>
                    <span class="text-brand-orange">Hedef: ₺${item.target}</span>
                </div>
                <button onclick="openDonationModal()" class="w-full py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl mt-2">Destek Ol</button>
            </div>
        </div>
    `).join('');
}

function renderStore() {
    const container = document.getElementById('store-products-list');
    if (!container) return;
    container.innerHTML = storeProducts.map(prod => `
        <div class="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
            <img src="${prod.image}" class="w-full h-28 object-cover rounded-xl mb-2">
            <div>
                <h4 class="font-bold text-xs text-gray-800 line-clamp-1">${prod.name}</h4>
                <p class="text-brand-orange font-black text-sm mt-1">₺${prod.price}</p>
            </div>
            <button onclick="addToCart(${prod.id})" class="w-full py-2 bg-amber-50 text-brand-orange font-bold text-xs rounded-xl border border-orange-100 mt-2 hover:bg-brand-orange hover:text-white transition">Sepete Ekle</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const container = document.getElementById('global-leaderboard-list');
    if (!container) return;
    const leaders = [
        { rank: 1, name: 'Irmak Günay', total: '₺4,250' },
        { rank: 2, name: 'Ahmet Yılmaz', total: '₺3,800' },
        { rank: 3, name: 'Selin Kaya', total: '₺3,100' }
    ];
    container.innerHTML = leaders.map(l => `
        <div class="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl text-xs">
            <div class="flex items-center gap-3">
                <span class="font-black text-brand-orange w-4">#${l.rank}</span>
                <span class="font-bold text-gray-800">${l.name}</span>
            </div>
            <span class="font-bold text-brand-green">${l.total}</span>
        </div>
    `).join('');
}

// --- SEPET VE BAĞIŞ MODAL İŞLEMLERİ ---
function openCartModal() { document.getElementById('cart-modal').classList.remove('hidden'); }
function closeCartModal() { document.getElementById('cart-modal').classList.add('hidden'); }

function openDonationModal() { document.getElementById('donation-modal').classList.remove('hidden'); }
function closeDonationModal() { document.getElementById('donation-modal').classList.add('hidden'); }

function calculateFee() {
    const amt = parseFloat(document.getElementById('donation-amount').value) || 0;
    const fee = amt * 0.12;
    document.getElementById('base-amount').innerText = `₺${amt}`;
    document.getElementById('fee-amount').innerText = `₺${fee.toFixed(0)}`;
    document.getElementById('total-amount').innerText = `₺${(amt + fee).toFixed(0)}`;
}

function toggleDonationSubmit() {
    const cb = document.getElementById('fee-checkbox');
    const btn = document.getElementById('btn-submit-donation');
    btn.disabled = !cb.checked;
    if (cb.checked) {
        btn.classList.remove('bg-gray-300', 'cursor-not-allowed');
        btn.classList.add('bg-brand-orange', 'hover:bg-orange-600');
    } else {
        btn.classList.add('bg-gray-300', 'cursor-not-allowed');
        btn.classList.remove('bg-brand-orange', 'hover:bg-orange-600');
    }
}

function processPayment() {
    alert('Bağışınız için teşekkür ederiz! Destek kaydedildi.');
    closeDonationModal();
}

function addToCart(id) {
    const prod = storeProducts.find(p => p.id === id);
    if (prod) {
        cart.push(prod);
        document.getElementById('cart-badge').innerText = cart.length;
        document.getElementById('cart-badge').classList.remove('hidden');
        renderCartItems();
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const totalPriceEl = document.getElementById('cart-total-price');
    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price;
        return `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs">
                <span>${item.name}</span>
                <span class="font-bold text-brand-orange">₺${item.price}</span>
            </div>
        `;
    }).join('');
    totalPriceEl.innerText = `₺${total}`;
}

function checkoutCart() {
    if (cart.length === 0) return alert('Sepetiniz boş!');
    alert('Siparişiniz alındı. Kâr sokak canlarına aktarıldı!');
    cart = [];
    document.getElementById('cart-badge').classList.add('hidden');
    renderCartItems();
    closeCartModal();
}

// --- PATİ ÇARKI (CANVAS) ---
function initWheel() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const colors = ['#FF7A00', '#FFB703', '#2E7D32', '#5D4037', '#FB8500', '#023047'];
    const prizes = ['1 Paket Mama', '%10 İndirim', 'Pati Rozeti', 'Mama Kabı', 'Teşekkür Kartı', 'Sürpriz Hediye'];

    let startAngle = 0;
    const arc = Math.PI / (prizes.length / 2);

    for (let i = 0; i < prizes.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(128, 128, 128, angle, angle + arc, false);
        ctx.lineTo(128, 128);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.translate(128 + Math.cos(angle + arc / 2) * 80, 128 + Math.sin(angle + arc / 2) * 80);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(prizes[i], -ctx.measureText(prizes[i]).width / 2, 0);
        ctx.restore();
    }
}

function spinWheel() {
    const canvas = document.getElementById('wheel-canvas');
    const deg = Math.floor(2000 + Math.random() * 2000);
    canvas.style.transform = `rotate(${deg}deg)`;
    setTimeout(() => {
        alert('Tebrikler! Sokak canlılarımız için hediye kazandınız!');
    }, 4000);
}
