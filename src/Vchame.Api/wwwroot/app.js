// ── Cached DOM refs (zero querySelector in hot path) ──
const dom = {};
document.querySelectorAll('[id]').forEach(el => dom[el.id] = el);
const i18nEls = document.querySelectorAll('[data-i18n]');

// ── i18n ──
const i18n = {
    ka: {
        tapHint: 'შემეხე!', today: 'დღეს', thisWeek: 'ამ კვირას',
        thisMonth: 'ამ თვეში', allTime: 'სულ', share: 'გაზიარება',
        install: 'დააინსტალირე', bannerCounted: 'ხინკალი დათვლილია',
        bannerBy: 'ადამიანის მიერ', shareToday: 'დღეს ვჭამე',
        shareKhinkali: 'ხინკალი', shareWeek: 'ამ კვირას',
        shareMonth: 'ამ თვეში', shareAll: 'სულ',
        shareWatermark: 'დათვალე შენი ხინკალი',
        moods: [
            { max: 0, text: 'მშიერი ხარ?' }, { max: 3, text: 'კარგი დასაწყისი!' },
            { max: 8, text: 'ნორმალური ტემპი' }, { max: 15, text: 'შენელდი ცოტა...' },
            { max: 25, text: 'ძმაო...' }, { max: 40, text: 'ოჯახი მყავს!' },
            { max: Infinity, text: 'მონსტრი ხარ' },
        ],
    },
    en: {
        tapHint: 'tap me!', today: 'today', thisWeek: 'this week',
        thisMonth: 'this month', allTime: 'all time', share: 'Share to Stories',
        install: 'Install App', bannerCounted: 'khinkali counted by',
        bannerBy: 'people', shareToday: 'TODAY I ATE',
        shareKhinkali: 'KHINKALI', shareWeek: 'THIS WEEK',
        shareMonth: 'THIS MONTH', shareAll: 'ALL TIME',
        shareWatermark: 'count your khinkali',
        moods: [
            { max: 0, text: 'hungry?' }, { max: 3, text: 'good start!' },
            { max: 8, text: 'nice pace' }, { max: 15, text: 'maybe slow down...' },
            { max: 25, text: 'my brother in christ' }, { max: 40, text: 'I have a family' },
            { max: Infinity, text: 'you monster' },
        ],
    },
};

let lang = localStorage.getItem('vchame_lang') || 'ka';
function t(key) { return i18n[lang][key]; }

function applyLang() {
    localStorage.setItem('vchame_lang', lang);
    document.documentElement.lang = lang;
    i18nEls.forEach(el => el.textContent = t(el.dataset.i18n));
    dom.langBtn.textContent = lang === 'ka' ? 'EN' : 'ქარ';
    dom.shareBtn.lastChild.textContent = ' ' + t('share');
    if (dom.installBtn) dom.installBtn.lastChild.textContent = ' ' + t('install');
    updateMood();
    updateBanner();
}

// ── State ──
const deviceId = localStorage.getItem('vchame_device_id') || (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('vchame_device_id', id);
    return id;
})();

let todayCount = 0;
let pendingCount = 0;
let syncTimer = 0;
let globalTotal = 0;
let globalPeople = 0;
let currentMoodCls = '';

// ── Pre-built object pools (zero DOM alloc per tap) ──
const POOL_SIZE = 8;
const particlePool = [];
const plusOnePool = [];

for (let i = 0; i < POOL_SIZE; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.display = 'none';
    dom.particles.appendChild(p);
    particlePool.push(p);

    const po = document.createElement('div');
    po.className = 'plus-one';
    po.textContent = '+1';
    po.style.display = 'none';
    dom.khinkaliZone.appendChild(po);
    plusOnePool.push(po);
}

let particleIdx = 0;
let plusOneIdx = 0;

