const $ = (s) => document.querySelector(s);

// Device ID
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

const moods = [
    { max: 0,   cls: 'mood-happy',   text: 'hungry?' },
    { max: 3,   cls: 'mood-happy',   text: 'good start!' },
    { max: 8,   cls: 'mood-neutral', text: 'nice pace' },
    { max: 15,  cls: 'mood-worried', text: 'maybe slow down...' },
    { max: 25,  cls: 'mood-sad',     text: 'my brother in christ' },
    { max: 40,  cls: 'mood-crying',  text: 'I have a family' },
    { max: Infinity, cls: 'mood-dead', text: 'you monster' },
];

function updateMood() {
    const face = $('#face');
    const mood = moods.find(m => todayCount <= m.max);

    moods.forEach(m => face.classList.remove(m.cls));
    face.classList.add(mood.cls);
    $('#moodText').textContent = mood.text;

    if (todayCount > 0) {
        $('#tapHint').style.display = 'none';
    }
}

function spawnParticles() {
    const container = $('#particles');
    for (let i = 0; i < 5; i++) {
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

    // Update UI instantly
    $('#todayCount').textContent = todayCount;
    updateMood();

    // Animations
    const khinkali = $('#khinkali');
    khinkali.classList.remove('wobble');
    void khinkali.offsetWidth; // force reflow
    khinkali.classList.add('wobble');

    spawnParticles();

    // +1 near tap position
    const rect = $('#khinkaliZone').getBoundingClientRect();
    const px = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left;
    const py = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top;
    spawnPlusOne(px - 15, py - 30);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(30);

    // Debounced sync — batch taps together
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
        // Offline — keep counting locally
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
        $('#globalCount').textContent = data.total.toLocaleString();
        $('#globalPeople').textContent = data.people.toLocaleString();
    } catch { /* offline */ }
}

// Share card generation
function generateShareCard() {
    const canvas = $('#shareCanvas');
    const ctx = canvas.getContext('2d');
    const w = 1080, h = 1920;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a2e');
    grad.addColorStop(0.5, '#16213e');
    grad.addColorStop(1, '#0f3460');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative circles
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#e94560';
    ctx.beginPath(); ctx.arc(900, 300, 300, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#f5c518';
    ctx.beginPath(); ctx.arc(180, 1500, 250, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // Big khinkali emoji
    ctx.font = '280px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥟', w/2, 580);

    // Mood emoji
    const mood = moods.find(m => todayCount <= m.max);
    const moodEmojis = {
        'mood-happy': '😊',
        'mood-neutral': '😐',
        'mood-worried': '😟',
        'mood-sad': '😢',
        'mood-crying': '😭',
        'mood-dead': '💀',
    };
    ctx.font = '120px serif';
    ctx.fillText(moodEmojis[mood.cls] || '🥟', w/2, 740);

    // "I ATE" text
    ctx.fillStyle = '#888';
    ctx.font = '600 48px -apple-system, sans-serif';
    ctx.fillText("TODAY I ATE", w/2, 880);

    // Count
    ctx.font = '800 200px -apple-system, sans-serif';
    const countGrad = ctx.createLinearGradient(w/2 - 200, 900, w/2 + 200, 1100);
    countGrad.addColorStop(0, '#f5c518');
    countGrad.addColorStop(1, '#e94560');
    ctx.fillStyle = countGrad;
    ctx.fillText(todayCount.toString(), w/2, 1100);

    // "KHINKALI" text
    ctx.fillStyle = '#eee';
    ctx.font = '700 64px -apple-system, sans-serif';
    ctx.fillText('KHINKALI', w/2, 1200);

    // Mood text
    ctx.fillStyle = '#888';
    ctx.font = 'italic 40px -apple-system, sans-serif';
    ctx.fillText(`"${mood.text}"`, w/2, 1300);

    // Stats row
    const stats = [
        { label: 'THIS WEEK', value: $('#weekCount').textContent },
        { label: 'THIS MONTH', value: $('#monthCount').textContent },
        { label: 'ALL TIME', value: $('#allTimeCount').textContent },
    ];

    const cardY = 1420;
    const cardW = 280;
    const cardH = 160;
    const gap = 30;
    const startX = (w - (cardW * 3 + gap * 2)) / 2;

    stats.forEach((s, i) => {
        const x = startX + i * (cardW + gap);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        roundRect(ctx, x, cardY, cardW, cardH, 20);
        ctx.fill();

        ctx.fillStyle = '#eee';
        ctx.font = '800 52px -apple-system, sans-serif';
        ctx.fillText(s.value, x + cardW/2, cardY + 70);

        ctx.fillStyle = '#666';
        ctx.font = '600 22px -apple-system, sans-serif';
        ctx.fillText(s.label, x + cardW/2, cardY + 110);
    });

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText('vchame.ge', w/2, 1760);

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText('count your khinkali', w/2, 1810);

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

        // Try native share first (mobile)
        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({ files: [file], title: 'My Khinkali Stats' });
                return;
            } catch { /* user cancelled or failed */ }
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vchame-stats.png';
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

// Event listeners
$('#khinkaliZone').addEventListener('click', eat);
$('#khinkaliZone').addEventListener('touchstart', (e) => {
    e.preventDefault();
    eat(e);
}, { passive: false });

$('#shareBtn').addEventListener('click', shareCard);

// Init
loadStats();
loadGlobal();
