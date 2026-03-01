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
                { max: 0, text: 'გშია?' },
                { max: 3, text: 'კარგი დასაწყისი!' },
                { max: 8, text: 'კარგი ტემპია' },
                { max: 15, text: 'ცოტა შეანელე...' },
                { max: 25, text: 'ძმაო...' },
                { max: 40, text: 'ოჯახი მყავს!' },
                { max: Infinity, text: 'მხეცი ხარ' },
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
        ka: { name: 'ხაჭაპური', unit: 'ნაჭერი' },
        en: { name: 'Khachapuri', unit: 'slices' },
        moods: {
            ka: [
                { max: 0, text: 'ყველი დაგავიწყდა?' },
                { max: 2, text: 'კარგი დასაწყისი!' },
                { max: 4, text: 'ნორმალური ტემპია' },
                { max: 7, text: 'კიდევ გინდა?' },
                { max: 12, text: 'დატორმუზე...' },
                { max: 20, text: 'პირდაპირ კარდიოლოგთან!' },
                { max: Infinity, text: 'უკვე საშიშია' },
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
                { max: 0, text: 'ჯერ არ დაგიწყია?' },
                { max: 2, text: 'მიდი, დაიწყე!' },
                { max: 5, text: 'კარგად მიდიხარ' },
                { max: 9, text: 'კიდევ შეგიძლია?' },
                { max: 15, text: 'გაჩერდი...' },
                { max: 25, text: 'უკვე ზედმეტია' },
                { max: Infinity, text: 'საზღვრებს გასცდი' },
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
        ka: { name: 'ლობიანი', unit: 'ნაჭერი' },
        en: { name: 'Lobiani', unit: 'slices' },
        moods: {
            ka: [
                { max: 0, text: 'ლობიო არ გინდა?' },
                { max: 2, text: 'კარგი დასაწყისი!' },
                { max: 4, text: 'ლობიოს სეზონია' },
                { max: 7, text: 'მეტი ლობიო!' },
                { max: 12, text: 'ნელ-ნელა...' },
                { max: 20, text: 'გაჩერდი!' },
                { max: Infinity, text: 'ლობიოს ოვერდოზი' },
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
        shareWatermark: 'აჩვენე შენი ძალა',
        undo: 'წაშალე ბოლო', clear: 'გასუფთავება',
        shareTitle: 'დღევანდელი გამარჯვება',
        statsBtn: 'სტატ.',
        // stats panel
        statsBack: 'უკან', statsTitle: 'სტატისტიკა',
        statsPersonal: 'შენი სტატისტიკა', statsGlobal: 'გლობალური სტატისტიკა',
        statsTotalFood: 'სულ საჭმელი', statsPeople: 'ადამიანი',
        statsNone: 'ჯერ არაფერი',
    // Friends
    statsFriends: 'მეგობრები', friendsYourCode: 'შენი კოდი', friendsCopy: 'კოპირება',
    friendsNicknamePlaceholder: 'შენი სახელი...', friendsSave: 'შენახვა',
    friendsCodePlaceholder: 'კოდი...', friendsAdd: '+ დამატება',
    friendsNone: 'ჯერ მეგობარი არ გყავს', friendsHint: 'გაუზიარე კოდი მეგობრებს!',
    friendsToday: 'დღეს', friendsWeek: 'კვირა',
    fpBack: 'უკან', fpAllTime: 'სულ', fpByDish: 'დეტალები',
    fpVsYou: 'შენთან შედარება', fpDayStreak: 'დღის სერია',

        // share modal
        smTitle: '📸 გაზიარება',
        smLocationLabel: '📍 მდებარეობა',
        smLocationPlaceholder: 'რესტორანი, ქალაქი...',
        smPhotoLabel: '🖼 ფოტო (სურვილისამებრ)',
        shareAddPhoto: '+ ფოტოს დამატება', sharePhotoRemove: '✕ წაშლა',
        shareGenerate: '📸 გენერირება',
        scTitle: 'აირჩიე სტილი',
        scShare: 'გაზიარება',
    },
    en: {
        tapHint: 'tap me!', today: 'today', thisWeek: 'this week',
        thisMonth: 'this month', allTime: 'all time', share: 'Share to Stories',
        install: 'Install App', bannerCounted: 'food counted by',
        bannerBy: 'people', shareToday: 'TODAY I ATE',
        shareWeek: 'THIS WEEK', shareMonth: 'THIS MONTH', shareAll: 'ALL TIME',
        shareWatermark: 'show your power',
        undo: 'undo last', clear: 'clear all',
        shareTitle: 'TODAY\'S VICTORY',
        statsBtn: 'Stats',
        // stats panel
        statsBack: 'Back', statsTitle: 'Stats',
        statsPersonal: 'Your Stats', statsGlobal: 'Global Stats',
        statsTotalFood: 'total eaten', statsPeople: 'people',
        statsNone: 'nothing yet',
        fpBack: 'Back', fpAllTime: 'All time', fpByDish: 'By dish',
        fpVsYou: 'vs You', fpDayStreak: 'day streak',
        // share modal
        smTitle: '📸 Share',
        smLocationLabel: '📍 Location',
        smLocationPlaceholder: 'Restaurant, city...',
        smPhotoLabel: '🖼 Photo (optional)',
        shareAddPhoto: '+ Add photo', sharePhotoRemove: '✕ Remove',
        shareGenerate: '📸 Generate card',
        scTitle: 'Pick a style',
        scShare: 'Share',
    },
};

let lang = localStorage.getItem('vchame_lang') || 'ka';
function t(key) { return i18n[lang][key]; }

function applyLang() {
    localStorage.setItem('vchame_lang', lang);
    document.documentElement.lang = lang;
    i18nEls.forEach(el => el.textContent = t(el.dataset.i18n));
    dom.langBtn.textContent = lang === 'ka' ? 'EN' : 'ქარ';
    dom.statsPanelLangBtn.textContent = lang === 'ka' ? 'EN' : 'ქარ';
    dom.statsPanelBackLabel.textContent = t('statsBack');
    dom.statsPanelTitle.textContent = t('statsTitle');
    dom.spPersonalTitle.textContent = t('statsPersonal');
    dom.spGlobalTitle.textContent = t('statsGlobal');
    dom.spGlobalTotalLabel.textContent = t('statsTotalFood');
    dom.spGlobalPeopleLabel.textContent = t('statsPeople');
    dom.smTitle.textContent = t('smTitle');
    dom.smLocationLabel.textContent = t('smLocationLabel');
    dom.smPhotoLabel.textContent = t('smPhotoLabel');
    dom.shareLocation.placeholder = t('smLocationPlaceholder');
    dom.scTitle.textContent = t('scTitle');
    dom.scShareLabel.textContent = t('scShare');
    updateMood();
    updateDishHint();
    updateBanner();
    if (dom.statsPanel.classList.contains('open')) renderStatsPanel();
    if (dom.friendProfilePanel.classList.contains('open') && openProfileFriendIdx >= 0) {
        dom.friendProfileBody.innerHTML = buildFriendProfileHTML(friendsList[openProfileFriendIdx]);
        dom.friendProfileBackLabel.textContent = t('fpBack');
    }
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
let globalByDish = [];
let currentMoodCls = '';
let currentStreak = 0;
let leaderboardData = [];
let activeStatsTab = 'personal';
let currentLbPeriod = 'alltime';
let myFriendCode = '';
let myNickname = '';
let friendsList = [];
let openProfileFriendIdx = -1;

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

// ── Roast Toasts ──
const ROAST_THRESHOLDS = [5, 10, 15, 20, 30];
const ROASTS = {
    khinkali: {
        5:  { ka: 'შენ ხარ გმირი! 💪', en: 'you\'re a hero! 💪' },
        10: { ka: 'ლეგენდარული! 👑', en: 'legendary! 👑' },
        15: { ka: 'შენ ხარ ხინკლის მეფე! 🥟', en: 'you\'re the khinkali king! 🥟' },
        20: { ka: 'საქართველოს სიამაყე! 🇬🇪', en: 'pride of Georgia! 🇬🇪' },
        30: { ka: 'შენ ღმერთი ხარ! 🔱', en: 'you are a GOD! 🔱' },
    },
    khachapuri: {
        5:  { ka: 'ძლიერი დასაწყისი! 🧀', en: 'strong start! 🧀' },
        10: { ka: 'ყველის ლეგენდა! 👑', en: 'cheese legend! 👑' },
        15: { ka: 'შენ ხარ ბოსი! 💪', en: 'you\'re the boss! 💪' },
        20: { ka: 'კარდიოლოგი შენით ამაყობს! 😎', en: 'your cardiologist is proud! 😎' },
        30: { ka: 'ხაჭაპურის ღმერთი! 🔱', en: 'khachapuri god! 🔱' },
    },
    qababi: {
        5:  { ka: 'კარგი გახურება! 🔥', en: 'nice warmup! 🔥' },
        10: { ka: 'მაყლის ოსტატი! 🥩', en: 'grill master! 🥩' },
        15: { ka: 'შენ ხარ ჩემპიონი! 🏆', en: 'you\'re a champion! 🏆' },
        20: { ka: 'ქაბაბის მეფე! 👑', en: 'qababi king! 👑' },
        30: { ka: 'შენ ღმერთი ხარ! 🔱', en: 'you are a GOD! 🔱' },
    },
    lobiani: {
        5:  { ka: 'ლობიო ბედნიერია! 🫘', en: 'the beans are pleased! 🫘' },
        10: { ka: 'ლობიომ აგირჩია! 🏷', en: 'the bean chose you! 🏷' },
        15: { ka: 'ლობიოს გმირი! 💪', en: 'bean hero! 💪' },
        20: { ka: 'ლობიოს ეროვნული გმირი! 🎖', en: 'national bean hero! 🎖' },
        30: { ka: 'ლობიოს ღმერთი! 🔱', en: 'bean god! 🔱' },
    },
};

function showRoast(dish, count) {
    const threshold = ROAST_THRESHOLDS.find(t => count === t);
    if (!threshold) return;
    const roast = ROASTS[dish]?.[threshold];
    if (!roast) return;
    let toast = dom.roastToast;
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'roastToast';
        toast.className = 'roast-toast';
        document.body.appendChild(toast);
        dom.roastToast = toast;
    }
    toast.textContent = roast[lang];
    toast.classList.add('roast-toast-show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('roast-toast-show'), 4000);
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
    // Show/hide undo row
    dom.undoRow.style.display = stats.today > 0 ? 'flex' : 'none';
}

function updateBanner() {
    dom.globalBanner.innerHTML =
        `<span>🇬🇪</span> <span class="gold">${globalTotal.toLocaleString()}</span> ${t('bannerCounted')} <span class="gold">${globalPeople.toLocaleString()}</span> ${t('bannerBy')}`;
}

// ── Dish hint ──
function updateDishHint() {
    const dish = dishes.find(d => d.key === currentDish);
    dom.dishHint.textContent = `${dish[lang].name} · ${dish[lang].unit}`;
}

// ── Streak display ──
function updateStreakDisplay() {
    if (currentStreak >= 2) {
        dom.streakBadge.textContent = `🔥 ${currentStreak}`;
        dom.streakBadge.style.display = '';
    } else {
        dom.streakBadge.style.display = 'none';
    }
}

// ── Food personality badge ──
function getPersonalityBadge() {
    const totalAllTime = Object.values(dishCounts).reduce((s, d) => s + d.allTime, 0);
    if (totalAllTime === 0) return { ka: '🍽 დამწყები', en: '🍽 Rookie' };
    const max = Math.max(...Object.values(dishCounts).map(d => d.allTime));
    const dominant = dishes.find(d => dishCounts[d.key].allTime === max);
    const pct = max / totalAllTime;
    if (pct <= 0.4 && Object.values(dishCounts).filter(d => d.allTime > 0).length >= 3) {
        return { ka: '🇬🇪 ნამდვილი ქართველი', en: '🇬🇪 True Georgian' };
    }
    const badges = {
        khinkali:  { ka: '🥟 ხინკლის მამა', en: '🥟 Khinkali Lord' },
        khachapuri: { ka: '🧀 ყველის ბოსი', en: '🧀 Cheese Brain' },
        qababi:    { ka: '🔥 მაყლის ოსტატი', en: '🔥 Grill Master' },
        lobiani:   { ka: '🫘 ლობიანის ფანატიკოსი', en: '🫘 Bean Lover' },
    };
    return badges[dominant?.key] || { ka: '🍽 დამწყები', en: '🍽 Rookie' };
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

    // Update counters, mood and hint
    updateAllCounters();
    updateMood();
    updateDishHint();
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
    showRoast(currentDish, dishCounts[currentDish].today);

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

// ── Clear today's count for current dish ──
function clearDish() {
    const stats = dishCounts[currentDish];
    if (stats.today <= 0) return;
    const count = stats.today;
    stats.week -= count;
    stats.month -= count;
    stats.allTime -= count;
    stats.today = 0;
    pendingCount = 0;
    clearTimeout(syncTimer);
    updateAllCounters();
    updateMood();
    fetch('/api/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, dishType: currentDish, count: 0, localDate: localDate() }),
    }).catch(() => {});
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
        loadGlobal();
    } catch {
        pendingCount += count;
    }
}

async function loadStats() {
    try {
        const data = await (await fetch(`/api/stats/${deviceId}?localDate=${localDate()}`)).json();
        if (data.dishes) {
            Object.keys(dishCounts).forEach(dish => {
                if (data.dishes[dish]) dishCounts[dish] = data.dishes[dish];
            });
        }
        localStorage.setItem('vchame_counts_cache', JSON.stringify(dishCounts));
        updateAllCounters();
        updateMood();
        currentStreak = data.streak || 0;
        updateStreakDisplay();
    } catch {}
}

async function loadGlobal() {
    try {
        const data = await (await fetch('/api/global')).json();
        globalTotal = data.total;
        globalPeople = data.people;
        globalByDish = data.byDish || [];
        updateBanner();
    } catch {}
}

async function loadLeaderboard(period) {
    try {
        const data = await (await fetch(`/api/leaderboard?deviceId=${encodeURIComponent(deviceId)}&period=${period}`)).json();
        leaderboardData = data;
        renderLeaderboard();
    } catch {}
}

function renderLeaderboard() {
    if (!leaderboardData.length) {
        dom.spLeaderboardList.innerHTML = `<p class="sp-empty">${t('statsNone')}</p>`;
        return;
    }
    const medals = ['🥇', '🥈', '🥉'];
    dom.spLeaderboardList.innerHTML = leaderboardData.map(row => {
        const rankEl = medals[row.rank - 1] ?? `<span style="font-size:13px;color:var(--text-dim)">${row.rank}</span>`;
        const youTag = row.isMe ? `<span class="sp-you-tag">YOU</span>` : '';
        return `<div class="sp-lb-row ${row.isMe ? 'sp-lb-me' : ''}">
            <div class="sp-lb-rank">${rankEl}</div>
            <div class="sp-lb-count">${row.count.toLocaleString()}</div>
            ${youTag}
        </div>`;
    }).join('');
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

// ── Polaroid frame ──
function drawPolaroid(ctx, img, x, y, w, h, caption) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(-0.02); // subtle tilt
    ctx.translate(-(x + w / 2), -(y + h / 2));

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 24;

    // White frame
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill();
    ctx.shadowColor = 'transparent';

    // Photo inside (cover-fit, clipped)
    const pad = 30, botPad = 100;
    const px = x + pad, py = y + pad, pw = w - pad * 2, ph = h - pad - botPad;
    ctx.save();
    ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip();
    const sx = pw / img.naturalWidth, sy = ph / img.naturalHeight;
    const sc = Math.max(sx, sy);
    const dw = img.naturalWidth * sc, dh = img.naturalHeight * sc;
    ctx.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) / 2, dw, dh);
    ctx.restore();

    // Caption in white area below photo
    if (caption) {
        ctx.fillStyle = '#555';
        ctx.font = '500 28px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        // Truncate if too long
        const maxW = w - pad * 2;
        let txt = '📍 ' + caption;
        while (ctx.measureText(txt).width > maxW && txt.length > 4) {
            txt = txt.slice(0, -4) + '...';
        }
        ctx.fillText(txt, x + w / 2, y + h - 30);
    }

    ctx.restore();
}

