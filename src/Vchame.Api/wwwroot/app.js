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
        undo: 'წაშალე ბოლო',
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
        undo: 'undo last',
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
    dom.undoBtn.lastChild.textContent = ' ' + t('undo');
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
let weekCount = 0;
let monthCount = 0;
let allTimeCount = 0;
let pendingCount = 0;
let syncTimer = 0;
let globalTotal = 0;
let globalPeople = 0;
let currentMoodCls = '';

// ── Animations via Web Animations API (zero reflow) ──
const wobbleKeyframes = [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(-8deg)', offset: 0.25 },
    { transform: 'rotate(8deg)', offset: 0.5 },
    { transform: 'rotate(-4deg)', offset: 0.75 },
    { transform: 'rotate(0deg)' },
];
const wobbleOpts = { duration: 300, easing: 'ease-in-out' };

const flyKeyframes = (tx, ty) => [
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${tx}px,${ty}px) scale(0)`, opacity: 0 },
];
const flyOpts = { duration: 400, fill: 'forwards' };

const floatKeyframes = [
    { transform: 'translateY(0) scale(1)', opacity: 1 },
    { transform: 'translateY(-50px) scale(0.5)', opacity: 0 },
];
const floatOpts = { duration: 500, fill: 'forwards' };

// ── Pre-built pools ──
const POOL_SIZE = 6;
const particlePool = [];
const plusOnePool = [];

for (let i = 0; i < POOL_SIZE; i++) {
    const p = document.createElement('div');
    p.style.cssText = 'position:absolute;width:6px;height:6px;background:#f5e6d3;border-radius:50%;opacity:0;will-change:transform,opacity';
    dom.particles.appendChild(p);
    particlePool.push(p);

    const po = document.createElement('div');
    po.textContent = '+1';
    po.style.cssText = 'position:absolute;font-size:24px;font-weight:800;color:#f5c518;pointer-events:none;opacity:0;will-change:transform,opacity';
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
        p.animate(flyKeyframes(Math.cos(angle) * dist, Math.sin(angle) * dist), flyOpts);
    }
}

function firePlusOne(x, y) {
    const el = plusOnePool[plusOneIdx++ % POOL_SIZE];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.animate(floatKeyframes, floatOpts);
}

// ── Mood ──
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
    else dom.tapHint.style.display = '';
}

function updateAllCounters() {
    dom.todayCount.textContent = todayCount;
    dom.weekCount.textContent = weekCount;
    dom.monthCount.textContent = monthCount;
    dom.allTimeCount.textContent = allTimeCount.toLocaleString();
    // Show/hide undo button
    dom.undoBtn.style.display = todayCount > 0 ? 'flex' : 'none';
}

function updateBanner() {
    dom.globalBanner.innerHTML =
        `<span>🇬🇪</span> <span class="gold">${globalTotal.toLocaleString()}</span> ${t('bannerCounted')} <span class="gold">${globalPeople.toLocaleString()}</span> ${t('bannerBy')}`;
}

// ── Core tap handler (HOT PATH — zero reflow) ──
function eat(e) {
    todayCount++;
    weekCount++;
    monthCount++;
    allTimeCount++;
    pendingCount++;

    updateAllCounters();
    updateMood();

    // Wobble — Web Animations API, no reflow
    dom.khinkali.animate(wobbleKeyframes, wobbleOpts);

    // Particles + +1 — Web Animations API, no reflow
    fireParticles();
    const rect = dom.khinkaliZone.getBoundingClientRect();
    const px = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const py = (e.clientY || rect.top + rect.height / 2) - rect.top;
    firePlusOne(px - 15, py - 30);

    if (navigator.vibrate) navigator.vibrate(15);

    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncToServer, 800);
}

// ── Undo (minus 1) ──
function undoEat() {
    if (todayCount <= 0) return;
    todayCount--;
    weekCount--;
    monthCount--;
    allTimeCount--;
    pendingCount--;

    updateAllCounters();
    updateMood();

    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncToServer, 800);
}

// ── Network ──
function localDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function syncToServer() {
    if (pendingCount === 0) return;
    const count = pendingCount;
    pendingCount = 0;
    try {
        if (count > 0) {
            await fetch('/api/eat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId, count, localDate: localDate() }),
            });
        } else {
            // Negative = undo, send absolute value with undo flag
            await fetch('/api/undo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId, count: Math.abs(count), localDate: localDate() }),
            });
        }
        loadStats();
        loadGlobal();
    } catch {
        pendingCount += count;
    }
}

async function loadStats() {
    try {
        const data = await (await fetch(`/api/stats/${deviceId}?localDate=${localDate()}`)).json();
        todayCount = data.today;
        weekCount = data.week;
        monthCount = data.month;
        allTimeCount = data.allTime;
        updateAllCounters();
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

// ── Draw khinkali on canvas ──
function drawKhinkali(ctx, cx, cy, moodIdx) {
    const s = 2; // scale factor for share card

    // Body
    ctx.save();
    ctx.translate(cx, cy);
    const bw = 140 * s, bh = 120 * s;
    const bodyGrad = ctx.createLinearGradient(-bw/2, -bh/2, bw/2, bh/2);
    bodyGrad.addColorStop(0, '#f5e6d3');
    bodyGrad.addColorStop(1, '#e8d5b8');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, bw / 2, bh / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shadow on body
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(0, bh * 0.15, bw / 2, bh / 4, 0, 0, Math.PI);
    ctx.fill();

    // Top knob
    const kw = 30 * s, kh = 24 * s;
    const topGrad = ctx.createLinearGradient(-kw/2, -bh/2 - kh, kw/2, -bh/2);
    topGrad.addColorStop(0, '#e8d5b8');
    topGrad.addColorStop(1, '#d4c4a8');
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.ellipse(0, -bh / 2 - kh * 0.3, kw / 2, kh / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fold lines on knob
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.lineWidth = 2 * s;
    ctx.beginPath();
    ctx.ellipse(-6 * s, -bh / 2 - kh * 0.2, 4 * s, 10 * s, -0.25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(6 * s, -bh / 2 - kh * 0.2, 4 * s, 10 * s, 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Face — offset upward from center
    const fy = -10 * s;
    const eyeGap = 24 * s;
    const eyeR = 10 * s;
    const eyeColor = '#4a3728';

    // mood: 0=happy(hungry), 1=happy, 2=happy, 3=neutral, 4=worried, 5=sad, 6=crying, 7=dead
    if (moodIdx <= 2) {
        // Happy — squinted eyes (arcs)
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 3 * s;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(-eyeGap / 2, fy - 4 * s, 6 * s, Math.PI, 0); ctx.stroke();
        ctx.beginPath(); ctx.arc(eyeGap / 2, fy - 4 * s, 6 * s, Math.PI, 0); ctx.stroke();
        // Smile
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(0, fy + 14 * s, 10 * s, 0, Math.PI); ctx.fill();
    } else if (moodIdx === 3) {
        // Neutral — normal eyes, flat mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(-eyeGap / 2, fy, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, fy, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-eyeGap / 2 + 2 * s, fy - 2 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2 + 2 * s, fy - 2 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
        // Flat mouth
        ctx.fillStyle = eyeColor;
        ctx.fillRect(-8 * s, fy + 14 * s, 16 * s, 3 * s);
    } else if (moodIdx === 4) {
        // Worried — big eyes, O mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(-eyeGap / 2, fy, eyeR * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, fy, eyeR * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-eyeGap / 2 + 2 * s, fy - 2 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2 + 2 * s, fy - 2 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        // O mouth
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 2.5 * s;
        ctx.beginPath(); ctx.arc(0, fy + 16 * s, 6 * s, 0, Math.PI * 2); ctx.stroke();
    } else if (moodIdx === 5) {
        // Sad — eyes with tears, frown
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(-eyeGap / 2, fy, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, fy, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        // Tears
        ctx.fillStyle = 'rgba(100,150,255,0.5)';
        ctx.beginPath(); ctx.arc(-eyeGap / 2, fy + 10 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, fy + 10 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
        // Frown
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, fy + 24 * s, 10 * s, Math.PI, 0); ctx.stroke();
    } else if (moodIdx === 6) {
        // Crying — closed eyes, tears, open mouth
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(-eyeGap / 2, fy + 2 * s, 6 * s, 0, Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(eyeGap / 2, fy + 2 * s, 6 * s, 0, Math.PI); ctx.stroke();
        // Tears streaming
        ctx.fillStyle = 'rgba(100,150,255,0.6)';
        ctx.fillRect(-eyeGap / 2 - 2 * s, fy + 6 * s, 4 * s, 14 * s);
        ctx.fillRect(eyeGap / 2 - 2 * s, fy + 6 * s, 4 * s, 14 * s);
        // Open mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.ellipse(0, fy + 22 * s, 10 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
    } else {
        // Dead — X eyes, flat mouth
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
        [-1, 1].forEach(side => {
            const ex = side * eyeGap / 2;
            ctx.beginPath(); ctx.moveTo(ex - 5 * s, fy - 5 * s); ctx.lineTo(ex + 5 * s, fy + 5 * s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ex + 5 * s, fy - 5 * s); ctx.lineTo(ex - 5 * s, fy + 5 * s); ctx.stroke();
        });
        // Flat tilted mouth
        ctx.fillStyle = eyeColor;
        ctx.save(); ctx.translate(0, fy + 16 * s); ctx.rotate(-0.08);
        ctx.fillRect(-15 * s, 0, 30 * s, 4 * s);
        ctx.restore();
    }

    ctx.restore();
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

    ctx.textAlign = 'center';
    drawKhinkali(ctx, w / 2, 480, getMoodIdx());

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
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// Hide install button if already installed as PWA
if (isStandalone) dom.installBtn.style.display = 'none';

function getInstallHint() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    if (isIOS || isSafari) {
        return lang === 'ka'
            ? 'დააჭირე ⎙ (Share) → "Add to Home Screen"'
            : 'Tap ⎙ (Share) → "Add to Home Screen"';
    }
    return lang === 'ka'
        ? 'ბრაუზერის მენიუ → "Install App" ან "Add to Home Screen"'
        : 'Browser menu → "Install App" or "Add to Home Screen"';
}

// ── Event listeners ──
dom.khinkaliZone.addEventListener('pointerdown', (e) => { e.preventDefault(); eat(e); });
dom.shareBtn.addEventListener('click', shareCard);
dom.undoBtn.addEventListener('click', undoEat);
dom.langBtn.addEventListener('click', () => { lang = lang === 'ka' ? 'en' : 'ka'; applyLang(); });

dom.installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; dom.installBtn.style.display = 'none'; });
    } else {
        dom.installHintText.textContent = getInstallHint();
        dom.installHint.style.display = 'flex';
    }
});
dom.installHintClose.addEventListener('click', () => { dom.installHint.style.display = 'none'; });

// ── Init ──
applyLang();
loadStats();
loadGlobal();
