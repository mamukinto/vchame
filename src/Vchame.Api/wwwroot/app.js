// ── Cached DOM refs (zero querySelector in hot path) ──
const dom = {};
document.querySelectorAll('[id]').forEach(el => dom[el.id] = el);
const i18nEls = document.querySelectorAll('[data-i18n]');

// ── Dish config ──
const dishes = [
    {
        key: 'khinkali',
        ka: { name: 'ხინკალი', unit: 'ცალი' },
        en: { name: 'Khinkali', unit: 'pcs' },
        moods: {
            ka: [
                { max: 0, text: 'მშიერი ხარ?' },
                { max: 3, text: 'კარგი დასაწყისი!' },
                { max: 8, text: 'ნორმალური ტემპი' },
                { max: 15, text: 'შენელდი ცოტა...' },
                { max: 25, text: 'ძმაო...' },
                { max: 40, text: 'ოჯახი მყავს!' },
                { max: Infinity, text: 'მონსტრი ხარ' },
            ],
            en: [
                { max: 0, text: 'hungry?' },
                { max: 3, text: 'good start!' },
                { max: 8, text: 'nice pace' },
                { max: 15, text: 'maybe slow down...' },
                { max: 25, text: 'my brother in christ' },
                { max: 40, text: 'I have a family' },
                { max: Infinity, text: 'you monster' },
            ],
        },
    },
    {
        key: 'khachapuri',
        ka: { name: 'ხაჭაპური', unit: 'ცალი' },
        en: { name: 'Khachapuri', unit: 'pcs' },
        moods: {
            ka: [
                { max: 0, text: 'ყველი დაგავიწყდა?' },
                { max: 2, text: 'კარგი დასაწყისი!' },
                { max: 4, text: 'ნორმალური' },
                { max: 7, text: 'მეტი ყველი?' },
                { max: 12, text: 'დაიწვი...' },
                { max: 20, text: 'კარდიოლოგთან!' },
                { max: Infinity, text: 'საშიშია' },
            ],
            en: [
                { max: 0, text: 'forgot cheese?' },
                { max: 2, text: 'good start!' },
                { max: 4, text: 'normal pace' },
                { max: 7, text: 'more cheese?' },
                { max: 12, text: 'slow down...' },
                { max: 20, text: 'see a cardiologist!' },
                { max: Infinity, text: 'dangerous' },
            ],
        },
    },
    {
        key: 'qababi',
        ka: { name: 'ქაბაბი', unit: 'ცალი' },
        en: { name: 'Qababi', unit: 'pcs' },
        moods: {
            ka: [
                { max: 0, text: 'ჯერ არ დაგეწყო?' },
                { max: 2, text: 'სათავი აიღე!' },
                { max: 5, text: 'კარგად მიდის' },
                { max: 9, text: 'რამდენს იკეთებ?' },
                { max: 15, text: 'შეჩერდი...' },
                { max: 25, text: 'გადაჭარბება არის' },
                { max: Infinity, text: 'ზღვარი გადალახე' },
            ],
            en: [
                { max: 0, text: 'not started yet?' },
                { max: 2, text: 'get going!' },
                { max: 5, text: 'doing good' },
                { max: 9, text: 'how many are you making?' },
                { max: 15, text: 'stop...' },
                { max: 25, text: 'this is excessive' },
                { max: Infinity, text: 'you crossed the line' },
            ],
        },
    },
    {
        key: 'lobiani',
        ka: { name: 'ლობიანი', unit: 'ცალი' },
        en: { name: 'Lobiani', unit: 'pcs' },
        moods: {
            ka: [
                { max: 0, text: 'ლობიოს არ გჭირდება?' },
                { max: 2, text: 'კარგი დასაწყისი!' },
                { max: 4, text: 'ლობიოს სეზონია' },
                { max: 7, text: 'მეტი ლობიო!' },
                { max: 12, text: 'ნელა, ნელა...' },
                { max: 20, text: 'შეჩერდი!' },
                { max: Infinity, text: 'ლობიოს ტრაგედია' },
            ],
            en: [
                { max: 0, text: 'no beans needed?' },
                { max: 2, text: 'good start!' },
                { max: 4, text: 'bean season' },
                { max: 7, text: 'more beans!' },
                { max: 12, text: 'slow, slow...' },
                { max: 20, text: 'stop!' },
                { max: Infinity, text: 'bean tragedy' },
            ],
        },
    },
];