// ── Share card templates ──
function getShareOpts(locationText, photoImg) {
    const activeDishes = dishes.filter(d => dishCounts[d.key].today > 0);
    const totalToday = Object.values(dishCounts).reduce((s, d) => s + d.today, 0);
    const totalWeek = Object.values(dishCounts).reduce((s, d) => s + d.week, 0);
    const totalMonth = Object.values(dishCounts).reduce((s, d) => s + d.month, 0);
    const totalAll = Object.values(dishCounts).reduce((s, d) => s + d.allTime, 0);
    const badge = getPersonalityBadge();
    return { locationText, photoImg, activeDishes, totalToday, totalWeek, totalMonth, totalAll, badge };
}

// Shared: draw watermark + badge + streak at bottom of any template
function drawCardFooter(ctx, w, h, opts, textColor = 'rgba(255,255,255,0.3)', accentColor = '#f5c518') {
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor; ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText('vchame.ge', w / 2, h - 160);
    ctx.fillStyle = textColor; ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(t('shareWatermark'), w / 2, h - 110);
    if (currentStreak >= 2) {
        ctx.fillStyle = accentColor; ctx.font = '800 30px -apple-system, sans-serif';
        ctx.fillText(`🔥 Day ${currentStreak}`, w / 2, h - 60);
    }
    if (opts.totalAll > 0) {
        ctx.fillStyle = accentColor; ctx.font = '800 26px -apple-system, sans-serif';
        ctx.fillText(opts.badge[lang], w / 2, h - 30);
    }
}

