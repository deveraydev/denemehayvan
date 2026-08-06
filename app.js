// Supabase Yapılandırması
const SUPABASE_URL = 'https://bzzmordwmlngbqrasuwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w44uuUXk_MT1bQ1IbK8Lzg_oDOTrF10';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let cart = [];
let currentTab = 'home';
let currentUserProfile = null;

// --- SAYFA BAŞLATICI ---
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }

    // Doğrudan Auth Ekranını Aç
    const authView = document.getElementById('view-auth');
    if (authView) authView.classList.remove('hidden');

    renderFeed();
    renderStore();
    renderLeaderboard();
});

// --- EKRAN GEÇİŞİ (GİRİŞ / KAYIT) ---
function toggleAuthMode(mode) {
    const loginCard = document.getElementById('auth-login-card');
    const registerCard = document.getElementById('auth-register-card');

    if (mode === 'register') {
        if (loginCard) loginCard.classList.add('hidden');
        if (registerCard) registerCard.classList.remove('hidden');
    } else {
        if (registerCard) registerCard.classList.add('hidden');
        if (loginCard) loginCard.classList.remove('hidden');
    }
}

// KAYIT OL
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
    const avatarInput = document.getElementById('reg-avatar');
    const avatarFile = avatarInput && avatarInput.files ? avatarInput.files[0] : null;

    try {
        btn.disabled = true;
        btn.innerText = 'Kayıt Yapılıyor...';

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (authError) throw authError;
        const user = authData.user;
        let avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

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

        if (user) {
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
        }

        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
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

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profile) {
            currentUserProfile = profile;
            updateProfileUI(profile, authData.user.email);
        }

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
    
    document.getElementById('bottom-nav').classList.add('hidden');
    
    const views = ['view-home', 'view-petfon', 'view-leaderboard', 'view-profile', 'view-admin'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    document.getElementById('view-auth').classList.remove('hidden');
    toggleAuthMode('login');
}

function updateProfileUI(profile, email) {
    if (!profile) return;
    const imgEl = document.getElementById('profile-img');
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');

    if (imgEl) imgEl.src = profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    if (nameEl) nameEl.innerText = profile.full_name || 'Kullanıcı';
    if (emailEl) emailEl.innerText = email;
}

// TAB SEÇİMİ
function switchTab(tab) {
    currentTab = tab;
    const views = ['home', 'petfon', 'leaderboard', 'profile', 'admin'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    const activeView = document.getElementById(`view-${tab}`);
    if (activeView) activeView.classList.remove('hidden');

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

// MOCK DATA RENDER
function renderFeed() {
    const container = document.getElementById('animal-feed-list');
    if (!container) return;
    container.innerHTML = `
        <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 class="font-bold">Luna - Tedavi Desteği</h3>
            <p class="text-xs text-gray-500">İzmir Dostlar Barınağı</p>
            <button onclick="openDonationModal()" class="w-full py-2 bg-brand-orange text-white text-xs font-bold rounded-xl mt-2">Destek Ol</button>
        </div>
    `;
}

function renderStore() {
    const container = document.getElementById('store-products-list');
    if (!container) return;
    container.innerHTML = `
        <div class="bg-white border p-3 rounded-xl text-xs">
            <p class="font-bold">Kedi Maması 3kg</p>
            <p class="text-brand-orange font-bold">₺450</p>
        </div>
    `;
}

function renderLeaderboard() {
    const container = document.getElementById('global-leaderboard-list');
    if (!container) return;
    container.innerHTML = `
        <div class="p-3 bg-white border rounded-xl text-xs flex justify-between">
            <span>1. Irmak Günay</span>
            <span class="font-bold text-brand-green">₺4,250</span>
        </div>
    `;
}

function openCartModal() { document.getElementById('cart-modal').classList.remove('hidden'); }
function closeCartModal() { document.getElementById('cart-modal').classList.add('hidden'); }
function openDonationModal() { document.getElementById('donation-modal').classList.remove('hidden'); }
function closeDonationModal() { document.getElementById('donation-modal').classList.add('hidden'); }