function fireParticles() {
    for (let i = 0; i < 3; i++) {
        const p = particlePool[particleIdx++ % POOL_SIZE];
        const angle = Math.random() * 6.28;
        const dist = 30 + Math.random() * 40;
        p.style.cssText = `display:block;--tx:${Math.cos(angle) * dist}px;--ty:${Math.sin(angle) * dist}px`;
        // Restart animation by re-adding class
        p.classList.remove('particle');
        p.offsetWidth; // minimal reflow — single element only
        p.classList.add('particle');
    }
}

function firePlusOne(x, y) {
    const el = plusOnePool[plusOneIdx++ % POOL_SIZE];
    el.style.cssText = `display:block;left:${x}px;top:${y}px`;
    el.classList.remove('plus-one');
    el.offsetWidth;
    el.classList.add('plus-one');
}

// ── Mood (only update DOM when mood actually changes) ──
const MOOD_THRESHOLDS = [3, 8, 15, 25, 40, Infinity];
const MOOD_CLASSES = ['mood-happy', 'mood-happy', 'mood-neutral', 'mood-worried', 'mood-sad', 'mood-crying', 'mood-dead'];

function getMoodIdx() {
    if (todayCount <= 0) return 0;
    for (let i = 0; i < MOOD_THRESHOLDS.length; i++) {
        if (todayCount <= MOOD_THRESHOLDS[i]) return i + 1;
    }
    return MOOD_CLASSES.length - 1;
}

function getMoodCls() { return MOOD_CLASSES[getMoodIdx()]; }

function updateMood() {
    const cls = getMoodCls();
    if (cls !== currentMoodCls) {
        if (currentMoodCls) dom.face.classList.remove(currentMoodCls);
        dom.face.classList.add(cls);
        currentMoodCls = cls;
    }
    const mood = t('moods').find(m => todayCount <= m.max);
    dom.moodText.textContent = mood?.text || '';
    if (todayCount > 0) dom.tapHint.style.display = 'none';
}

function updateBanner() {
    dom.globalBanner.innerHTML =
        `<span>🇬🇪</span> <span class="gold">${globalTotal.toLocaleString()}</span> ${t('bannerCounted')} <span class="gold">${globalPeople.toLocaleString()}</span> ${t('bannerBy')}`;
}

// ── Core tap handler (HOT PATH — must be <1ms) ──
function eat(e) {
    todayCount++;
    pendingCount++;

    // 1. Update counter text (single DOM write)
    dom.todayCount.textContent = todayCount;

    // 2. Update mood (conditional DOM write)
    updateMood();

    // 3. Wobble animation via class toggle
    dom.khinkali.style.animation = 'none';
    dom.khinkali.offsetHeight; // single element reflow
    dom.khinkali.style.animation = 'wobble 0.35s ease-in-out';

    // 4. Particles from pool (no DOM create)
    fireParticles();

    // 5. +1 from pool (no DOM create)
    const rect = dom.khinkaliZone.getBoundingClientRect();
    const px = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const py = (e.clientY || rect.top + rect.height / 2) - rect.top;
    firePlusOne(px - 15, py - 30);

    // 6. Haptic
    if (navigator.vibrate) navigator.vibrate(15);

    // 7. Debounced network sync (never blocks UI)
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncToServer, 800);
}

// ── Network (all async, never blocks tap) ──
async function syncToServer() {
    if (pendingCount <= 0) return;
    const count = pendingCount;
    pendingCount = 0;
    try {
        await fetch('/api/eat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, count }),
        });
        loadStats();
        loadGlobal();
    } catch {
        pendingCount += count;
    }
}

async function loadStats() {
    try {
        const data = await (await fetch(`/api/stats/${deviceId}`)).json();
        todayCount = data.today;
        dom.todayCount.textContent = data.today;
        dom.weekCount.textContent = data.week;
        dom.monthCount.textContent = data.month;
        dom.allTimeCount.textContent = data.allTime.toLocaleString();
        updateMood();
    } catch {}
}