// ── Template 0: "Clean" — photo-hero, minimal ──
async function generateTemplateClean(ctx, w, h, opts) {
    const hasPhoto = !!opts.photoImg;

    if (hasPhoto) {
        // Full-bleed photo top 60%
        const photoH = h * 0.6;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, w, photoH); ctx.clip();
        const img = opts.photoImg;
        const sx = w / img.naturalWidth, sy = photoH / img.naturalHeight;
        const sc = Math.max(sx, sy);
        const dw = img.naturalWidth * sc, dh = img.naturalHeight * sc;
        ctx.drawImage(img, (w - dw) / 2, (photoH - dh) / 2, dw, dh);
        ctx.restore();

        // Dark gradient overlay at bottom of photo
        const grad = ctx.createLinearGradient(0, photoH * 0.5, 0, photoH);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.7)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, photoH * 0.5, w, photoH * 0.5);

        // Big count over gradient
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff'; ctx.font = '800 180px -apple-system, sans-serif';
        ctx.fillText(opts.totalToday.toString(), w / 2, photoH - 60);

        // Subtitle
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '600 36px -apple-system, sans-serif';
        ctx.fillText(t('shareTitle').toUpperCase(), w / 2, photoH - 20);

        // Bottom section: white/cream bg
        ctx.fillStyle = '#faf8f5';
        ctx.fillRect(0, photoH, w, h - photoH);

        // Dish icons row
        const dishY = photoH + 100;
        const iconSize = 90;
        const gap = 30;
        const totalWidth = opts.activeDishes.length * iconSize + (opts.activeDishes.length - 1) * gap;
        let startX = (w - totalWidth) / 2 + iconSize / 2;
        for (const dish of opts.activeDishes) {
            await drawDishWithMood(ctx, dish.key, dishCounts[dish.key].today, startX, dishY, iconSize, iconSize);
            ctx.fillStyle = '#333'; ctx.font = '800 32px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(dishCounts[dish.key].today.toString(), startX, dishY + iconSize / 2 + 36);
            startX += iconSize + gap;
        }

        // Location
        if (opts.locationText) {
            ctx.fillStyle = '#999'; ctx.font = '500 30px -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📍 ' + opts.locationText, w / 2, dishY + iconSize / 2 + 100);
        }

        drawCardFooter(ctx, w, h, opts, 'rgba(0,0,0,0.2)', '#c9920a');
    } else {
        // No photo: solid cream bg, huge count centered
        ctx.fillStyle = '#faf8f5';
        ctx.fillRect(0, 0, w, h);

        ctx.textAlign = 'center';

        // Title
        ctx.fillStyle = '#bbb'; ctx.font = '600 40px -apple-system, sans-serif';
        ctx.fillText(t('shareTitle').toUpperCase(), w / 2, 300);

        // Huge count
        ctx.fillStyle = '#1a1a2e'; ctx.font = '800 260px -apple-system, sans-serif';
        ctx.fillText(opts.totalToday.toString(), w / 2, 640);

        // Dish icons row below count
        const dishY = 800;
        const iconSize = 120;
        const gap = 40;
        const totalWidth = opts.activeDishes.length * iconSize + (opts.activeDishes.length - 1) * gap;
        let startX = (w - totalWidth) / 2 + iconSize / 2;
        for (const dish of opts.activeDishes) {
            await drawDishWithMood(ctx, dish.key, dishCounts[dish.key].today, startX, dishY, iconSize, iconSize);
            ctx.fillStyle = '#555'; ctx.font = '700 28px -apple-system, sans-serif';
            ctx.fillText(dish[lang].name, startX, dishY + iconSize / 2 + 36);
            ctx.fillStyle = '#1a1a2e'; ctx.font = '800 40px -apple-system, sans-serif';
            ctx.fillText(dishCounts[dish.key].today.toString(), startX, dishY + iconSize / 2 + 76);
            startX += iconSize + gap;
        }

        // Location
        if (opts.locationText) {
            ctx.fillStyle = '#aaa'; ctx.font = '500 30px -apple-system, sans-serif';
            ctx.fillText('📍 ' + opts.locationText, w / 2, h - 260);
        }

        drawCardFooter(ctx, w, h, opts, 'rgba(0,0,0,0.15)', '#c9920a');
    }
}

