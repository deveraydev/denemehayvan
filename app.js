// --- Veriler ---
const animals = [
    { id: 1, name: "Luna", img: "https://images.unsplash.com/photo-1537151608804-ea2f1fa26685?w=500&q=80", shelter: "İzmir Umut Evi", location: "İzmir, Bornova", ailment: "Sol arka bacak kırığı, acil operasyon gerekiyor.", gathered: 8250, target: 15000 },
    { id: 2, name: "Maviş", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80", shelter: "Alsancak Barınağı", location: "İzmir, Konak", ailment: "Göz enfeksiyonu ve beslenme yetersizliği.", gathered: 2100, target: 5000 },
    { id: 3, name: "Karabaş", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&q=80", shelter: "Pati Yuvası", location: "İzmir, Buca", ailment: "Genel sağlık taraması ve aşı eksiklikleri.", gathered: 900, target: 3000 },
    { id: 4, name: "Tarçın", img: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500&q=80", shelter: "Sokak Dostları Derneği", location: "İzmir, Karşıyaka", ailment: "Deri rahatsızlığı, özel şampuan ve ilaç tedavisi.", gathered: 4500, target: 6000 }
];

const shopProducts = [
    { id: 101, name: "Pro Plan Kuru Mama 750gr", price: 250, img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80" },
    { id: 102, name: "Yaş Mama Mix 6'lı", price: 180, img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&q=80" },
    { id: 103, name: "İç/Dış Parazit Bakımı", price: 450, img: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=300&q=80" },
    { id: 104, name: "Sıcak Kedi Yatağı", price: 320, img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=300&q=80" },
    { id: 105, name: "Köpek Çiğneme Oyuncağı", price: 120, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=300&q=80" },
    { id: 106, name: "Vitamin Takviyesi", price: 200, img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&q=80" }
];

let cartTotal = 0;
let currentPaymentBase = 0;

// --- Navigasyon ve Temel İşlevler ---
function login() {
    document.getElementById('view-login').classList.remove('active');
    document.getElementById('main-navbar').style.display = 'flex';
    document.getElementById('bottom-nav').style.display = 'flex';
    navigate('view-home');
    renderAnimals();
    renderShop();
}

function logout() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('main-navbar').style.display = 'none';
    document.getElementById('bottom-nav').style.display = 'none';
    document.getElementById('view-login').classList.add('active');
}

function navigate(viewId, navElement = null) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if(navElement) {
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        navElement.classList.add('active');
    }
}

// --- Render Fonksiyonları ---
function renderAnimals() {
    const list = document.getElementById('animal-list');
    list.innerHTML = '';
    animals.forEach(animal => {
        let percent = (animal.gathered / animal.target) * 100;
        list.innerHTML += `
            <div class="animal-card">
                <img src="${animal.img}" alt="${animal.name}">
                <div class="card-body">
                    <h3>${animal.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${animal.shelter}</p>
                    <div style="margin-top:10px; background:#eee; height:8px; border-radius:4px; overflow:hidden;">
                        <div style="width:${percent}%; background:var(--primary-color); height:100%;"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:5px;">
                        <span>Toplanan: ₺${animal.gathered}</span>
                        <span>Hedef: ₺${animal.target}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-outline" onclick="openAnimalDetail(${animal.id})">Detayları Gör</button>
                        <button class="btn btn-primary" onclick="openPaymentModal(0, 'custom')">Destek Ol</button>
                    </div>
                </div>
            </div>
        `;
    });
}

function openAnimalDetail(id) {
    const animal = animals.find(a => a.id === id);
    const content = document.getElementById('animal-detail-content');
    
    content.innerHTML = `
        <img src="${animal.img}" alt="${animal.name}" class="detail-header-img" style="margin:-20px -20px 20px -20px; width:calc(100% + 40px);">
        <h2>${animal.name}</h2>
        <div class="info-badge"><i class="fas fa-map-marker-alt"></i> ${animal.location}</div>
        <div class="info-badge"><i class="fas fa-home"></i> ${animal.shelter}</div>
        <h4 class="mt-10">Sağlık Durumu</h4>
        <p>${animal.ailment}</p>
        
        <div class="product-support-list">
            <h4>${animal.name} İçin Özel İhtiyaçlar</h4>
            <div class="support-item">
                <div class="support-item-info">
                    <span>5kg Kuru Mama Gönder</span>
                    <span class="support-item-price">₺400</span>
                </div>
                <button class="btn btn-primary" onclick="openPaymentModal(400, 'fixed')">Destek Ol</button>
            </div>
            <div class="support-item">
                <div class="support-item-info">
                    <span>Tedavi Masrafına Katkı (Minik)</span>
                    <span class="support-item-price">₺250</span>
                </div>
                <button class="btn btn-primary" onclick="openPaymentModal(250, 'fixed')">Destek Ol</button>
            </div>
        </div>
        <button class="btn btn-outline btn-block mt-20" onclick="openPaymentModal(0, 'custom')">Serbest Miktarda Destek Ol</button>
    `;
    navigate('view-animal-detail');
}

function renderShop() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    shopProducts.forEach(product => {
        list.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}">
                <h4>${product.name}</h4>
                <div class="price">₺${product.price}</div>
                <button class="btn btn-outline btn-block" style="font-size:12px; padding:8px;" onclick="addToCart(${product.price})">Sepete Ekle</button>
            </div>
        `;
    });
}

function addToCart(price) {
    cartTotal += price;
    let countEl = document.getElementById('cart-count');
    countEl.innerText = parseInt(countEl.innerText) + 1;
    
    // Küçük geri bildirim animasyonu
    countEl.style.transform = "scale(1.5)";
    setTimeout(() => { countEl.style.transform = "scale(1)"; }, 200);
}

// --- Ödeme ve %15 Komisyon Mantığı ---
function openPaymentModal(amount, type) {
    document.getElementById('payment-modal').style.display = 'flex';
    document.getElementById('fee-consent').checked = false;
    document.getElementById('pay-btn').disabled = true;
    
    const customGroup = document.getElementById('custom-amount-group');
    const customInput = document.getElementById('custom-amount');
    
    if(type === 'custom') {
        customGroup.style.display = 'block';
        customInput.value = '';
        currentPaymentBase = 0;
    } else if (type === 'cart') {
        customGroup.style.display = 'none';
        currentPaymentBase = cartTotal;
        if(cartTotal === 0) {
            alert("Sepetiniz boş.");
            closeModal('payment-modal');
            return;
        }
    } else { // fixed
        customGroup.style.display = 'none';
        currentPaymentBase = amount;
    }
    
    updatePaymentUI();
}

function calculateTotal() {
    const inputVal = parseFloat(document.getElementById('custom-amount').value) || 0;
    currentPaymentBase = inputVal;
    updatePaymentUI();
}

function updatePaymentUI() {
    let fee = currentPaymentBase * 0.15;
    let total = currentPaymentBase + fee;
    
    document.getElementById('payment-subtotal').innerText = `₺${currentPaymentBase.toFixed(2)}`;
    document.getElementById('payment-fee').innerText = `₺${fee.toFixed(2)}`;
    document.getElementById('payment-total').innerText = `₺${total.toFixed(2)}`;
    
    togglePayButton();
}

function togglePayButton() {
    const isChecked = document.getElementById('fee-consent').checked;
    const btn = document.getElementById('pay-btn');
    
    if(isChecked && currentPaymentBase > 0) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function completePayment() {
    alert("Desteğiniz başarıyla alınmıştır. Patili dostlarımız adına teşekkür ederiz!");
    closeModal('payment-modal');
    cartTotal = 0;
    document.getElementById('cart-count').innerText = "0";
}

// --- Profil: Çark ve Destek Kartı Mantığı ---
let isSpinning = false;
function spinWheel() {
    if(isSpinning) return;
    isSpinning = true;
    
    const wheel = document.getElementById('wheel');
    const resultText = document.getElementById('wheel-result');
    const btn = document.getElementById('spin-btn');
    
    resultText.innerText = "";
    btn.disabled = true;
    
    // Rastgele dönüş açısı (en az 5 tur = 1800 derece)
    const randomDegree = Math.floor(Math.random() * 360) + 1800; 
    wheel.style.transform = `rotate(${randomDegree}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        btn.disabled = false;
        
        // Hangi dilimin geldiğini hesaplama (Basit simülasyon)
        const actualDegree = randomDegree % 360;
        let prize = "";
        
        // Çark dilimleri tersten okunur çünkü ok sabit, çark dönüyor
        if (actualDegree >= 0 && actualDegree < 60) prize = "1 Kutu Yaş Mama";
        else if (actualDegree >= 60 && actualDegree < 120) prize = "Sürpriz Oyuncak";
        else if (actualDegree >= 120 && actualDegree < 180) prize = "100gr Yaş Mama";
        else if (actualDegree >= 180 && actualDegree < 240) prize = "Ödül Maması";
        else if (actualDegree >= 240 && actualDegree < 300) prize = "150gr Kuru Mama";
        else prize = "İç/Dış Parazit";

        resultText.innerHTML = `Tebrikler! <br><span style="color:#333;">${prize} kazandınız.</span><br> <span style="font-size:12px; font-weight:normal; color:#777;">Ödülünüz sistem üzerinden bir barınağa yönlendirilmiştir.</span>`;
        
    }, 4000); // CSS transition süresi ile aynı (4s)
}

function showSupportCard() {
    document.getElementById('support-card-modal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}
