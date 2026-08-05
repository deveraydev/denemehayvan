// --- MOCK DATA GENERATION ---
const mockAnimals = [
    {
        id: 1,
        name: "Luna",
        category: "Acil",
        type: "Köpek",
        breed: "Golden Retriever Mix",
        age: "2 Yaşında",
        gender: "Dişi",
        location: "İzmir, Karşıyaka",
        shelter: "Şirinler Hayvan Barınağı",
        photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600",
        problem: "Sol arka bacakta parçalı kırık. Acil ortopedik ameliyat gerekiyor.",
        collected: 8250,
        goal: 15000,
        timePosted: "2 saat önce",
        medicalReport: "Trafik kazası sonrası kırık tespiti yapıldı. Platin takılması planlanıyor.",
        donors: [
            { name: "Ahmet Y.", amount: 2500, badge: "Diamond Supporter", date: "Bugün" },
            { name: "Selin K.", amount: 1000, badge: "Gold Supporter", date: "Dün" },
            { name: "Mehmet T.", amount: 500, badge: "Silver Supporter", date: "3 gün önce" }
        ],
        transparency: [
            { title: "Röntgen Filmi Ücreti", cost: "₺750", status: "Ödendi", date: "01.08.2026" },
            { title: "Klinik İlk Müdahale / Depozito", cost: "₺2,500", status: "Ödendi", date: "02.08.2026" }
        ]
    },
    {
        id: 2,
        name: "Maviş",
        category: "Kedi",
        type: "Kedi",
        breed: "Tekir",
        age: "8 Aylık",
        gender: "Erkek",
        location: "İzmir, Bornova",
        shelter: "Bornova Canları Derneği",
        photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600",
        problem: "Şiddetli FIP enfeksiyonu tedavisi için GS ilacı desteği aranıyor.",
        collected: 12000,
        goal: 12000,
        timePosted: "1 gün önce",
        medicalReport: "GS-441524 serum tedavisi uygulanıyor. 84 günlük süreç başlatıldı.",
        donors: [
            { name: "Irmak G.", amount: 5000, badge: "Angel Supporter", date: "Dün" }
        ],
        transparency: [
            { title: "10 Flakon GS İlacı Faturası", cost: "₺12,000", status: "Ödendi", date: "03.08.2026" }
        ]
    },
    {
        id: 3,
        name: "Gölge",
        category: "Engelli",
        type: "Kedi",
        breed: "Sokak Kedisi",
        age: "3 Yaşında",
        gender: "Erkek",
        location: "İzmir, Buca",
        shelter: "Engelli Patiler Evi",
        photo: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600",
        problem: "Omurilik hasarı sebebiyle yürüteç ve sürekli medikal bakım desteği.",
        collected: 3400,
        goal: 6000,
        timePosted: "3 gün önce",
        medicalReport: "Fizik tedavi ve özel felçli kedi yürüteci siparişi verildi.",
        donors: [
            { name: "Canan D.", amount: 1500, badge: "Platinum Supporter", date: "2 gün önce" }
        ],
        transparency: []
    }
];

const globalLeaderboard = [
    { rank: 1, name: "Irmak Günay", total: "₺45,200", badge: "Legend", count: "34 Can" },
    { rank: 2, name: "Caner Yılmaz", total: "₺32,100", badge: "Top Guardian", count: "21 Can" },
    { rank: 3, name: "Zeynep Kaya", total: "₺28,500", badge: "Diamond Supporter", count: "18 Can" },
    { rank: 4, name: "Burak Demir", total: "₺19,000", badge: "Platinum Supporter", count: "12 Can" },
    { rank: 5, name: "Ayşe Tekin", total: "₺14,200", badge: "Gold Supporter", count: "9 Can" }
];

let selectedAnimalId = null;
let currentFilter = 'all';

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // Icons init
    lucide.createIcons();

    // 8 Second Intro Video Control
    const splash = document.getElementById("splash-screen");
    const app = document.getElementById("app");
    const video = document.getElementById("intro-video");

    setTimeout(() => {
        splash.classList.add("opacity-0");
        setTimeout(() => {
            splash.style.display = "none";
            app.classList.remove("hidden");
        }, 700);
    }, 8000); // Exactly 8 seconds

    renderFeed();
    renderLeaderboard();
});