// ── Template 1: "Neon" — dark bg, glowing accents (current card, improved) ──
async function generateTemplateNeon(ctx, w, h, opts) {
    const hasPhoto = !!opts.photoImg;

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

    let titleY = 200;
    let dishStartY = 300;

    // Polaroid at top if photo provided
    if (hasPhoto) {
        const pw = 800, ph = 620;
        const px = (w - pw) / 2;
        drawPolaroid(ctx, opts.photoImg, px, 60, pw, ph, opts.locationText);
        titleY = 60 + ph + 56;
        dishStartY = titleY + 52;
    }

    // Title
    const titleFont = hasPhoto ? 36 : 48;
    ctx.fillStyle = '#888'; ctx.font = `600 ${titleFont}px -apple-system, sans-serif`;
    ctx.fillText(t('shareTitle').toUpperCase(), w / 2, titleY);

    if (opts.activeDishes.length === 0) {
        ctx.fillStyle = '#666'; ctx.font = 'italic 40px -apple-system, sans-serif';
        ctx.fillText('...', w / 2, h / 2);
        return;
    }

    // Layout: 2-col grid
    const dishSize = hasPhoto ? 140 : 200;
    const countFont = hasPhoto ? 60 : 80;
    const nameFont = hasPhoto ? 24 : 28;
    const countOffset = hasPhoto ? 90 : 122;
    const dishGap = hasPhoto ? 60 : 70;
    const rowStep = dishSize + countOffset + (hasPhoto ? 30 : 40) + dishGap;
    const cols = opts.activeDishes.length === 1 ? 1 : 2;
    const rows = Math.ceil(opts.activeDishes.length / cols);
    const gridWidth = cols * dishSize + (cols - 1) * dishGap;
    const startX = w / 2 - gridWidth / 2 + dishSize / 2;

    for (let i = 0; i < opts.activeDishes.length; i++) {
        const dish = opts.activeDishes[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = startX + col * (dishSize + dishGap);
        const y = dishStartY + row * rowStep;

        await drawDishWithMood(ctx, dish.key, dishCounts[dish.key].today, x, y, dishSize, dishSize);

        ctx.fillStyle = '#eee'; ctx.font = `600 ${nameFont}px -apple-system, sans-serif`;
        ctx.fillText(dish[lang].name, x, y + dishSize / 2 + (hasPhoto ? 30 : 42));

        // Neon glow count
        const nameOff = hasPhoto ? 30 : 42;
        ctx.save();
        ctx.shadowColor = '#f5c518';
        ctx.shadowBlur = 30;
        const cg = ctx.createLinearGradient(x - 50, y + dishSize / 2 + nameOff + 10, x + 50, y + dishSize / 2 + countOffset);
        cg.addColorStop(0, '#f5c518'); cg.addColorStop(1, '#e94560');
        ctx.fillStyle = cg; ctx.font = `800 ${countFont}px -apple-system, sans-serif`;
        ctx.fillText(dishCounts[dish.key].today.toString(), x, y + dishSize / 2 + countOffset);
        ctx.restore();
    }

    // Combined total
    const dishesBottom = dishStartY + (rows - 1) * rowStep + dishSize / 2 + countOffset;
    const statsY = dishesBottom + (hasPhoto ? 70 : 100);

    ctx.fillStyle = '#888'; ctx.font = '600 36px -apple-system, sans-serif';
    ctx.fillText(t('shareToday').toUpperCase(), w / 2, statsY);

    ctx.save();
    ctx.shadowColor = '#f5c518';
    ctx.shadowBlur = 40;
    const cgBig = ctx.createLinearGradient(w / 2 - 150, statsY + 20, w / 2 + 150, statsY + 140);
    cgBig.addColorStop(0, '#f5c518'); cgBig.addColorStop(1, '#e94560');
    ctx.fillStyle = cgBig; ctx.font = '800 140px -apple-system, sans-serif';
    ctx.fillText(opts.totalToday.toString(), w / 2, statsY + 130);
    ctx.restore();

    // Stats cards (no photo only)
    if (!hasPhoto) {
        const stats = [
            { label: t('shareWeek').toUpperCase(), value: opts.totalWeek },
            { label: t('shareMonth').toUpperCase(), value: opts.totalMonth },
            { label: t('shareAll').toUpperCase(), value: opts.totalAll },
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
    }

    if (!hasPhoto && opts.locationText) {
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '500 34px -apple-system, sans-serif';
        ctx.fillText('📍 ' + opts.locationText, w / 2, h - 220);
    }

    drawCardFooter(ctx, w, h, opts);
}

// ── Template 2: "Retro Film" — polaroid / analog aesthetic ──
async function generateTemplateRetro(ctx, w, h, opts) {
    const hasPhoto = !!opts.photoImg;

    // Warm beige paper bg
    ctx.fillStyle = '#f4efe4';
    ctx.fillRect(0, 0, w, h);

    // Subtle paper texture (noise dots)
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 3000; i++) {
        const nx = Math.random() * w, ny = Math.random() * h;
        ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#8b7355';
        ctx.fillRect(nx, ny, 2, 2);
    }
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';

    // Polaroid photo if provided (tilted)
    let contentY = 160;
    if (hasPhoto) {
        ctx.save();
        ctx.translate(w / 2, 400);
        ctx.rotate(-0.05);
        ctx.translate(-w / 2, -400);
        const pw = 700, ph = 560;
        const px = (w - pw) / 2;
        drawPolaroid(ctx, opts.photoImg, px, 100, pw, ph, opts.locationText);
        ctx.restore();

        // Tape effect on top corner
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#d4c9a8';
        ctx.translate(w / 2 + 200, 110);
        ctx.rotate(0.3);
        ctx.fillRect(-50, -12, 100, 24);
        ctx.restore();

        contentY = 720;
    }

    // Title — handwriting style
    ctx.fillStyle = '#5a4a3a';
    ctx.font = 'italic 600 44px Georgia, serif';
    ctx.fillText(t('shareTitle'), w / 2, contentY);

    // Big count — bold serif
    ctx.fillStyle = '#2c1810';
    ctx.font = 'italic 800 200px Georgia, serif';
    ctx.fillText(opts.totalToday.toString(), w / 2, contentY + 220);

    // Dish details
    const dishY = contentY + 320;
    const iconSize = 100;
    const gap = 50;
    const totalWidth = opts.activeDishes.length * iconSize + (opts.activeDishes.length - 1) * gap;
    let startX = (w - totalWidth) / 2 + iconSize / 2;

    for (const dish of opts.activeDishes) {
        await drawDishWithMood(ctx, dish.key, dishCounts[dish.key].today, startX, dishY, iconSize, iconSize);
        ctx.fillStyle = '#5a4a3a'; ctx.font = 'italic 24px Georgia, serif';
        ctx.fillText(dish[lang].name, startX, dishY + iconSize / 2 + 32);
        ctx.fillStyle = '#2c1810'; ctx.font = 'italic 800 36px Georgia, serif';
        ctx.fillText(dishCounts[dish.key].today.toString(), startX, dishY + iconSize / 2 + 70);
        startX += iconSize + gap;
    }

    // Location as stamp
    if (opts.locationText && !hasPhoto) {
        ctx.save();
        ctx.translate(w / 2, h - 340);
        ctx.rotate(-0.03);
        ctx.strokeStyle = '#8b4513';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.roundRect(-200, -30, 400, 60, 8); ctx.stroke();
        ctx.fillStyle = '#8b4513';
        ctx.font = '600 28px Georgia, serif';
        ctx.globalAlpha = 0.6;
        ctx.fillText('📍 ' + opts.locationText, 0, 8);
        ctx.restore();
    }

    drawCardFooter(ctx, w, h, opts, 'rgba(0,0,0,0.15)', '#8b4513');
}

// ── Template 3: "Chaos / Meme" — gen-z unhinged ──
async function generateTemplateChaos(ctx, w, h, opts) {
    const hasPhoto = !!opts.photoImg;

    // Bright clash colors bg
    const bgColors = ['#39ff14', '#ff00ff', '#ffff00', '#00ffff'];
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#ff00ff');
    grad.addColorStop(0.33, '#39ff14');
    grad.addColorStop(0.66, '#ffff00');
    grad.addColorStop(1, '#00ffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Noisy overlay
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = bgColors[Math.floor(Math.random() * bgColors.length)];
        const sz = 4 + Math.random() * 8;
        ctx.fillRect(Math.random() * w, Math.random() * h, sz, sz);
    }
    ctx.globalAlpha = 1;

    // Random scattered emoji
    const emojis = ['🔥', '💀', '😤', '🤯', '💪', '🇬🇪', '👑', '🫠', '😈'];
    ctx.font = '60px sans-serif';
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 12; i++) {
        const em = emojis[Math.floor(Math.random() * emojis.length)];
        ctx.save();
        ctx.translate(Math.random() * w, Math.random() * h);
        ctx.rotate((Math.random() - 0.5) * 0.8);
        ctx.fillText(em, 0, 0);
        ctx.restore();
    }
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';

    // Photo as circular cutout
    if (hasPhoto) {
        ctx.save();
        const cx = w / 2, cy = 420, radius = 280;
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
        const img = opts.photoImg;
        const sc = Math.max(radius * 2 / img.naturalWidth, radius * 2 / img.naturalHeight);
        const dw = img.naturalWidth * sc, dh = img.naturalHeight * sc;
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
        ctx.restore();
        // Circle border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(w / 2, 420, 280, 0, Math.PI * 2); ctx.stroke();
    }

    const contentY = hasPhoto ? 780 : 300;

    // "I CAN'T STOP" or hype text for high counts
    const chaosTexts = opts.totalToday >= 15
        ? { ka: 'ვეღარ ვჩერდები!!! 🤯', en: 'I CAN\'T STOP!!! 🤯' }
        : opts.totalToday >= 8
            ? { ka: 'გაჩერება არ ვიცი 😤', en: 'NO BRAKES 😤' }
            : { ka: 'დავიწყე!! 🔥', en: 'JUST GETTING STARTED!! 🔥' };

    ctx.save();
    ctx.translate(w / 2, contentY);
    ctx.rotate(-0.06);
    ctx.fillStyle = '#000';
    ctx.font = '900 56px Impact, sans-serif';
    ctx.fillText(chaosTexts[lang], 0, 0);
    ctx.restore();

    // Huge tilted count
    ctx.save();
    ctx.translate(w / 2, contentY + 220);
    ctx.rotate(0.08);
    // White stroke outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 16;
    ctx.font = '900 280px Impact, sans-serif';
    ctx.strokeText(opts.totalToday.toString(), 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillText(opts.totalToday.toString(), 0, 0);
    ctx.restore();

    // Main dish image huge and rotated
    if (opts.activeDishes.length > 0) {
        const mainDish = opts.activeDishes[0];
        ctx.save();
        ctx.translate(w / 2, contentY + 540);
        ctx.rotate(-0.12);
        await drawDishWithMood(ctx, mainDish.key, dishCounts[mainDish.key].today, 0, 0, 250, 250);
        ctx.restore();

        // Other dishes smaller
        if (opts.activeDishes.length > 1) {
            const others = opts.activeDishes.slice(1);
            const otherY = contentY + 540;
            let ox = 160;
            for (const dish of others) {
                ctx.save();
                ctx.translate(ox, otherY + 80);
                ctx.rotate((Math.random() - 0.5) * 0.3);
                await drawDishWithMood(ctx, dish.key, dishCounts[dish.key].today, 0, 0, 120, 120);
                ctx.restore();
                ox = w - 160;
            }
        }
    }

    // Location
    if (opts.locationText) {
        ctx.save();
        ctx.translate(w / 2, h - 280);
        ctx.rotate(0.04);
        ctx.fillStyle = '#000'; ctx.font = '900 34px Impact, sans-serif';
        ctx.fillText('📍 ' + opts.locationText.toUpperCase(), 0, 0);
        ctx.restore();
    }

    // Watermark
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.font = '900 40px Impact, sans-serif';
    ctx.fillText('vchame.ge', w / 2, h - 140);
    if (currentStreak >= 2) {
        ctx.fillStyle = '#000'; ctx.font = '900 34px Impact, sans-serif';
        ctx.fillText(`🔥 ${currentStreak} DAY STREAK`, w / 2, h - 90);
    }
    if (opts.totalAll > 0) {
        ctx.fillStyle = '#000'; ctx.font = '900 28px Impact, sans-serif';
        ctx.fillText(opts.badge[lang], w / 2, h - 50);
    }
}

const TEMPLATES = [generateTemplateClean, generateTemplateNeon, generateTemplateRetro, generateTemplateChaos];
const TEMPLATE_NAMES = {
    ka: ['სუფთა', 'ნეონი', 'რეტრო', 'ქაოსი'],
    en: ['Clean', 'Neon', 'Retro', 'Chaos'],
};

// ── Carousel state ──
let carouselIdx = 0;

function openCarousel() {
    carouselIdx = 0;
    dom.shareCarousel.classList.add('open');
    dom.scTitle.textContent = t('scTitle');
    dom.scShareLabel.textContent = t('scShare');
    updateCarouselDots();
    updateCarouselTransform();
}

function closeCarousel() {
    dom.shareCarousel.classList.remove('open');
}

function updateCarouselDots() {
    dom.scDots.querySelectorAll('.sc-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === carouselIdx);
    });
}

