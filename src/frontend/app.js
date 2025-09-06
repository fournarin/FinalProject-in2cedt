/*
  Replaced renderer to produce a two-column auth layout:
  - left: visual / illustration
  - right: card with login/register tabs and forms
  Keeps existing register/login fetch logic (POST /api/auth/*).
*/

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  const toBase64 = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const createTextInput = (labelText, id, type = 'text', placeholder = '') => {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-row';
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = placeholder;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return { wrapper, input };
  };

  const renderLayout = () => {
    app.innerHTML = '';

    const layout = document.createElement('div');
    layout.className = 'auth-layout';

    // Left visual panel
    const left = document.createElement('div');
    left.className = 'auth-left';
    left.innerHTML = `
      <div class="auth-visual">
        <h1 class="visual-title">CP Platform</h1>
        <p class="visual-sub">ฝึกทำโจทย์ C++ สำหรับคณะวิศวกรรมศาสตร์ — Computer Engineering & Digital Technology</p>
      </div>
    `;

    // Right auth card
    const right = document.createElement('div');
    right.className = 'auth-right';

    const card = document.createElement('div');
    card.className = 'auth-card';

    const switchRow = document.createElement('div');
    switchRow.className = 'auth-switch';
    const loginBtn = document.createElement('button');
    loginBtn.id = 'btn-login';
    loginBtn.className = 'switch-btn active';
    loginBtn.textContent = 'เข้าสู่ระบบ';
    const registerBtn = document.createElement('button');
    registerBtn.id = 'btn-register';
    registerBtn.className = 'switch-btn';
    registerBtn.textContent = 'สมัครสมาชิก';
    switchRow.appendChild(loginBtn);
    switchRow.appendChild(registerBtn);
    card.appendChild(switchRow);

    const panelWrap = document.createElement('div');
    panelWrap.className = 'panel-wrap';

    // LOGIN form
    const loginForm = document.createElement('form');
    loginForm.id = 'login-form';
    loginForm.className = 'auth-form';
    loginForm.innerHTML = `
      <div class="form-row">
        <label for="login-email">Email (Gmail)</label>
        <input id="login-email" type="email" autocomplete="email" placeholder="you@gmail.com" />
      </div>
      <div class="form-row">
        <label for="login-password">รหัสผ่าน</label>
        <input id="login-password" type="password" autocomplete="current-password" placeholder="••••••••" />
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-btn">เข้าสู่ระบบ</button>
      </div>
      <div id="login-error" class="error" aria-live="assertive"></div>
    `;

    // REGISTER form
    const registerForm = document.createElement('form');
    registerForm.id = 'register-form';
    registerForm.className = 'auth-form';
    registerForm.style.display = 'none';
    registerForm.innerHTML = `
      <div class="form-row">
        <label for="first-name">ชื่อ</label>
        <input id="first-name" type="text" autocomplete="given-name" placeholder="ชื่อจริง" />
      </div>
      <div class="form-row">
        <label for="last-name">นามสกุล</label>
        <input id="last-name" type="text" autocomplete="family-name" placeholder="นามสกุล" />
      </div>
      <div class="form-row">
        <label for="reg-email">Email (Gmail)</label>
        <input id="reg-email" type="email" autocomplete="email" placeholder="you@gmail.com" />
      </div>
      <div class="form-row">
        <label for="student-id">รหัสนิสิต (10 ตัว)</label>
        <input id="student-id" type="text" inputmode="numeric" placeholder="0123456789" />
      </div>
      <div class="form-row">
        <label for="reg-password">รหัสผ่าน</label>
        <input id="reg-password" type="password" autocomplete="new-password" placeholder="สร้างรหัสผ่าน" />
      </div>
      <div class="form-row">
        <label for="profile-pic">รูปโปรไฟล์ (ไม่บังคับ)</label>
        <input id="profile-pic" type="file" accept="image/*" />
        <div id="profile-preview" class="profile-preview" style="display:none;"></div>
      </div>
      <div class="form-actions">
        <button type="submit" class="primary-btn">สมัครสมาชิก</button>
        <button type="button" class="secondary-btn" id="clear-register">ล้างค่า</button>
      </div>
      <div id="reg-error" class="error" aria-live="assertive"></div>
    `;

    panelWrap.appendChild(loginForm);
    panelWrap.appendChild(registerForm);
    card.appendChild(panelWrap);
    right.appendChild(card);

    layout.appendChild(left);
    layout.appendChild(right);
    app.appendChild(layout);

    // Tab switching
    const showLogin = () => {
      loginForm.style.display = '';
      registerForm.style.display = 'none';
      loginBtn.classList.add('active');
      registerBtn.classList.remove('active');
    };
    const showRegister = () => {
      loginForm.style.display = 'none';
      registerForm.style.display = '';
      registerBtn.classList.add('active');
      loginBtn.classList.remove('active');
    };
    loginBtn.addEventListener('click', showLogin);
    registerBtn.addEventListener('click', showRegister);

    // Profile preview for register
    const picInput = document.getElementById('profile-pic');
    const preview = document.getElementById('profile-preview');
    if (picInput && preview) {
      picInput.addEventListener('change', () => {
        const f = picInput.files[0];
        if (!f) { preview.style.display = 'none'; preview.innerHTML = ''; return; }
        const reader = new FileReader();
        reader.onload = () => {
          preview.style.display = 'flex';
          preview.innerHTML = `<img src="${reader.result}" alt="profile preview" />`;
        };
        reader.readAsDataURL(f);
      });
    }

    // Register submit
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('reg-error'); errEl.textContent = '';
      const firstName = document.getElementById('first-name').value.trim();
      const lastName = document.getElementById('last-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const studentId = document.getElementById('student-id').value.trim();
      const password = document.getElementById('reg-password').value;
      if (!firstName || !lastName || !email || !studentId || !password) {
        errEl.textContent = 'กรุณากรอกข้อมูลให้ครบ';
        return;
      }
      if (!/^\d{10}$/.test(studentId)) {
        errEl.textContent = 'รหัสนิสิตต้องเป็นตัวเลข 10 ตัว';
        return;
      }
      try {
        const file = document.getElementById('profile-pic').files[0];
        const profilePicture = await toBase64(file);
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ firstName, lastName, email, studentId, password, profilePicture })
        });
        const data = await res.json();
        if (res.ok) {
          alert('สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ');
          showLogin();
        } else {
          errEl.textContent = data.message || 'Registration failed';
        }
      } catch (err) {
        document.getElementById('reg-error').textContent = 'Error uploading profile picture or network error';
      }
    });

    // Login submit
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errEl = document.getElementById('login-error'); errEl.textContent = '';
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!email || !password) { errEl.textContent = 'กรุณากรอกข้อมูลให้ครบ'; return; }
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('authToken', data.token);
          // simple success flow: show profile inside card
          const profileRes = await fetch('/api/auth/profile', { headers: { 'Authorization': `Bearer ${data.token}` }});
          if (profileRes.ok) {
            const profile = await profileRes.json();
            panelWrap.innerHTML = `
              <div class="profile-area">
                <h3>ยินดีต้อนรับ, ${profile.first_name} ${profile.last_name}</h3>
                <p>${profile.email}</p>
                <p>รหัสนิสิต: ${profile.student_id}</p>
                ${profile.profile_picture ? `<img src="${profile.profile_picture}" alt="profile" class="profile-card-img" />` : ''}
                <div style="margin-top:12px;"><button id="logout-btn" class="secondary-btn">Logout</button></div>
              </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => {
              localStorage.removeItem('authToken');
              renderLayout();
            });
          } else {
            alert('Login success (could not fetch profile)');
          }
        } else {
          errEl.textContent = data.message || 'Login failed';
        }
      } catch (err) {
        errEl.textContent = 'Network error';
      }
    });

    // Clear register
    const clearBtn = document.getElementById('clear-register');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        registerForm.reset();
        const prev = document.getElementById('profile-preview');
        if (prev) { prev.style.display = 'none'; prev.innerHTML = ''; }
      });
    }
  };

  renderLayout();
});