// ── i18n ──
const i18n = {
    ka: {
        tapHint: 'შემეხე!', today: 'დღეს', thisWeek: 'ამ კვირას',
        thisMonth: 'ამ თვეში', allTime: 'სულ', share: 'გაზიარება',
        install: 'დააინსტალირე', bannerCounted: 'საჭმელი დათვლილია',
        bannerBy: 'ადამიანის მიერ', shareToday: 'დღეს ვჭამე',
        shareWeek: 'ამ კვირას', shareMonth: 'ამ თვეში', shareAll: 'სულ',
        shareWatermark: 'დათვალე შენი საჭმელი',
        undo: 'წაშალე ბოლო',
        shareTitle: 'დღევანდელი ზიანი',
    },
    en: {
        tapHint: 'tap me!', today: 'today', thisWeek: 'this week',
        thisMonth: 'this month', allTime: 'all time', share: 'Share to Stories',
        install: 'Install App', bannerCounted: 'food counted by',
        bannerBy: 'people', shareToday: 'TODAY I ATE',
        shareWeek: 'THIS WEEK', shareMonth: 'THIS MONTH', shareAll: 'ALL TIME',
        shareWatermark: 'count your food',
        undo: 'undo last',
        shareTitle: 'TODAY\'S DAMAGE',
    },
};

let lang = localStorage.getItem('vchame_lang') || 'ka';
function t(key) { return i18n[lang][key]; }

function applyLang() {
    localStorage.setItem('vchame_lang', lang);
    document.documentElement.lang = lang;
    i18nEls.forEach(el => el.textContent = t(el.dataset.i18n));
    dom.langBtn.textContent = lang === 'ka' ? 'EN' : 'ქარ';
    updateMood();
    updateBanner();
}

// ── State ──
const deviceId = localStorage.getItem('vchame_device_id') || (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('vchame_device_id', id);
    return id;
})();

let currentDish = 'khinkali';
let dishCounts = {
    khinkali: { today: 0, week: 0, month: 0, allTime: 0 },
    khachapuri: { today: 0, week: 0, month: 0, allTime: 0 },
    qababi: { today: 0, week: 0, month: 0, allTime: 0 },
    lobiani: { today: 0, week: 0, month: 0, allTime: 0 },
};
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
    dom.dishZone.appendChild(po);
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

function getMoodIdx(count) {
    if (count <= 0) return 0;
    for (let i = 0; i < MOOD_THRESHOLDS.length; i++) {
        if (count <= MOOD_THRESHOLDS[i]) return i + 1;
    }
    return MOOD_CLASSES.length - 1;
}

function getMoodCls(count) { return MOOD_CLASSES[getMoodIdx(count)]; }

function updateMood() {
    const count = dishCounts[currentDish].today;
    const cls = getMoodCls(count);
    if (cls !== currentMoodCls) {
        if (currentMoodCls) dom.face.classList.remove(currentMoodCls);
        dom.face.classList.add(cls);
        currentMoodCls = cls;
    }
    const dishConfig = dishes.find(d => d.key === currentDish);
    const moods = dishConfig.moods[lang];
    const mood = moods.find(m => count <= m.max);
    dom.moodText.textContent = mood?.text || '';
    if (count > 0) dom.tapHint.style.display = 'none';
    else dom.tapHint.style.display = '';
}

function updateAllCounters() {
    const stats = dishCounts[currentDish];
    dom.todayCount.textContent = stats.today;
    dom.weekCount.textContent = stats.week;
    dom.monthCount.textContent = stats.month;
    dom.allTimeCount.textContent = stats.allTime.toLocaleString();
    // Show/hide undo button
    dom.undoBtn.style.display = stats.today > 0 ? 'flex' : 'none';
}