// --- AUTH MOCK ---
function handleLogin(event) {
    event.preventDefault();
    const u = document.getElementById("login-username").value;
    const p = document.getElementById("login-password").value;

    if (u === "admin" && p === "admin") {
        document.getElementById("view-auth").classList.add("hidden");
        document.getElementById("view-home").classList.remove("hidden");
        document.getElementById("bottom-nav").classList.remove("hidden");
    } else {
        alert("Hatalı kullanıcı adı veya şifre! (İpucu: admin / admin)");
    }
}

function handleLogout() {
    document.getElementById("view-profile").classList.add("hidden");
    document.getElementById("view-auth").classList.remove("hidden");
    document.getElementById("bottom-nav").classList.add("hidden");
}

// --- NAVIGATION SYSTEM ---
function switchTab(tabName) {
    const views = ['home', 'leaderboard', 'profile', 'admin', 'detail'];
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

// --- RENDER FEED & CARDS ---
function renderFeed(filterText = '') {
    const container = document.getElementById("animal-feed-list");
    container.innerHTML = "";

    const filtered = mockAnimals.filter(item => {
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        const matchesSearch = item.name.toLowerCase().includes(filterText.toLowerCase()) || 
                              item.problem.toLowerCase().includes(filterText.toLowerCase()) ||
                              item.shelter.toLowerCase().includes(filterText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-center text-sm text-gray-400 py-8">Aramanızla eşleşen can dostu bulunamadı.</p>`;
        return;
    }

    filtered.forEach(animal => {
        const percent = Math.min(Math.round((animal.collected / animal.goal) * 100), 100);
        
        const cardHtml = `
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
            <div class="relative">
                <img src="${animal.photo}" class="w-full h-56 object-cover">
                <span class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    📍 ${animal.location}
                </span>
            </div>
            
            <div class="p-4 space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-gray-900 text-lg">${animal.name}</h3>
                        <p class="text-xs text-brand-orange font-semibold">${animal.shelter}</p>
                    </div>
                    <span class="text-[10px] text-gray-400">${animal.timePosted}</span>
                </div>

                <p class="text-xs text-gray-600 line-clamp-2">${animal.problem}</p>

                <!-- Progress Bar -->
                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-bold">
                        <span class="text-brand-orange">₺${animal.collected.toLocaleString()}</span>
                        <span class="text-gray-400">Hedef: ₺${animal.goal.toLocaleString()}</span>
                    </div>
                    <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div class="bg-brand-orange h-full rounded-full transition-all duration-500" style="width: ${percent}%"></div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-2 flex items-center justify-between border-t border-gray-50">
                    <button onclick="openDetail(${animal.id})" class="w-full py-2.5 bg-brand-cream hover:bg-orange-100 text-brand-orange font-bold text-xs rounded-xl transition text-center">
                        Detayları Gör ve Destek Ol
                    </button>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += cardHtml;
    });
}

function filterAnimals() {
    const text = document.getElementById("search-input").value;
    renderFeed(text);
}

function setCategoryFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-brand-orange', 'text-white');
        btn.classList.add('bg-white', 'text-gray-600');
    });
    event.target.classList.add('bg-brand-orange', 'text-white');
    renderFeed();
}

// --- ANIMAL DETAIL VIEW ---
function openDetail(id) {
    selectedAnimalId = id;
    const animal = mockAnimals.find(a => a.id === id);
    const percent = Math.min(Math.round((animal.collected / animal.goal) * 100), 100);

    const detailContainer = document.getElementById("detail-content");
    detailContainer.innerHTML = `
        <div class="relative">
            <button onclick="switchTab('home')" class="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow">
                <i data-lucide="arrow-left" class="w-5 h-5"></i>
            </button>
            <img src="${animal.photo}" class="w-full h-72 object-cover">
        </div>

        <div class="p-4 space-y-5">
            <div>
                <span class="text-xs bg-orange-100 text-brand-orange font-bold px-2.5 py-1 rounded-full">${animal.breed}</span>
                <h1 class="text-2xl font-black text-gray-900 mt-2">${animal.name}</h1>
                <p class="text-xs text-gray-500">Barınak: ${animal.shelter} • ${animal.location}</p>
            </div>

            <!-- Donation Bar -->
            <div class="p-4 bg-brand-cream rounded-2xl border border-orange-100 space-y-2">
                <div class="flex justify-between items-baseline">
                    <span class="text-xl font-black text-brand-orange">₺${animal.collected.toLocaleString()}</span>
                    <span class="text-xs font-bold text-gray-500">Hedef: ₺${animal.goal.toLocaleString()} (%${percent})</span>
                </div>
                <div class="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div class="bg-brand-orange h-full rounded-full" style="width: ${percent}%"></div>
                </div>
                <button onclick="openDonationModal()" class="w-full mt-2 py-3 bg-brand-orange text-white font-bold rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition">
                    Tedaviye Destek Ol (Bağış Yap)
                </button>
            </div>

            <!-- Medical Info Tabs/Detail -->
            <div class="space-y-3">
                <h3 class="font-bold text-sm text-gray-900">Veteriner Teşhisi ve Öykü</h3>
                <p class="text-xs text-gray-600 leading-relaxed">${animal.medicalReport}</p>
            </div>

            <!-- Donors Ranking for this Animal -->
            <div class="space-y-3">
                <h3 class="font-bold text-sm text-gray-900">En Yüksek Bağış Yapanlar</h3>
                <div class="space-y-2">
                    ${animal.donors.map(d => `
                        <div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                            <div>
                                <p class="font-bold text-gray-800">${d.name}</p>
                                <span class="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">${d.badge}</span>
                            </div>
                            <span class="font-bold text-brand-orange">₺${d.amount}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Transparency Section -->
            <div class="space-y-3 pt-2 border-t">
                <h3 class="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                    🛡️ Şeffaflık & Harcama Kanıtları
                </h3>
                ${animal.transparency.length > 0 ? animal.transparency.map(t => `
                    <div class="p-3 bg-green-50 border border-green-100 rounded-xl text-xs flex justify-between items-center">
                        <div>
                            <p class="font-bold text-green-900">${t.title}</p>
                            <p class="text-[10px] text-green-600">${t.date} • ${t.status}</p>
                        </div>
                        <span class="font-bold text-green-800">${t.cost}</span>
                    </div>
                `).join('') : '<p class="text-xs text-gray-400">Henüz fatura/harcama belgesi yüklenmedi.</p>'}
            </div>
        </div>
    `;

    lucide.createIcons();
    switchTab('detail');
}

// --- DONATION MODAL LOGIC ---
function openDonationModal() {
    document.getElementById("donation-modal").classList.remove("hidden");
    calculateFee();
}

function closeDonationModal() {
    document.getElementById("donation-modal").classList.add("hidden");
}

function calculateFee() {
    const val = parseFloat(document.getElementById("donation-amount").value) || 0;
    const fee = val * 0.12;
    const total = val + fee;

    document.getElementById("base-amount").innerText = `₺${val.toFixed(0)}`;
    document.getElementById("fee-amount").innerText = `₺${fee.toFixed(0)}`;
    document.getElementById("total-amount").innerText = `₺${total.toFixed(0)}`;
}

function toggleDonationSubmit() {
    const checked = document.getElementById("fee-checkbox").checked;
    const btn = document.getElementById("btn-submit-donation");
    
    if (checked) {
        btn.disabled = false;
        btn.classList.remove("bg-gray-300", "cursor-not-allowed");
        btn.classList.add("bg-brand-orange", "hover:bg-orange-600", "cursor-pointer");
    } else {
        btn.disabled = true;
        btn.classList.add("bg-gray-300", "cursor-not-allowed");
        btn.classList.remove("bg-brand-orange", "hover:bg-orange-600", "cursor-pointer");
    }
}

function processPayment() {
    alert("Ödeme Sistemi Bakımdadır. (Demo Modu)");
    closeDonationModal();
}

// --- GLOBAL LEADERBOARD ---
function renderLeaderboard() {
    const container = document.getElementById("global-leaderboard-list");
    container.innerHTML = "";

    globalLeaderboard.forEach(user => {
        container.innerHTML += `
            <div class="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div class="flex items-center gap-3">
                    <span class="w-6 font-black text-sm text-gray-400">#${user.rank}</span>
                    <div>
                        <p class="font-bold text-sm text-gray-900">${user.name}</p>
                        <p class="text-[10px] text-brand-orange font-semibold">${user.badge} • ${user.count}</p>
                    </div>
                </div>
                <span class="font-black text-sm text-gray-900">${user.total}</span>
            </div>
        `;
    });
}

function toggleNotifications() {
    alert("Bildiriminiz yok.");
}