async function loadGlobal() {
    try {
        const data = await (await fetch('/api/global')).json();
        globalTotal = data.total;
        globalPeople = data.people;
        updateBanner();
    } catch {}
}

// ── Share card ──
function generateShareCard() {
    const canvas = dom.shareCanvas;
    const ctx = canvas.getContext('2d');
    const w = 1080, h = 1920;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(0.5, '#16213e');
    grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#e94560';
    ctx.beginPath(); ctx.arc(900, 300, 300, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#f5c518';
    ctx.beginPath(); ctx.arc(180, 1500, 250, 0, 6.28); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = '280px serif'; ctx.textAlign = 'center';
    ctx.fillText('🥟', w / 2, 580);

    const moodEmojis = { 'mood-happy': '😊', 'mood-neutral': '😐', 'mood-worried': '😟', 'mood-sad': '😢', 'mood-crying': '😭', 'mood-dead': '💀' };
    ctx.font = '120px serif';
    ctx.fillText(moodEmojis[getMoodCls()] || '🥟', w / 2, 740);

    ctx.fillStyle = '#888'; ctx.font = '600 48px -apple-system, sans-serif';
    ctx.fillText(t('shareToday').toUpperCase(), w / 2, 880);

    const cg = ctx.createLinearGradient(w / 2 - 200, 900, w / 2 + 200, 1100);
    cg.addColorStop(0, '#f5c518'); cg.addColorStop(1, '#e94560');
    ctx.fillStyle = cg; ctx.font = '800 200px -apple-system, sans-serif';
    ctx.fillText(todayCount.toString(), w / 2, 1100);

    ctx.fillStyle = '#eee'; ctx.font = '700 64px -apple-system, sans-serif';
    ctx.fillText(t('shareKhinkali').toUpperCase(), w / 2, 1200);

    ctx.fillStyle = '#888'; ctx.font = 'italic 40px -apple-system, sans-serif';
    const mood = t('moods').find(m => todayCount <= m.max);
    ctx.fillText(`"${mood?.text || ''}"`, w / 2, 1300);

    const stats = [
        { label: t('shareWeek').toUpperCase(), value: dom.weekCount.textContent },
        { label: t('shareMonth').toUpperCase(), value: dom.monthCount.textContent },
        { label: t('shareAll').toUpperCase(), value: dom.allTimeCount.textContent },
    ];
    const cardY = 1420, cardW = 280, cardH = 160, gap = 30;
    const sx = (w - (cardW * 3 + gap * 2)) / 2;
    stats.forEach((s, i) => {
        const x = sx + i * (cardW + gap);
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath();
        ctx.roundRect(x, cardY, cardW, cardH, 20); ctx.fill();
        ctx.fillStyle = '#eee'; ctx.font = '800 52px -apple-system, sans-serif';
        ctx.fillText(s.value, x + cardW / 2, cardY + 70);
        ctx.fillStyle = '#666'; ctx.font = '600 22px -apple-system, sans-serif';
        ctx.fillText(s.label, x + cardW / 2, cardY + 110);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText('vchame.ge', w / 2, 1760);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(t('shareWatermark'), w / 2, 1810);

    return canvas;
}

async function shareCard() {
    const canvas = generateShareCard();
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'vchame-stats.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
            try { await navigator.share({ files: [file] }); return; } catch {}
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'vchame-stats.png'; a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// ── PWA Install ──
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    dom.installBtn.style.display = 'flex';
});

// ── Event listeners ──
dom.khinkaliZone.addEventListener('pointerdown', (e) => { e.preventDefault(); eat(e); });
dom.shareBtn.addEventListener('click', shareCard);
dom.langBtn.addEventListener('click', () => { lang = lang === 'ka' ? 'en' : 'ka'; applyLang(); });
dom.installBtn?.addEventListener('click', () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; dom.installBtn.style.display = 'none'; });
});

// ── Init ──
applyLang();
loadStats();
loadGlobal();