function updateCarouselTransform() {
    dom.scTrack.style.transform = `translateX(-${carouselIdx * 100}vw)`;
}

function goToCard(idx) {
    carouselIdx = Math.max(0, Math.min(TEMPLATES.length - 1, idx));
    updateCarouselDots();
    updateCarouselTransform();
}

// Touch swipe on carousel
(function setupCarouselSwipe() {
    let startX = 0, startY = 0, dx = 0, swiping = false;
    const track = dom.scTrack;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        dx = 0;
        swiping = false;
        track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        dx = e.touches[0].clientX - startX;
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (!swiping && Math.abs(dx) > dy && Math.abs(dx) > 10) swiping = true;
        if (swiping) {
            const offset = -carouselIdx * window.innerWidth + dx;
            track.style.transform = `translateX(${offset}px)`;
        }
    }, { passive: true });

    track.addEventListener('touchend', () => {
        track.style.transition = '';
        if (swiping) {
            if (dx < -50) goToCard(carouselIdx + 1);
            else if (dx > 50) goToCard(carouselIdx - 1);
            else updateCarouselTransform();
        }
        swiping = false;
    });
})();

dom.scClose.addEventListener('click', closeCarousel);
dom.scShareBtn.addEventListener('click', () => {
    const canvas = document.getElementById('scCard' + carouselIdx);
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'vchame-stats.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
            try { await navigator.share({ files: [file] }); } catch {}
        }
    }, 'image/png');
});

