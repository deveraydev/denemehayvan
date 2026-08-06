// Supabase Bağlantı Bilgileri
const SUPABASE_URL = 'https://bzzmordwmlngbqrasuwr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_w44uuUXk_MT1bQ1IbK8Lzg_oDOTrF10';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elemanları
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const dashboardCard = document.getElementById('dashboard-card');

const goToRegisterBtn = document.getElementById('go-to-register');
const goToLoginBtn = document.getElementById('go-to-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const regBtn = document.getElementById('reg-btn');
const logoutBtn = document.getElementById('logout-btn');

// Ekran Değiştirme Olayları
goToRegisterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginCard.classList.add('hidden');
  registerCard.classList.remove('hidden');
});

goToLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  registerCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
});

// --- KAYIT OL İŞLEMİ ---
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

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
    regBtn.disabled = true;
    regBtn.innerText = 'Kayıt Yapılıyor...';

    // 1. Supabase Auth ile Kullanıcı Oluşturma
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (authError) throw authError;

    const user = authData.user;
    let avatarUrl = '';

    // 2. Profil Resmi Yükleme (Storage - avatars Bucket)
    if (avatarFile && user) {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      avatarUrl = urlData.publicUrl;
    }

    // 3. Ek Bilgileri profiles Tablosuna Kaydetme
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

    alert('Kayıt başarıyla tamamlandı! Lütfen giriş yapın.');
    registerForm.reset();
    
    // Giriş Sayfasına Yönlendirme
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');

  } catch (err) {
    alert('Kayıt sırasında bir hata oluştu: ' + err.message);
  } finally {
    regBtn.disabled = false;
    regBtn.innerText = 'Kayıt Ol';
  }
});

// --- GİRİŞ YAP İŞLEMİ ---
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (authError) throw authError;

    // Kullanıcının Profil Bilgilerini Veritabanından Çekme
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    // Bilgileri Dashboard Ekranına Yazdırma
    document.getElementById('user-avatar').src = profile.avatar_url || 'https://via.placeholder.com/90';
    document.getElementById('user-name').innerText = profile.full_name;
    document.getElementById('user-email').innerText = authData.user.email;
    document.getElementById('info-username').innerText = profile.username;
    document.getElementById('info-tc').innerText = profile.tc_no;
    document.getElementById('info-phone').innerText = profile.phone;
    document.getElementById('info-location').innerText = `${profile.district} / ${profile.city}`;

    // Ekran Geçişi
    loginCard.classList.add('hidden');
    dashboardCard.classList.remove('hidden');

  } catch (err) {
    alert('Giriş başarısız: ' + err.message);
  }
});

// --- ÇIKIŞ YAP İŞLEMİ ---
logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  dashboardCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
  loginForm.reset();
});
