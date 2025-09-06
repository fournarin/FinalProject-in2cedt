// New: renders dashboard / problem archive / problem detail + grader UI + shared code browser
(function () {
  function el(tag, cls = '', html = '') {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html) d.innerHTML = html;
    return d;
  }

  function statusBadge(ch) {
    const map = {
      P: { text: 'P', color: '#16a34a' },
      T: { text: 'T', color: '#f59e0b' },
      X: { text: 'X', color: '#dc2626' },
      '-': { text: '-', color: '#6b7280' }
    };
    const m = map[ch] || { text: ch, color: '#374151' };
    const s = el('span', 'status-badge', m.text);
    s.style.display = 'inline-block';
    s.style.padding = '6px 8px';
    s.style.borderRadius = '6px';
    s.style.background = m.color;
    s.style.color = '#fff';
    s.style.fontWeight = '700';
    s.style.marginRight = '6px';
    return s;
  }

  async function fetchJSON(url, opts = {}) {
    const token = localStorage.getItem('authToken');
    opts.headers = opts.headers || {};
    if (token) opts.headers['Authorization'] = `Bearer ${token}`;
    try {
      const r = await fetch(url, opts);
      return { ok: r.ok, status: r.status, json: await r.json().catch(()=>null) };
    } catch (e) {
      return { ok: false, status: 0, json: null, error: e };
    }
  }

  window.renderDashboard = async function(containerId = 'app') {
    const root = document.getElementById(containerId);
    if (!root) return;
    root.innerHTML = '<div class="container main-content"><h2>Loading...</h2></div>';

    // layout: left = problems list by category, right = problem detail / grader
    const wrapper = el('div', 'dashboard-wrap');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '18px';
    wrapper.style.alignItems = 'flex-start';

    const leftCol = el('div', 'dash-left');
    leftCol.style.flex = '1 1 40%';
    const rightCol = el('div', 'dash-right');
    rightCol.style.flex = '1 1 60%';

    // fetch problems
    const pResp = await fetchJSON('/api/problems');
    const problems = (pResp.ok && Array.isArray(pResp.json)) ? pResp.json : [];
    // group by category
    const byCat = {};
    problems.forEach(p => {
      const c = p.category || 'Uncategorized';
      if (!byCat[c]) byCat[c] = [];
      byCat[c].push(p);
    });

    leftCol.appendChild(el('h3','', 'คลังข้อสอบเก่า'));
    for (const cat of Object.keys(byCat)) {
      const sec = el('section','problem-cat');
      sec.appendChild(el('h4','', cat));
      const ul = el('ul','problem-list');
      byCat[cat].forEach(p => {
        const li = el('li','problem-item');
        li.style.listStyle = 'none';
        li.style.padding = '10px';
        li.style.borderBottom = '1px solid #eef2f7';
        const title = el('div','problem-title', `<strong>${p.title}</strong>`);
        const btnRow = el('div','', '');
        btnRow.style.marginTop = '8px';
        const viewBtn = el('button','secondary-btn','รายละเอียด');
        viewBtn.addEventListener('click', ()=> openProblem(p.id));
        const dlBtn = el('button','primary-btn','ดาวน์โหลด PDF');
        dlBtn.style.marginLeft = '8px';
        dlBtn.addEventListener('click', ()=> {
          const url = p.pdf_file || p.pdfFile || '#';
          window.open(url, '_blank');
        });
        btnRow.appendChild(viewBtn);
        btnRow.appendChild(dlBtn);
        li.appendChild(title);
        if (p.description) li.appendChild(el('p','',''+p.description));
        li.appendChild(btnRow);
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      leftCol.appendChild(sec);
    }

    // Shared codes panel
    const sharedSec = el('section','shared-section');
    sharedSec.appendChild(el('h4','','โค้ดที่ผู้ใช้แชร์'));
    const sharedList = el('div','');
    sharedSec.appendChild(sharedList);
    leftCol.appendChild(sharedSec);

    // fetch shared submissions
    const sResp = await fetchJSON('/api/submissions/shared');
    if (sResp.ok && Array.isArray(sResp.json)) {
      if (!sResp.json.length) sharedList.innerHTML = '<p>ยังไม่มีโค้ดที่แชร์</p>';
      else {
        const ul = el('ul','shared-list');
        sResp.json.forEach(s => {
          const li = el('li','shared-item', `${s.id} — Problem ${s.problem_id} — ${s.result}`);
          li.style.cursor = 'pointer';
          li.style.padding = '8px';
          li.style.borderBottom = '1px solid #f1f5f9';
          li.addEventListener('click', async ()=> {
            const got = await fetchJSON(`/api/submissions/source/${s.id}`);
            if (got.ok) {
              openCodeModal(got.json.code, s);
            } else {
              alert(got.json && got.json.message ? got.json.message : 'ไม่สามารถเปิดโค้ดได้');
            }
          });
          ul.appendChild(li);
        });
        sharedList.appendChild(ul);
      }
    } else {
      sharedList.innerHTML = '<p>ไม่สามารถโหลดรายการได้</p>';
    }

    // Right column initial content
    rightCol.appendChild(el('div','right-placeholder','<h3>เลือกโจทย์จากซ้ายเพื่อดูรายละเอียด</h3>'));

    wrapper.appendChild(leftCol);
    wrapper.appendChild(rightCol);

    root.innerHTML = '';
    root.appendChild(wrapper);

    // helpers
    function openCodeModal(code, meta = {}) {
      const modal = el('div','modal');
      Object.assign(modal.style, { position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 9999 });
      const card = el('div','modal-card');
      card.style.background = '#fff';
      card.style.padding = '16px';
      card.style.borderRadius = '10px';
      card.style.width = '90%';
      card.style.maxWidth = '900px';
      card.innerHTML = `<h4>Shared code — ID ${meta.id || ''}</h4>`;
      const pre = el('pre','', '');
      pre.style.maxHeight = '60vh';
      pre.style.overflow = 'auto';
      pre.textContent = code || '';
      card.appendChild(pre);
      const close = el('button','secondary-btn','ปิด');
      close.addEventListener('click', ()=> document.body.removeChild(modal));
      card.appendChild(close);
      modal.appendChild(card);
      document.body.appendChild(modal);
    }

    async function openProblem(problemId) {
      // fetch problem detail
      const r = await fetchJSON(`/api/problems/${problemId}`);
      if (!r.ok) {
        rightCol.innerHTML = '<p>ไม่พบโจทย์</p>';
        return;
      }
      const p = r.json;
      rightCol.innerHTML = '';
      const title = el('h3','', p.title || 'Untitled');
      rightCol.appendChild(title);
      const desc = el('p','', p.description || '');
      rightCol.appendChild(desc);
      if (p.pdf_file) {
        const a = el('a','', 'ดาวน์โหลด PDF');
        a.href = p.pdf_file;
        a.target = '_blank';
        a.className = 'secondary-btn';
        rightCol.appendChild(a);
      }

      // guide button
      const guideBtn = el('button','secondary-btn','วิธีทำ (Guide)');
      guideBtn.style.marginLeft = '8px';
      guideBtn.addEventListener('click', ()=> {
        const modal = el('div','modal-guide');
        Object.assign(modal.style, { position:'fixed', left:0, top:0, right:0, bottom:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999 });
        const card = el('div','', '');
        card.style.background = '#fff';
        card.style.padding = '18px';
        card.style.borderRadius = '10px';
        card.style.width = '92%';
        card.style.maxWidth = '800px';
        card.innerHTML = `<h4>Guide: ${p.title || ''}</h4><div style="max-height:60vh;overflow:auto;">${p.guide || '<p>ยังไม่มีคำแนะนำ</p>'}</div>`;
        const close = el('button','secondary-btn','ปิด');
        close.style.marginTop = '12px';
        close.addEventListener('click', ()=> document.body.removeChild(modal));
        card.appendChild(close);
        modal.appendChild(card);
        document.body.appendChild(modal);
      });
      rightCol.appendChild(guideBtn);

      rightCol.appendChild(el('hr',''));

      // show testcases summary
      const tcWrap = el('div','tc-wrap');
      tcWrap.appendChild(el('h4','', 'Testcases'));
      const tcs = p.testCases || [];
      if (!tcs.length) tcWrap.appendChild(el('p','', 'ไม่มี testcases ถูกตั้งค่า'));
      else {
        tcs.forEach((t,i) => {
          const row = el('div','', `#${i+1}: input preview, time ${t.timeLimit || '1s'}, mem ${t.memoryLimit || '64MB'}`);
          row.style.padding = '6px 0';
          tcWrap.appendChild(row);
        });
      }
      rightCol.appendChild(tcWrap);

      // grader: file input or textarea
      const graderBox = el('div','grader-box');
      graderBox.style.marginTop = '12px';
      graderBox.innerHTML = `
        <h4>ส่งโค้ดเพื่อตรวจ</h4>
        <div style="margin-bottom:8px;">
          <label style="font-weight:600">อัพโหลดไฟล์ .cpp</label><br/>
          <input type="file" id="upload-file" accept=".cpp" />
        </div>
        <div style="margin-bottom:8px;">
          <label style="font-weight:600">หรือ วางโค้ดที่นี่</label><br/>
          <textarea id="paste-code" rows="12" style="width:100%;font-family:monospace;"></textarea>
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
          <label><input type="checkbox" id="share-code" /> แชร์โค้ดให้ผู้อื่นดู</label>
          <button id="submit-code" class="primary-btn">ส่งตรวจ</button>
        </div>
        <div id="submission-result-area"></div>
      `;
      rightCol.appendChild(graderBox);

      // handle file -> textarea
      const uploadFile = graderBox.querySelector('#upload-file');
      const pasteCode = graderBox.querySelector('#paste-code');
      uploadFile.addEventListener('change', (e)=>{
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => pasteCode.value = reader.result;
        reader.readAsText(f);
      });

      // submit
      const submitBtn = graderBox.querySelector('#submit-code');
      submitBtn.addEventListener('click', async () => {
        const code = pasteCode.value.trim();
        if (!code) {
          alert('กรุณาใส่โค้ดก่อนส่ง');
          return;
        }
        submitBtn.disabled = true;
        const isShared = graderBox.querySelector('#share-code').checked;
        const token = localStorage.getItem('authToken');
        const resp = await fetch('/api/submissions/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
          body: JSON.stringify({ problemId: p.id, code, isShared })
        }).catch(()=>null);
        submitBtn.disabled = false;
        const display = graderBox.querySelector('#submission-result-area');
        if (!resp) {
          display.innerHTML = '<p class="error">Network error</p>';
          return;
        }
        const data = await resp.json().catch(()=>null);
        if (!resp.ok) {
          display.innerHTML = `<p class="error">${(data && data.message) ? data.message : 'Submission failed'}</p>`;
          return;
        }
        // show per-testcase badges
        const details = data.detail || [];
        const out = el('div','');
        out.appendChild(el('h5','',`ผลการตรวจ: ${data.result || ''}`));
        details.forEach(d => {
          const row = el('div','', '');
          row.style.display = 'flex';
          row.style.alignItems = 'center';
          row.style.gap = '8px';
          const badge = statusBadge(d.result);
          const label = el('div','', `Test #${d.case || '?'} — ${d.message || ''}`);
          row.appendChild(badge);
          row.appendChild(label);
          out.appendChild(row);
        });
        display.innerHTML = '';
        display.appendChild(out);

        // refresh shared list if user shared
        if (isShared) {
          const s = await fetchJSON('/api/submissions/shared');
          if (s.ok && Array.isArray(s.json)) {
            sharedList.innerHTML = '';
            const ul = el('ul','shared-list');
            s.json.forEach(ss => {
              const li = el('li','shared-item', `${ss.id} — Problem ${ss.problem_id} — ${ss.result}`);
              li.style.padding = '8px';
              li.style.borderBottom = '1px solid #f1f5f9';
              li.addEventListener('click', async ()=> {
                const got = await fetchJSON(`/api/submissions/source/${ss.id}`);
                if (got.ok) openCodeModal(got.json.code, ss);
                else alert(got.json && got.json.message ? got.json.message : 'ไม่สามารถเปิดโค้ดได้');
              });
              ul.appendChild(li);
            });
            sharedList.appendChild(ul);
          }
        }
      });
    }
  };

  // Export small helper to open dashboard from other scripts
  if (typeof window !== 'undefined') window.renderDashboard = window.renderDashboard;
})();