async function renderAllTemplates(locationText, photoImg) {
    const opts = getShareOpts(locationText, photoImg);
    const w = 1080, h = 1920;
    await Promise.all(TEMPLATES.map(async (fn, i) => {
        const canvas = document.getElementById('scCard' + i);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        await fn(ctx, w, h, opts);
    }));
}

// ── Stats panel ──
function openStatsPanel() {
    dom.statsPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderStatsPanel();
    loadLeaderboard(currentLbPeriod);
    loadMyFriendCode().then(() => {
        loadFriends().then(renderFriends);
    });
}

function closeStatsPanel() {
    dom.statsPanel.classList.remove('open');
    document.body.style.overflow = '';
}

function buildFriendProfileHTML(f) {
    const dishNames = {
        khinkali: { ka: 'ხინკალი', en: 'Khinkali' },
        khachapuri: { ka: 'ხაჭაპური', en: 'Khachapuri' },
        qababi: { ka: 'ქაბაბი', en: 'Qababi' },
        lobiani: { ka: 'ლობიანი', en: 'Lobiani' }
    };
    const displayName = f.nickname || f.friendCode;
    const badge = f.badge ? (f.badge[lang] || f.badge.en || '') : '';
    const streakHtml = (f.streak >= 2)
        ? `<div class="fp-hero-streak">🔥 ${f.streak} ${t('fpDayStreak')}</div>` : '';

    const myToday = Object.values(dishCounts).reduce((s, d) => s + d.today, 0);
    const theirToday = f.totalToday ?? 0;
    const theirWeek = f.totalWeek ?? 0;
    const theirAllTime = f.totalAllTime ?? 0;

    let comparison = '';
    if (myToday === 0 && theirToday === 0) {
        comparison = lang === 'ka' ? 'არც შენ, არც ის...' : 'Both slacking...';
    } else if (myToday === 0) {
        comparison = lang === 'ka' ? `გასწია ${theirToday}-ით!` : `They're ahead by ${theirToday}!`;
    } else if (theirToday === 0) {
        comparison = lang === 'ka' ? `შენ გასწევ ${myToday}-ით!` : `You're ahead by ${myToday}!`;
    } else {
        const ratio = (myToday / theirToday).toFixed(1);
        if (ratio > 1.2) {
            comparison = lang === 'ka' ? `${ratio}×-ით მეტი გაქვს!` : `You ate ${ratio}× more!`;
        } else if (ratio < 0.8) {
            const theirRatio = (theirToday / myToday).toFixed(1);
            comparison = lang === 'ka' ? `მათ ${theirRatio}×-ით მეტი აქვთ!` : `They ate ${theirRatio}× more!`;
        } else {
            comparison = lang === 'ka' ? 'თითქმის თანაბარი ხართ!' : 'Almost equal!';
        }
    }

    const byDishRows = (f.byDish || [])
        .filter(d => d.allTime > 0)
        .map(d => {
            const name = dishNames[d.dish]?.[lang] || d.dish;
            return `<div class="fp-dish-row">
                <img src="/images/${d.dish}.png" alt="">
                <div class="fp-dish-row-info">
                    <div class="fp-dish-row-name">${name}</div>
                    <div class="fp-dish-row-counts">${t('fpAllTime')}: ${d.allTime}</div>
                </div>
                <div class="fp-dish-row-today">${d.today > 0 ? d.today : ''}</div>
            </div>`;
        }).join('');

    const byDishSection = byDishRows
        ? `<div class="fp-section-label">${t('fpByDish')}</div>
           <div class="fp-dish-list">${byDishRows}</div>`
        : '';

    return `
        <div class="fp-hero">
            <img class="fp-hero-img" src="/images/${f.topDish || 'khinkali'}.png" alt="">
            <div class="fp-hero-code">${f.friendCode}</div>
            <div class="fp-hero-name">${displayName}</div>
            <div class="fp-hero-badge">${badge}</div>
            ${streakHtml}
        </div>
        <div class="fp-stats-row">
            <div class="fp-stat-box">
                <span class="fp-stat-box-num">${theirToday}</span>
                <span class="fp-stat-box-lbl">${t('today')}</span>
            </div>
            <div class="fp-stat-box">
                <span class="fp-stat-box-num">${theirWeek}</span>
                <span class="fp-stat-box-lbl">${t('thisWeek')}</span>
            </div>
            <div class="fp-stat-box">
                <span class="fp-stat-box-num">${theirAllTime}</span>
                <span class="fp-stat-box-lbl">${t('fpAllTime')}</span>
            </div>
        </div>
        ${byDishSection}
        <div class="fp-section-label">${t('fpVsYou')}</div>
        <div class="fp-comparison">${comparison}</div>
        <button id="fpRemoveFriendBtn" class="fp-remove-btn" data-friend-code="${f.friendCode}">${lang === 'ka' ? '🗑 მეგობრის წაშლა' : '🗑 Remove Friend'}</button>
    `;
}