function updateBanner() {
    dom.globalBanner.innerHTML =
        `<span>🇬🇪</span> <span class="gold">${globalTotal.toLocaleString()}</span> ${t('bannerCounted')} <span class="gold">${globalPeople.toLocaleString()}</span> ${t('bannerBy')}`;
}

// ── Dish switching ──
function switchDish(dishKey) {
    if (dishKey === currentDish) return;
    currentDish = dishKey;

    // Update tab active state
    document.querySelectorAll('.dish-tab').forEach(tab => {
        if (tab.dataset.dish === dishKey) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    // Update dish image
    dom.dishImage.src = `/images/${dishKey}.png`;

    // Update counters and mood
    updateAllCounters();
    updateMood();
}

// ── Core tap handler (HOT PATH — zero reflow) ──
function eat(e) {
    const stats = dishCounts[currentDish];
    stats.today++;
    stats.week++;
    stats.month++;
    stats.allTime++;
    pendingCount++;

    updateAllCounters();
    updateMood();

    // Wobble — Web Animations API, no reflow
    dom.dishImage.animate(wobbleKeyframes, wobbleOpts);

    // Particles + +1 — Web Animations API, no reflow
    fireParticles();
    const rect = dom.dishZone.getBoundingClientRect();
    const px = (e.clientX || rect.left + rect.width / 2) - rect.left;
    const py = (e.clientY || rect.top + rect.height / 2) - rect.top;
    firePlusOne(px - 15, py - 30);

    if (navigator.vibrate) navigator.vibrate(15);

    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncToServer, 800);
}

// ── Undo (minus 1) ──
function undoEat() {
    const stats = dishCounts[currentDish];
    if (stats.today <= 0) return;
    stats.today--;
    stats.week--;
    stats.month--;
    stats.allTime--;
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
                body: JSON.stringify({
                    deviceId,
                    count,
                    dishType: currentDish,
                    localDate: localDate()
                }),
            });
        } else {
            // Negative = undo, send absolute value with undo flag
            await fetch('/api/undo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deviceId,
                    count: Math.abs(count),
                    dishType: currentDish,
                    localDate: localDate()
                }),
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
        // Populate all dish counts from data.dishes
        if (data.dishes) {
            Object.keys(dishCounts).forEach(dish => {
                if (data.dishes[dish]) {
                    dishCounts[dish] = data.dishes[dish];
                }
            });
        }
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

