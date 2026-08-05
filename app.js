// --- STATE MANAGEMENT ---
let userTotalDonation = 4250; // TL (₺3,000 barajını geçiyor)
let cart = [];
let currentAngle = 0;
let isSpinning = false;
let selectedAnimalId = null;
let currentFilter = 'all';
let currentStoreFilter = 'all';

// Çark Dilimleri (Wheel Items)
const wheelSlices = [
    { label: "250gr Kuru Mama", color: "#FF8F00" },
    { label: "750gr Kuru Mama", color: "#FFA000" },
    { label: "250gr Yaş Mama", color: "#FFB300" },
    { label: "750gr Yaş Mama", color: "#FFC107" },
    { label: "2 Adet Ödül M.", color: "#FFCA28" },
    { label: "5 Adet Ödül M.", color: "#FFD54F" },
    { label: "İç-Dış Parazit", color: "#2E7D32" } // Premium
];

// PetFon Mağaza Ürünleri Mock Data
const storeProducts = [
    { id: 101, name: "Premium Kuru Mama (1kg)", category: "mama", price: 180, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300", desc: "Besleyici yetişkin kedi/köpek maması" },
    { id: 102, name: "Lüks Yaş Mama Konservesi", category: "mama", price: 45, image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300", desc: "Tavuklu ve jöleli gurme lezzet" },
    { id: 103, name: "Kıtır Ödül Bisküvisi", category: "mama", price: 35, image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300", desc: "Eğitim ve ödüllendirme için ideal" },
    { id: 104, name: "İç & Dış Parazit Damlası", category: "bakim", price: 220, image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=300", desc: "Tam korumalı medikal parazit bakımı" },
    { id: 105, name: "Profesyonel Tıraş & Bakım", category: "bakim", price: 350, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300", desc: "Anlaşmalı veterinerde tüy bakımı" },
    { id: 106, name: "Paslanmaz Kıtık Tarağı", category: "bakim", price: 85, image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=300", desc: "Topaklaşmış tüy açıcı çelik tarak" },
    { id: 107, name: "Ahşap Yalıtımlı Kulübe", category: "barinma", price: 850, image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=300", desc: "Sokak canları için korunaklı yuva" },
    { id: 108, name: "Peluş Kedi Yastığı", category: "barinma", price: 160, image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300", desc: "Yumuşak ve yıkanabilir dinlenme yatağı" },
    { id: 109, name: "Işıklı Köpek Tasması", category: "aksesuar", price: 95, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300", desc: "Gece yürüyüşleri için emniyetli tasma" }
];

// Hayvan İlanları Mock Data
const mockAnimals = [
    {
        id: 1,
        name: "Luna",
        category: "Acil",
        type: "Köpek",
        breed: "Golden Retriever Mix",
        age: "2 Yaşında",
        location: "İzmir, Karşıyaka",
        shelter: "Şirinler Hayvan Barınağı",
        photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
        problem: "Sol arka bacakta parçalı kırık. Acil ortopedik ameliyat gerekiyor.",
        collected: 8250,
        goal: 15000,
        timePosted: "2 saat önce",
        medicalReport: "Trafik kazası sonrası kırık tespiti yapıldı. Platin takılması planlanıyor.",
        donors: [{ name: "Ahmet Y.", amount: 2500, badge: "Diamond Supporter", date: "Bugün" }],
        transparency: [{ title: "Röntgen Filmi Ücreti", cost: "₺750", status: "Ödendi", date: "01.08.2026" }]
    },
    {
        id: 2,
        name: "Maviş",
        category: "Kedi",
        type: "Kedi",
        breed: "Tekir",
        age: "8 Aylık",
        location: "İzmir, Bornova",
        shelter: "Bornova Canları Derneği",
        photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
        problem: "Şiddetli FIP enfeksiyonu tedavisi için GS ilacı desteği aranıyor.",
        collected: 12000,
        goal: 12000,
        timePosted: "1 gün önce",
        medicalReport: "GS-441524 serum tedavisi uygulanıyor. 84 günlük süreç başlatıldı.",
        donors: [{ name: "Irmak G.", amount: 5000, badge: "Angel Supporter", date: "Dün" }],
        transparency: [{ title: "10 Flakon GS İlacı Faturası", cost: "₺12,000", status: "Ödendi", date: "03.08.2026" }]
    }
];

const globalLeaderboard = [
    { rank: 1, name: "Irmak Günay", total: "₺45,200", badge: "Legend", count: "34 Can" },
    { rank: 2, name: "Caner Yılmaz", total: "₺32,100", badge: "Top Guardian", count: "21 Can" },
    { rank: 3, name: "Zeynep Kaya", total: "₺28,500", badge: "Diamond Supporter", count: "18 Can" }
];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    // 8 Second Intro Video Control
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        const app = document.getElementById("app");
        if (splash) {
            splash.classList.add("opacity-0");
            setTimeout(() => {
                splash.style.display = "none";
                app.classList.remove("hidden");
                drawWheel(); // Çarkı çiz
                checkWheelCooldown(); // Çark geri sayım durumunu kontrol et
            }, 700);
        }
    }, 8000);

    renderFeed();
    renderStore();
    renderLeaderboard();
});

// --- AUTH LOGIC ---
function handleLogin(event) {
    event.preventDefault();
    const u = document.getElementById("login-username").value;
    const p = document.getElementById("login-password").value;

    if (u === "admin" && p === "admin") {
        document.getElementById("view-auth").classList.add("hidden");
        document.getElementById("view-home").classList.remove("hidden");
        document.getElementById("bottom-nav").classList.remove("hidden");
    } else {
        alert("Hatalı kullanıcı adı veya şifre! (Geliştirici: admin / admin)");
    }
}

function handleLogout() {
    document.getElementById("view-profile").classList.add("hidden");
    document.getElementById("view-auth").classList.remove("hidden");
    document.getElementById("bottom-nav").classList.add("hidden");
}

// --- NAVIGATION SYSTEM ---
function switchTab(tabName) {
    const views = ['home', 'petfon', 'leaderboard', 'profile', 'admin', 'detail'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
    });

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('text-brand-orange'));
    
    if (tabName !== 'detail') {
        const activeNav = document.getElementById(`nav-${tabName}`);
        if(activeNav) activeNav.classList.add('text-brand-orange');
    }

    document.getElementById(`view-${tabName}`).classList.remove('hidden');
}

// --- PETFON STORE LOGIC ---
function renderStore() {
    const container = document.getElementById("store-products-list");
    container.innerHTML = "";

    const filtered = storeProducts.filter(p => currentStoreFilter === 'all' || p.category === currentStoreFilter);

    filtered.forEach(prod => {
        container.innerHTML += `
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between p-3">
                <div>
                    <img src="${prod.image}" class="w-full h-28 object-cover rounded-xl mb-2">
                    <h4 class="font-bold text-gray-900 text-xs line-clamp-1">${prod.name}</h4>
                    <p class="text-[10px] text-gray-400 line-clamp-2 mt-0.5">${prod.desc}</p>
                </div>
                <div class="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
                    <span class="font-black text-brand-orange text-sm">₺${prod.price}</span>
                    <button onclick="addToCart(${prod.id})" class="p-2 bg-brand-cream hover:bg-orange-100 text-brand-orange rounded-xl transition">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    });
    lucide.createIcons();
}

function filterStore(cat) {
    currentStoreFilter = cat;
    document.querySelectorAll('.store-cat-btn').forEach(btn => {
        btn.classList.remove('bg-brand-orange', 'text-white');
        btn.classList.add('bg-white', 'text-gray-600');
    });
    event.target.classList.add('bg-brand-orange', 'text-white');
    renderStore();
}

// --- CART SYSTEM ---
function addToCart(productId) {
    const product = storeProducts.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    
    if (totalQty > 0) {
        badge.innerText = totalQty;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

function openCartModal() {
    renderCartItems();
    document.getElementById("cart-modal").classList.remove("hidden");
}

function closeCartModal() {
    document.getElementById("cart-modal").classList.add("hidden");
}

function renderCartItems() {
    const container = document.getElementById("cart-items-container");
    const totalPriceEl = document.getElementById("cart-total-price");
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-center text-xs text-gray-400 py-8">Sepetinizde ürün bulunmamaktadır.</p>`;
        totalPriceEl.innerText = "₺0";
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        container.innerHTML += `
            <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" class="w-10 h-10 object-cover rounded-lg">
                    <div>
                        <p class="font-bold text-gray-800">${item.name}</p>
                        <p class="text-brand-orange font-semibold">₺${item.price} x ${item.qty}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="changeCartQty(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-gray-200 text-gray-700 font-bold flex items-center justify-center">-</button>
                    <span class="font-bold text-gray-800">${item.qty}</span>
                    <button onclick="changeCartQty(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-gray-200 text-gray-700 font-bold flex items-center justify-center">+</button>
                </div>
            </div>
        `;
    });
    totalPriceEl.innerText = `₺${total}`;
}

function changeCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    updateCartBadge();
    renderCartItems();
}

function checkoutCart() {
    if (cart.length === 0) return;
    alert("Siparişiniz başarıyla alındı! Satın alımınız için teşekkürler.");
    cart = [];
    updateCartBadge();
    closeCartModal();
}

// --- PATİFON WHEEL OF FORTUNE (ÇARK SYSTEM) ---
function drawWheel() {
    const canvas = document.getElementById("wheel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const numSlices = wheelSlices.length;
    const sliceAngle = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSlices; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        // Draw Slice
        ctx.beginPath();
        ctx.moveTo(128, 128);
        ctx.arc(128, 128, 128, startAngle, endAngle);
        ctx.fillStyle = wheelSlices[i].color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        // Draw Text
        ctx.save();
        ctx.translate(128, 128);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(wheelSlices[i].label, 115, 4);
        ctx.restore();
    }
}

function spinWheel() {
    if (isSpinning) return;

    // Check minimum threshold requirement (₺3000)
    if (userTotalDonation < 3000) {
        alert("Çarkı çevirebilmek için toplam bağış miktarınızın en az ₺3,000 olması gerekmektedir.");
        return;
    }

    isSpinning = true;
    const canvas = document.getElementById("wheel-canvas");
    
    // Calculate random target slice & full rotations
    const sliceAngle = 360 / wheelSlices.length;
    const randomIndex = Math.floor(Math.random() * wheelSlices.length);
    const extraRotations = 5 * 360; // 5 tam tur
    const targetDegree = extraRotations + (360 - (randomIndex * sliceAngle + sliceAngle / 2));

    currentAngle += targetDegree;
    canvas.style.transform = `rotate(${currentAngle}deg)`;

    setTimeout(() => {
        isSpinning = false;
        const prize = wheelSlices[randomIndex].label;
        alert(`Tebrikler! Çarktan kazandığınız hediye: ${prize}. Barınak dostlarımıza ulaştırılmak üzere kaydedildi!`);
        
        // Start 72-hour Cooldown
        const cooldownEnd = Date.now() + (72 * 60 * 60 * 1000);
        localStorage.setItem("patifon_wheel_cooldown", cooldownEnd);
        checkWheelCooldown();
    }, 4000); // Animation duration
}

function checkWheelCooldown() {
    const savedCooldown = localStorage.getItem("patifon_wheel_cooldown");
    const spinBtn = document.getElementById("btn-spin-wheel");
    const msgArea = document.getElementById("wheel-cooldown-msg");

    if (savedCooldown && Date.now() < parseInt(savedCooldown)) {
        if (spinBtn) spinBtn.classList.add("hidden");
        if (msgArea) msgArea.classList.remove("hidden");

        const updateTimer = () => {
            const remaining = parseInt(savedCooldown) - Date.now();
            if (remaining <= 0) {
                localStorage.removeItem("patifon_wheel_cooldown");
                spinBtn.classList.remove("hidden");
                msgArea.classList.add("hidden");
                return;
            }
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((remaining % (1000 * 60)) / 1000);
            document.getElementById("cooldown-timer").innerText = 
                `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    } else {
        if (spinBtn) spinBtn.classList.remove("hidden");
        if (msgArea) msgArea.classList.add("hidden");
    }
}

// --- FEED & ANIMAL DETAILS ---
function renderFeed(filterText = '') {
    const container = document.getElementById("animal-feed-list");
    container.innerHTML = "";

    const filtered = mockAnimals.filter(item => {
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        const matchesSearch = item.name.toLowerCase().includes(filterText.toLowerCase()) || 
                              item.problem.toLowerCase().includes(filterText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    filtered.forEach(animal => {
        const percent = Math.min(Math.round((animal.collected / animal.goal) * 100), 100);
        container.innerHTML += `
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <img src="${animal.photo}" class="w-full h-56 object-cover">
            <div class="p-4 space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-gray-900 text-lg">${animal.name}</h3>
                        <p class="text-xs text-brand-orange font-semibold">${animal.shelter}</p>
                    </div>
                </div>
                <p class="text-xs text-gray-600">${animal.problem}</p>
                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-bold">
                        <span class="text-brand-orange">₺${animal.collected.toLocaleString()}</span>
                        <span class="text-gray-400">Hedef: ₺${animal.goal.toLocaleString()}</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-brand-orange h-full" style="width: ${percent}%"></div>
                    </div>
                </div>
                <button onclick="openDetail(${animal.id})" class="w-full py-2.5 bg-brand-cream hover:bg-orange-100 text-brand-orange font-bold text-xs rounded-xl text-center">
                    Detayları Gör ve Destek Ol
                </button>
            </div>
        </div>
        `;
    });
}

function filterAnimals() {
    renderFeed(document.getElementById("search-input").value);
}

function setCategoryFilter(cat) {
    currentFilter = cat;
    renderFeed();
}

function openDetail(id) {
    const animal = mockAnimals.find(a => a.id === id);
    const percent = Math.min(Math.round((animal.collected / animal.goal) * 100), 100);

    document.getElementById("detail-content").innerHTML = `
        <div class="relative">
            <button onclick="switchTab('home')" class="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
            <img src="${animal.photo}" class="w-full h-72 object-cover">
        </div>
        <div class="p-4 space-y-4">
            <h1 class="text-2xl font-black text-gray-900">${animal.name}</h1>
            <p class="text-xs text-gray-600">${animal.medicalReport}</p>
            <button onclick="openDonationModal()" class="w-full py-3 bg-brand-orange text-white font-bold rounded-xl">Tedaviye Destek Ol</button>
        </div>
    `;
    lucide.createIcons();
    switchTab('detail');
}

// --- DONATION MODAL ---
function openDonationModal() { document.getElementById("donation-modal").classList.remove("hidden"); }
function closeDonationModal() { document.getElementById("donation-modal").classList.add("hidden"); }
function calculateFee() {
    const val = parseFloat(document.getElementById("donation-amount").value) || 0;
    document.getElementById("base-amount").innerText = `₺${val.toFixed(0)}`;
    document.getElementById("fee-amount").innerText = `₺${(val * 0.12).toFixed(0)}`;
    document.getElementById("total-amount").innerText = `₺${(val * 1.12).toFixed(0)}`;
}
function toggleDonationSubmit() {
    const checked = document.getElementById("fee-checkbox").checked;
    const btn = document.getElementById("btn-submit-donation");
    btn.disabled = !checked;
    btn.className = checked ? "w-full py-4 bg-brand-orange text-white font-bold rounded-xl" : "w-full py-4 bg-gray-300 text-white font-bold rounded-xl cursor-not-allowed";
}
function processPayment() { alert("Ödeme Sistemi Bakımdadır (Demo)"); closeDonationModal(); }

// --- LEADERBOARD & MISC ---
function renderLeaderboard() {
    const container = document.getElementById("global-leaderboard-list");
    container.innerHTML = "";
    globalLeaderboard.forEach(user => {
        container.innerHTML += `
            <div class="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl">
                <div class="flex items-center gap-3">
                    <span class="font-black text-sm text-gray-400">#${user.rank}</span>
                    <div>
                        <p class="font-bold text-sm text-gray-900">${user.name}</p>
                        <p class="text-[10px] text-brand-orange">${user.badge}</p>
                    </div>
                </div>
                <span class="font-black text-sm text-gray-900">${user.total}</span>
            </div>
        `;
    });
}
function toggleNotifications() { alert("Bildiriminiz bulunmamaktadır."); }
