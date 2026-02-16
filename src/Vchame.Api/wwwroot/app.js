const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ── i18n ──
const i18n = {
    ka: {
        title: 'ვჭამე',
        tapHint: 'შემეხე!',
        today: 'დღეს',
        thisWeek: 'ამ კვირას',
        thisMonth: 'ამ თვეში',
        allTime: 'სულ',
        share: 'გაზიარება',
        install: 'დააინსტალირე',
        installHint: 'დაამატე მთავარ ეკრანზე',
        bannerCounted: 'ხინკალი დათვლილია',
        bannerBy: 'ადამიანის მიერ',
        shareToday: 'დღეს ვჭამე',
        shareKhinkali: 'ხინკალი',
        shareWeek: 'ამ კვირას',
        shareMonth: 'ამ თვეში',
        shareAll: 'სულ',
        shareWatermark: 'დათვალე შენი ხინკალი',
        moods: [
            { max: 0, text: 'მშიერი ხარ?' },
            { max: 3, text: 'კარგი დასაწყისი!' },
            { max: 8, text: 'ნორმალური ტემპი' },
            { max: 15, text: 'შენელდი ცოტა...' },
            { max: 25, text: 'ძმაო...' },
            { max: 40, text: 'ოჯახი მყავს!' },
            { max: Infinity, text: 'მონსტრი ხარ' },
        ],
    },
    en: {
        title: 'vchame',
        tapHint: 'tap me!',
        today: 'today',
        thisWeek: 'this week',
        thisMonth: 'this month',
        allTime: 'all time',
        share: 'Share to Stories',
        install: 'Install App',
        installHint: 'Add to Home Screen',
        bannerCounted: 'khinkali counted by',
        bannerBy: 'people',
        shareToday: 'TODAY I ATE',
        shareKhinkali: 'KHINKALI',
        shareWeek: 'THIS WEEK',
        shareMonth: 'THIS MONTH',
        shareAll: 'ALL TIME',
        shareWatermark: 'count your khinkali',
        moods: [
            { max: 0, text: 'hungry?' },
            { max: 3, text: 'good start!' },
            { max: 8, text: 'nice pace' },
            { max: 15, text: 'maybe slow down...' },
            { max: 25, text: 'my brother in christ' },
            { max: 40, text: 'I have a family' },
            { max: Infinity, text: 'you monster' },
        ],
    },
};

let lang = localStorage.getItem('vchame_lang') || 'ka';

function t(key) { return i18n[lang][key]; }