// ── Draw dish with mood face on canvas ──
async function drawDishWithMood(ctx, dishKey, count, x, y, width, height) {
    // Load and draw dish image
    const img = new Image();
    img.src = `/images/${dishKey}.png`;
    await img.decode();
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, x - dw / 2, y - dh / 2, dw, dh);

    // Draw mood face overlay (CSS face adapted to canvas)
    const moodIdx = getMoodIdx(count);
    const s = 1; // scale factor
    const fy = y; // face y position (centered on dish image)
    const eyeGap = 24 * s;
    const eyeR = 10 * s;
    const eyeColor = '#4a3728';

    ctx.save();
    ctx.translate(x, fy);

    // mood: 0=happy(hungry), 1=happy, 2=happy, 3=neutral, 4=worried, 5=sad, 6=crying, 7=dead
    if (moodIdx <= 2) {
        // Happy — squinted eyes (arcs)
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 3 * s;
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(-eyeGap / 2, -4 * s, 6 * s, Math.PI, 0); ctx.stroke();
        ctx.beginPath(); ctx.arc(eyeGap / 2, -4 * s, 6 * s, Math.PI, 0); ctx.stroke();
        // Smile
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(0, 14 * s, 10 * s, 0, Math.PI); ctx.fill();
    } else if (moodIdx === 3) {
        // Neutral — normal eyes, flat mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(-eyeGap / 2, 0, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, 0, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        // Eye shine
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-eyeGap / 2 + 2 * s, -2 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2 + 2 * s, -2 * s, 2 * s, 0, Math.PI * 2); ctx.fill();
        // Flat mouth
        ctx.fillStyle = eyeColor;
        ctx.fillRect(-8 * s, 14 * s, 16 * s, 3 * s);
    } else if (moodIdx === 4) {
        // Worried — big eyes, O mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(-eyeGap / 2, 0, eyeR * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, 0, eyeR * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-eyeGap / 2 + 2 * s, -2 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2 + 2 * s, -2 * s, 2.5 * s, 0, Math.PI * 2); ctx.fill();
        // O mouth
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 2.5 * s;
        ctx.beginPath(); ctx.arc(0, 16 * s, 6 * s, 0, Math.PI * 2); ctx.stroke();
    } else if (moodIdx === 5) {
        // Sad — eyes with tears, frown
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.arc(-eyeGap / 2, 0, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, 0, eyeR / 2, 0, Math.PI * 2); ctx.fill();
        // Tears
        ctx.fillStyle = 'rgba(100,150,255,0.5)';
        ctx.beginPath(); ctx.arc(-eyeGap / 2, 10 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(eyeGap / 2, 10 * s, 3 * s, 0, Math.PI * 2); ctx.fill();
        // Frown
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, 24 * s, 10 * s, Math.PI, 0); ctx.stroke();
    } else if (moodIdx === 6) {
        // Crying — closed eyes, tears, open mouth
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(-eyeGap / 2, 2 * s, 6 * s, 0, Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(eyeGap / 2, 2 * s, 6 * s, 0, Math.PI); ctx.stroke();
        // Tears streaming
        ctx.fillStyle = 'rgba(100,150,255,0.6)';
        ctx.fillRect(-eyeGap / 2 - 2 * s, 6 * s, 4 * s, 14 * s);
        ctx.fillRect(eyeGap / 2 - 2 * s, 6 * s, 4 * s, 14 * s);
        // Open mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath(); ctx.ellipse(0, 22 * s, 10 * s, 7 * s, 0, 0, Math.PI * 2); ctx.fill();
    } else {
        // Dead — X eyes, flat mouth
        ctx.strokeStyle = eyeColor; ctx.lineWidth = 3 * s; ctx.lineCap = 'round';
        [-1, 1].forEach(side => {
            const ex = side * eyeGap / 2;
            ctx.beginPath(); ctx.moveTo(ex - 5 * s, -5 * s); ctx.lineTo(ex + 5 * s, 5 * s); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ex + 5 * s, -5 * s); ctx.lineTo(ex - 5 * s, 5 * s); ctx.stroke();
        });
        // Flat tilted mouth
        ctx.fillStyle = eyeColor;
        ctx.save(); ctx.translate(0, 16 * s); ctx.rotate(-0.08);
        ctx.fillRect(-15 * s, 0, 30 * s, 4 * s);
        ctx.restore();
    }

    ctx.restore();
}