function openFriendProfile(idx) {
    const f = friendsList[idx];
    if (!f) return;
    openProfileFriendIdx = idx;
    dom.friendProfileBody.innerHTML = buildFriendProfileHTML(f);
    dom.friendProfileBackLabel.textContent = t('fpBack');
    dom.friendProfilePanel.classList.add('open');
    // Attach remove button handler
    setTimeout(() => {
        const removeBtn = document.getElementById('fpRemoveFriendBtn');
        if (removeBtn) {
            removeBtn.onclick = async () => {
                const friendCode = f.friendCode;
                const confirmMsg = lang === 'ka' ? 'ნამდვილად გინდა მეგობრის წაშლა?' : 'Remove this friend?';
                if (confirm(confirmMsg)) {
                    const success = await removeFriend(friendCode);
                    if (success) {
                        closeFriendProfile();
                        await loadFriends();
                        renderFriends();
                    }
                }
            };
        }
    }, 0);
}

function closeFriendProfile() {
    dom.friendProfilePanel.classList.remove('open');
    openProfileFriendIdx = -1;
}

function renderStatsPanel() {
    // Badge
    const badge = getPersonalityBadge();
    dom.spBadge.textContent = badge[lang];
    const totalAllTime = Object.values(dishCounts).reduce((s, d) => s + d.allTime, 0);
    dom.spBadge.style.display = totalAllTime > 0 ? '' : 'none';

    // Streak row
    const streakHtml = currentStreak >= 2
        ? `<div class="sp-streak-row">🔥 ${currentStreak}-day streak</div>`
        : '';

    // Personal stats from existing state
    const hasSomething = Object.values(dishCounts).some(d => d.allTime > 0);
    if (!hasSomething) {
        dom.spPersonalCards.innerHTML = `${streakHtml}<p class="sp-empty">${t('statsNone')}</p>`;
    } else {
        dom.spPersonalCards.innerHTML = streakHtml + dishes.map(d => {
            const s = dishCounts[d.key];
            if (s.allTime === 0) return '';
            return `<div class="sp-dish-card">
                <img src="/images/${d.key}.png" alt="">
                <div class="sp-dish-body">
                    <div class="sp-dish-name">${d[lang].name}</div>
                    <div class="sp-dish-stats">
                        <div class="sp-stat"><span class="sp-stat-num">${s.today}</span><span class="sp-stat-lbl">${t('today')}</span></div>
                        <div class="sp-stat"><span class="sp-stat-num">${s.week}</span><span class="sp-stat-lbl">${t('thisWeek')}</span></div>
                        <div class="sp-stat"><span class="sp-stat-num">${s.allTime}</span><span class="sp-stat-lbl">${t('allTime')}</span></div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    // Global totals (from cached state)
    dom.spGlobalTotal.textContent = globalTotal.toLocaleString();
    dom.spGlobalPeople.textContent = globalPeople.toLocaleString();

    const byDishMap = {};
    globalByDish.forEach(d => byDishMap[d.dish] = d.count);
    const maxCount = Math.max(1, ...Object.values(byDishMap));

    dom.spGlobalDishes.innerHTML = dishes.map(d => {
        const count = byDishMap[d.key] || 0;
        const pct = Math.round((count / maxCount) * 100);
        return `<div class="sp-global-row">
            <img src="/images/${d.key}.png" alt="">
            <div class="sp-global-info">
                <div class="sp-global-name">
                    <span>${d[lang].name}</span>
                    <span class="sp-global-count">${count.toLocaleString()}</span>
                </div>
                <div class="sp-bar-track"><div class="sp-bar-fill" style="width:${pct}%"></div></div>
            </div>
        </div>`;
    }).join('');
}

// ── Share modal ──
let sharePhotoImg = null;

function openShareModal() {
    dom.shareModal.classList.add('open');
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
dom.shareBtn.addEventListener('click', openShareModal);
dom.undoBtn.addEventListener('click', undoEat);
dom.clearBtn.addEventListener('click', clearDish);
dom.langBtn.addEventListener('click', () => { lang = lang === 'ka' ? 'en' : 'ka'; applyLang(); });

// Stats panel
dom.statsLink.addEventListener('click', (e) => { e.preventDefault(); openStatsPanel(); });
dom.statsPanelClose.addEventListener('click', closeStatsPanel);
dom.friendProfileClose.addEventListener('click', closeFriendProfile);
dom.statsPanelLangBtn.addEventListener('click', () => { lang = lang === 'ka' ? 'en' : 'ka'; applyLang(); });

// Share modal
dom.shareModalClose.addEventListener('click', () => dom.shareModal.classList.remove('open'));
dom.shareModal.addEventListener('click', (e) => { if (e.target === dom.shareModal) dom.shareModal.classList.remove('open'); });
dom.sharePhotoPick.addEventListener('click', () => dom.sharePhotoInput.click());
dom.sharePhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        dom.sharePhotoPreview.src = ev.target.result;
        dom.sharePhotoPreview.style.display = 'block';
        dom.sharePhotoRemove.style.display = 'inline-flex';
        sharePhotoImg = dom.sharePhotoPreview;
    };
    reader.readAsDataURL(file);
});
dom.sharePhotoRemove.addEventListener('click', () => {
    sharePhotoImg = null;
    dom.sharePhotoPreview.style.display = 'none';
    dom.sharePhotoPreview.src = '';
    dom.sharePhotoRemove.style.display = 'none';
    dom.sharePhotoInput.value = '';
});
dom.shareGenerate.addEventListener('click', async () => {
    dom.shareModal.classList.remove('open');
    const loc = dom.shareLocation.value.trim();
    const photo = sharePhotoImg?.complete && sharePhotoImg.naturalWidth > 0 ? sharePhotoImg : null;
    await renderAllTemplates(loc, photo);
    openCarousel();
});

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

// Reconcile with server when user returns to the app
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && pendingCount === 0) loadStats();
});

// Stats panel tab switching
document.querySelectorAll('.sp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        activeStatsTab = tab.dataset.tab;
        document.querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        dom.spPersonalSection.style.display = activeStatsTab === 'personal' ? '' : 'none';
        dom.spGlobalSection.style.display = activeStatsTab === 'global' ? '' : 'none';
        dom.spFriendsSection.style.display = activeStatsTab === 'friends' ? '' : 'none';
        if (activeStatsTab === 'friends') loadFriends().then(renderFriends);
    });
});

// Leaderboard period toggle
document.querySelectorAll('.sp-lb-period').forEach(btn => {
    btn.addEventListener('click', () => {
        currentLbPeriod = btn.dataset.period;
        document.querySelectorAll('.sp-lb-period').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadLeaderboard(currentLbPeriod);
    });
});

// ── Friends ──
async function loadMyFriendCode() {
    try {
        const res = await fetch(`/api/friend-code/${deviceId}`);
        if (res.ok) {
            const data = await res.json();
            myFriendCode = data.code;
            myNickname = data.nickname || '';
        }
    } catch (e) {}
}

async function setNickname(nickname) {
    try {
        const res = await fetch('/api/set-nickname', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, nickname })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

async function addFriend(friendCode) {
    try {
        console.log('[DEBUG] addFriend() - Attempting to add friend with code:', friendCode);
        const res = await fetch('/api/add-friend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, friendCode })
        });
        console.log('[DEBUG] addFriend() - Response status:', res.status, 'OK:', res.ok);
        if (!res.ok) {
            const errorText = await res.text();
            console.log('[DEBUG] addFriend() - Error response:', errorText);
        }
        return res.ok;
    } catch (e) {
        console.log('[DEBUG] addFriend() - Caught exception:', e.message, e);
        return false;
    }
}
async function removeFriend(friendCode) {
    try {
        const res = await fetch('/api/remove-friend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, friendCode })
        });
        return res.ok;
    } catch (e) {
        console.log('[ERROR] removeFriend() -', e);
        return false;
    }
}

async function loadFriends() {
    try {
        const ld = localDate();
        const url = `/api/friends/${deviceId}?localDate=${ld}`;
        console.log('[DEBUG] loadFriends() - Fetching from URL:', url);
        const res = await fetch(url);
        console.log('[DEBUG] loadFriends() - Response status:', res.status);
        if (res.ok) {
            friendsList = await res.json();
            console.log('[DEBUG] loadFriends() - Successfully loaded', friendsList.length, 'friends');
            console.log('[DEBUG] loadFriends() - Friends list content:', friendsList);
            if (openProfileFriendIdx >= 0) closeFriendProfile();
        } else {
            const errorText = await res.text();
            console.log('[DEBUG] loadFriends() - Response not OK. Status:', res.status, 'Error:', errorText);
        }
    } catch (e) {
        console.log('[DEBUG] loadFriends() - Caught exception:', e.message, e);
    }
}

function renderFriends() {
    const container = document.getElementById('spFriendsList');
    const codeEl = document.getElementById('spFriendsCode');
    const nicknameInput = document.getElementById('spFriendsNickname');

    if (codeEl) codeEl.textContent = myFriendCode || '------';
    if (nicknameInput) nicknameInput.value = myNickname;

    if (!container) return;

    if (friendsList.length === 0) {
        container.innerHTML = `
            <div class="sp-friends-empty">
                <div class="sp-friends-empty-title">${i18n[lang].friendsNone}</div>
                <div class="sp-friends-empty-hint">${i18n[lang].friendsHint}</div>
            </div>
        `;
        return;
    }

    const myToday = Object.values(dishCounts).reduce((s, d) => s + d.today, 0);

    container.innerHTML = friendsList.map((f, idx) => {
        const theirToday = f.totalToday ?? 0;
        const theirWeek = f.totalWeek ?? 0;
        let comparison = '';
        if (myToday === 0 && theirToday === 0) {
            comparison = lang === 'ka' ? 'არც შენ, არც ის...' : 'Both slacking...';
        } else if (myToday === 0) {
            comparison = lang === 'ka' ? `გასწია ${theirToday}-ით!` : `They're ahead by ${theirToday}!`;
        } else if (theirToday === 0) {
            comparison = lang === 'ka' ? `შენ გასწევ ${myToday}-ით!` : `You're ahead by ${myToday}!`;
        } else {
            const ratio = (myToday / theirToday).toFixed(1);
            if (ratio > 1.2) {
                comparison = lang === 'ka' ? `${ratio}×-ით მეტი გაქვს!` : `You ate ${ratio}× more!`;
            } else if (ratio < 0.8) {
                const theirRatio = (theirToday / myToday).toFixed(1);
                comparison = lang === 'ka' ? `მათ ${theirRatio}×-ით მეტი აქვთ!` : `They ate ${theirRatio}× more!`;
            } else {
                comparison = lang === 'ka' ? 'თითქმის თანაბარი ხართ!' : 'Almost equal!';
            }
        }

        const badge = f.badge ? (f.badge[lang] || f.badge.en || '') : '';
        return `
            <div class="sp-friend-card" data-friend-idx="${idx}">
                <span class="sp-friend-card-chevron">›</span>
                <div class="sp-friend-header">
                    <span class="sp-friend-name">${f.nickname || 'Friend ' + f.friendCode}</span>
                    <span class="sp-friend-badge">${badge}</span>
                </div>
                <div class="sp-friend-stats">
                    <div class="sp-friend-stat">
                        <span class="sp-friend-stat-label">${i18n[lang].friendsToday}</span>
                        <span class="sp-friend-stat-value">${theirToday}</span>
                    </div>
                    <div class="sp-friend-stat">
                        <span class="sp-friend-stat-label">${i18n[lang].friendsWeek}</span>
                        <span class="sp-friend-stat-value">${theirWeek}</span>
                    </div>
                </div>
                <div class="sp-friend-comparison">${comparison}</div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.sp-friend-card').forEach(card => {
        card.addEventListener('click', () => openFriendProfile(parseInt(card.dataset.friendIdx, 10)));
    });
}

// ── Offline ──
function showOfflineBanner() {
    dom.offlineBanner.style.display = '';
    dom.offlineBannerText.textContent = lang === 'ka'
        ? 'ოფლაინ — ცვლილებები ვერ შეინახება'
        : 'offline — counts won\'t sync';
}
function hideOfflineBanner() {
    dom.offlineBanner.style.display = 'none';
}

window.addEventListener('offline', showOfflineBanner);
window.addEventListener('online', () => {
    hideOfflineBanner();
    if (pendingCount !== 0) syncToServer();
    loadStats();
    loadGlobal();
});


// ── Friends event listeners ──
document.getElementById('spFriendsSaveNickname')?.addEventListener('click', async () => {
    const input = document.getElementById('spFriendsNickname');
    const nickname = input.value.trim();
    if (nickname) {
        await setNickname(nickname);
        myNickname = nickname;
        renderFriends();
    }
});

document.getElementById('spFriendsCopyCode')?.addEventListener('click', () => {
    const codeText = document.getElementById('spFriendsCode').textContent;
    if (navigator.clipboard && codeText) {
        navigator.clipboard.writeText(codeText).then(() => {
            const btn = document.getElementById('spFriendsCopyCode');
            const originalText = btn.textContent;
            btn.textContent = lang === 'ka' ? '✓ დაკოპირდა' : '✓ Copied';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
    }
});

document.getElementById('spFriendsAddBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('spFriendsAddInput');
    const friendCode = input.value.trim();
    if (friendCode && friendCode.length >= 6) {
        const result = await addFriend(friendCode);
        if (result) {
            input.value = '';
            await loadFriends();
            renderFriends();
        }
    }
});

// ── Init ──
// Restore cached counts instantly (no zero-flash for returning users)
try {
    const cached = localStorage.getItem('vchame_counts_cache');
    if (cached) {
        const parsed = JSON.parse(cached);
        Object.keys(dishCounts).forEach(dish => {
            if (parsed[dish]) dishCounts[dish] = parsed[dish];
        });
        updateAllCounters();
        updateMood();
    }
} catch {}

if (!navigator.onLine) showOfflineBanner();

applyLang();
loadStats();
loadGlobal();