function applyLang() {
    localStorage.setItem('vchame_lang', lang);
    document.documentElement.lang = lang;

    // Update all [data-i18n] elements
    $$('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    // Lang switcher button shows the OTHER language
    $('#langBtn').textContent = lang === 'ka' ? 'EN' : 'ქარ';

    // Share button
    $('#shareBtn').innerHTML = `<span>📸</span> ${t('share')}`;

    // Install button
    if ($('#installBtn')) {
        $('#installBtn').innerHTML = `<span>📲</span> ${t('install')}`;
    }

    updateMood();
    updateBanner();
}

function toggleLang() {
    lang = lang === 'ka' ? 'en' : 'ka';
    applyLang();
}

// ── Device ID ──
function getDeviceId() {
    let id = localStorage.getItem('vchame_device_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('vchame_device_id', id);
    }
    return id;
}

const deviceId = getDeviceId();
let todayCount = 0;
let pendingCount = 0;
let syncTimer = null;

const moodClasses = ['mood-happy', 'mood-neutral', 'mood-worried', 'mood-sad', 'mood-crying', 'mood-dead'];

function getMood() {
    const moods = t('moods');
    return moods.find(m => todayCount <= m.max);
}

function getMoodCls() {
    if (todayCount <= 3) return 'mood-happy';
    if (todayCount <= 8) return 'mood-neutral';
    if (todayCount <= 15) return 'mood-worried';
    if (todayCount <= 25) return 'mood-sad';
    if (todayCount <= 40) return 'mood-crying';
    return 'mood-dead';
}

function updateMood() {
    const face = $('#face');
    const cls = getMoodCls();
    const mood = getMood();

    moodClasses.forEach(c => face.classList.remove(c));
    face.classList.add(cls);
    $('#moodText').textContent = mood?.text || '';

    if (todayCount > 0) {
        $('#tapHint').style.display = 'none';
    }
}

let globalTotal = 0;
let globalPeople = 0;

function updateBanner() {
    $('#globalBanner').innerHTML =
        `<span>🇬🇪</span> <span class="gold">${globalTotal.toLocaleString()}</span> ${t('bannerCounted')} <span class="gold">${globalPeople.toLocaleString()}</span> ${t('bannerBy')}`;
}

function spawnParticles() {
    const container = $('#particles');
    for (let i = 0; i < 3; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 40;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        container.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function spawnPlusOne(x, y) {
    const el = document.createElement('div');
    el.className = 'plus-one';
    el.textContent = '+1';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    $('#khinkaliZone').appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function eat(e) {
    todayCount++;
    pendingCount++;

    $('#todayCount').textContent = todayCount;
    updateMood();

    const khinkali = $('#khinkali');
    khinkali.classList.remove('wobble');
    requestAnimationFrame(() => khinkali.classList.add('wobble'));

    spawnParticles();

    const rect = $('#khinkaliZone').getBoundingClientRect();
    const px = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left;
    const py = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top;
    spawnPlusOne(px - 15, py - 30);

    if (navigator.vibrate) navigator.vibrate(30);

    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncToServer, 500);
}

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
        const res = await fetch(`/api/stats/${deviceId}`);
        const data = await res.json();
        todayCount = data.today;
        $('#todayCount').textContent = data.today;
        $('#weekCount').textContent = data.week;
        $('#monthCount').textContent = data.month;
        $('#allTimeCount').textContent = data.allTime.toLocaleString();
        updateMood();
    } catch { /* offline */ }
}

async function loadGlobal() {
    try {
        const res = await fetch('/api/global');
        const data = await res.json();
        globalTotal = data.total;
        globalPeople = data.people;
        updateBanner();
    } catch { /* offline */ }
}

// ── Share card ──
function generateShareCard() {
    const canvas = $('#shareCanvas');
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
    ctx.beginPath(); ctx.arc(900, 300, 300, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f5c518';
    ctx.beginPath(); ctx.arc(180, 1500, 250, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.font = '280px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥟', w / 2, 580);

    const moodEmojis = {
        'mood-happy': '😊', 'mood-neutral': '😐', 'mood-worried': '😟',
        'mood-sad': '😢', 'mood-crying': '😭', 'mood-dead': '💀',
    };
    ctx.font = '120px serif';
    ctx.fillText(moodEmojis[getMoodCls()] || '🥟', w / 2, 740);

    ctx.fillStyle = '#888';
    ctx.font = '600 48px -apple-system, sans-serif';
    ctx.fillText(t('shareToday').toUpperCase(), w / 2, 880);

    ctx.font = '800 200px -apple-system, sans-serif';
    const countGrad = ctx.createLinearGradient(w / 2 - 200, 900, w / 2 + 200, 1100);
    countGrad.addColorStop(0, '#f5c518');
    countGrad.addColorStop(1, '#e94560');
    ctx.fillStyle = countGrad;
    ctx.fillText(todayCount.toString(), w / 2, 1100);

    ctx.fillStyle = '#eee';
    ctx.font = '700 64px -apple-system, sans-serif';
    ctx.fillText(t('shareKhinkali').toUpperCase(), w / 2, 1200);

    ctx.fillStyle = '#888';
    ctx.font = 'italic 40px -apple-system, sans-serif';
    const mood = getMood();
    ctx.fillText(`"${mood?.text || ''}"`, w / 2, 1300);

    const stats = [
        { label: t('shareWeek').toUpperCase(), value: $('#weekCount').textContent },
        { label: t('shareMonth').toUpperCase(), value: $('#monthCount').textContent },
        { label: t('shareAll').toUpperCase(), value: $('#allTimeCount').textContent },
    ];

    const cardY = 1420, cardW = 280, cardH = 160, gap = 30;
    const startX = (w - (cardW * 3 + gap * 2)) / 2;

    stats.forEach((s, i) => {
        const x = startX + i * (cardW + gap);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        roundRect(ctx, x, cardY, cardW, cardH, 20);
        ctx.fill();

        ctx.fillStyle = '#eee';
        ctx.font = '800 52px -apple-system, sans-serif';
        ctx.fillText(s.value, x + cardW / 2, cardY + 70);

        ctx.fillStyle = '#666';
        ctx.font = '600 22px -apple-system, sans-serif';
        ctx.fillText(s.label, x + cardW / 2, cardY + 110);
    });

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText('vchame.ge', w / 2, 1760);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(t('shareWatermark'), w / 2, 1810);

    return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

async function shareCard() {
    const canvas = generateShareCard();
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'vchame-stats.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: 'My Khinkali Stats' });
                return;
            } catch { /* cancelled */ }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vchame-stats.png';
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// ── PWA Install ──
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    $('#installBtn').style.display = 'flex';
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            $('#installBtn').style.display = 'none';
        });
    }
}

// ── Event listeners ──
// Use pointer events — single handler for touch + mouse, no double-firing
$('#khinkaliZone').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    eat(e);
});

$('#shareBtn').addEventListener('click', shareCard);
$('#langBtn').addEventListener('click', toggleLang);
$('#installBtn')?.addEventListener('click', installApp);

// ── Init ──
applyLang();
loadStats();
loadGlobal();