// ── Share card (multi-dish) ──
async function generateShareCard() {
    const canvas = dom.shareCanvas;
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
    ctx.beginPath(); ctx.arc(900, 300, 300, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#f5c518';
    ctx.beginPath(); ctx.arc(180, 1500, 250, 0, 6.28); ctx.fill();
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';

    // Title
    ctx.fillStyle = '#888'; ctx.font = '600 48px -apple-system, sans-serif';
    ctx.fillText(t('shareTitle').toUpperCase(), w / 2, 200);

    // Draw all dishes that have today count > 0
    const activeDishes = dishes.filter(d => dishCounts[d.key].today > 0);

    if (activeDishes.length === 0) {
        // No dishes eaten today — show message
        ctx.fillStyle = '#666'; ctx.font = 'italic 40px -apple-system, sans-serif';
        ctx.fillText('...', w / 2, h / 2);
        return canvas;
    }

    // Layout dishes in grid (2 columns max)
    const dishSize = 200;
    const dishGap = 80;
    const cols = activeDishes.length === 1 ? 1 : 2;
    const rows = Math.ceil(activeDishes.length / cols);
    const gridWidth = cols * dishSize + (cols - 1) * dishGap;
    const gridHeight = rows * dishSize + (rows - 1) * dishGap;
    const startX = w / 2 - gridWidth / 2 + dishSize / 2;
    const startY = 300;

    // Draw each dish image + mood + count
    for (let i = 0; i < activeDishes.length; i++) {
        const dish = activeDishes[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (dishSize + dishGap);
        const y = startY + row * (dishSize + dishGap);

        // Draw dish with mood face
        await drawDishWithMood(ctx, dish.key, dishCounts[dish.key].today, x, y, dishSize, dishSize);

        // Dish name below
        ctx.fillStyle = '#eee'; ctx.font = '600 28px -apple-system, sans-serif';
        const dishName = dish[lang].name;
        ctx.fillText(dishName, x, y + dishSize / 2 + 40);

        // Today's count
        const cg = ctx.createLinearGradient(x - 50, y + dishSize / 2 + 50, x + 50, y + dishSize / 2 + 120);
        cg.addColorStop(0, '#f5c518'); cg.addColorStop(1, '#e94560');
        ctx.fillStyle = cg; ctx.font = '800 80px -apple-system, sans-serif';
        ctx.fillText(dishCounts[dish.key].today.toString(), x, y + dishSize / 2 + 120);
    }

    // Stats section (combined totals)
    const totalToday = Object.values(dishCounts).reduce((sum, d) => sum + d.today, 0);
    const totalWeek = Object.values(dishCounts).reduce((sum, d) => sum + d.week, 0);
    const totalMonth = Object.values(dishCounts).reduce((sum, d) => sum + d.month, 0);
    const totalAll = Object.values(dishCounts).reduce((sum, d) => sum + d.allTime, 0);

    const statsY = startY + gridHeight + 200;
    ctx.fillStyle = '#888'; ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText(t('shareToday').toUpperCase(), w / 2, statsY);

    const cg = ctx.createLinearGradient(w / 2 - 150, statsY + 20, w / 2 + 150, statsY + 140);
    cg.addColorStop(0, '#f5c518'); cg.addColorStop(1, '#e94560');
    ctx.fillStyle = cg; ctx.font = '800 140px -apple-system, sans-serif';
    ctx.fillText(totalToday.toString(), w / 2, statsY + 130);

    // Small stats cards
    const stats = [
        { label: t('shareWeek').toUpperCase(), value: totalWeek },
        { label: t('shareMonth').toUpperCase(), value: totalMonth },
        { label: t('shareAll').toUpperCase(), value: totalAll },
    ];
    const cardY = statsY + 200, cardW = 280, cardH = 160, gap = 30;
    const sx = (w - (cardW * 3 + gap * 2)) / 2;
    stats.forEach((s, i) => {
        const x = sx + i * (cardW + gap);
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath();
        ctx.roundRect(x, cardY, cardW, cardH, 20); ctx.fill();
        ctx.fillStyle = '#eee'; ctx.font = '800 52px -apple-system, sans-serif';
        ctx.fillText(s.value.toString(), x + cardW / 2, cardY + 70);
        ctx.fillStyle = '#666'; ctx.font = '600 22px -apple-system, sans-serif';
        ctx.fillText(s.label, x + cardW / 2, cardY + 110);
    });

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText('vchame.ge', w / 2, h - 160);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(t('shareWatermark'), w / 2, h - 110);

    return canvas;
}

async function shareCard() {
    const canvas = await generateShareCard();
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
dom.dishZone.addEventListener('pointerdown', (e) => { e.preventDefault(); eat(e); });
dom.shareBtn.addEventListener('click', shareCard);
dom.undoBtn.addEventListener('click', undoEat);
dom.langBtn.addEventListener('click', () => { lang = lang === 'ka' ? 'en' : 'ka'; applyLang(); });

// Tab switching
document.querySelectorAll('.dish-tab').forEach(tab => {
    tab.addEventListener('click', () => switchDish(tab.dataset.dish));
});

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
