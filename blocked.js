var api = typeof browser !== 'undefined' ? browser : chrome;
var AVG_HOURS = 2.4;
var TITLES_L1 = [
  "oh hey.", "you again?", "nice try.", "nope.", "not happening."
];
var TITLES_L2 = [
  "you're becoming a regular.", "we literally just did this.",
  "the audacity.", "back so soon?", "wow, that lasted long."
];
var TITLES_L3 = [
  "okay this is getting sad.", "you're not even trying anymore.",
  "three words: impulse control.",
  "i'm starting to worry about you.", "you need a hobby. badly."
];
var TITLES_L4 = [
  "this is embarrassing for both of us.",
  "you've tried more times today than i can count.",
  "at this point you're just visiting me.",
  "we're past denial. welcome to stage two.",
  "your willpower has left the chat."
];
var TITLES_L5 = [
  "SEEK HELP.", "this isn't funny anymore.",
  "i'm literally an extension and i'm concerned.",
  "you have broken the system. congratulations.",
  "i ran out of things to say. just... stop."
];
var ROASTS_L1 = [
  "nothing interesting happened since you last checked. promise.",
  "go drink some water or something.",
  "you have better things to do. probably.",
  "the feed will survive without you.",
  "deep breath. the urge passes in 10 seconds."
];
var ROASTS_L2 = [
  "your ex didn't post anything interesting. i checked.",
  "nobody noticed you were gone. relax.",
  "the algorithm literally does not care about you.",
  "your feed is 90% ads and 10% rage bait. you're welcome.",
  "imagine explaining to your grandma what doomscrolling is."
];
var ROASTS_L3 = [
  "you've now spent more energy trying to get past me than you would've on the actual feed.",
  "at this rate you should just stare at a wall. same dopamine.",
  "you have 14 unread books. just saying.",
  "the people you're stalking are also just scrolling. it's turtles all the way down.",
  "your screen time report is already drafting its resignation letter."
];
var ROASTS_L4 = [
  "i've seen addicts with more chill than you.",
  "your neurons are literally begging you to stop.",
  "you know what's faster than scrolling? touching grass.",
  "you've clicked this more times today than you've blinked.",
  "congrats, you've made procrastination into a speedrun."
];
var ROASTS_L5 = [
  "i am running out of roasts because you won't stop coming back. this is YOUR fault.",
  "at this point the social media companies should be paying you rent.",
  "i have been triggered more times today than a twitter user.",
  "somewhere, a server is keeping count. and judging you.",
  "this is the digital equivalent of opening the fridge for the 47th time expecting new food."
];
var RAGE_LEVELS = [
  { min:0, max:2, titles:TITLES_L1, roasts:ROASTS_L1, label:'threat level: mild curiosity', cls:'' },
  { min:3, max:5, titles:TITLES_L2, roasts:ROASTS_L2, label:'threat level: concerning', cls:'lvl2' },
  { min:6, max:10, titles:TITLES_L3, roasts:ROASTS_L3, label:'threat level: addiction detected', cls:'lvl3' },
  { min:11, max:20, titles:TITLES_L4, roasts:ROASTS_L4, label:'threat level: critical', cls:'lvl4' },
  { min:21, max:9999, titles:TITLES_L5, roasts:ROASTS_L5, label:'threat level: DEFCON 1', cls:'lvl5' }
];
var NIGHT_TITLES = [
  "go to sleep.", "it's literally the middle of the night.",
  "your bed is RIGHT THERE.", "this is rock bottom and you know it.",
  "2am scrolling is a cry for help."
];
var NIGHT_ROASTS = [
  "nothing good ever happens on social media after midnight. this is a fact.",
  "your melatonin is crying. your circadian rhythm filed a restraining order.",
  "you're going to hate yourself at 7am. future you sends their regards.",
  "the blue light from this screen is literally cooking your retinas right now.",
  "every sleep scientist in the world just felt a disturbance in the force."
];
var SUGGESTIONS = [
  "drink a glass of water. your body is 60% water and 40% unread notifications.",
  "do 10 push-ups. or 5. or 1. one is fine.",
  "text your mom. she misses you more than your followers do.",
  "learn a guitar chord. Am is easy. start there.",
  "read a page of that book you bought 6 months ago.",
  "go for a 5-minute walk. yes, outside. where the sun lives.",
  "clean your desk. it takes 3 minutes and you'll feel like a new person.",
  "stretch. your spine is shaped like a question mark right now.",
  "make a cup of tea. the whole process. kettle and everything.",
  "write down 3 things you're grateful for. cringe? maybe. effective? absolutely.",
  "call a friend. an actual phone call. yes, people still do that.",
  "learn to say 'hello' in a new language. (hola. bonjour. merhaba. done.)",
  "organize your photos. you have 4,000 screenshots you'll never look at again.",
  "do the dishes. they've been waiting.",
  "close your eyes for 60 seconds. just breathe. that's it. that's the suggestion.",
  "draw something terrible. nobody has to see it.",
  "delete 5 apps you haven't opened in 3 months.",
  "look out the window. describe what you see. to yourself. quietly.",
  "plan what you're going to cook for dinner. actually cook it later.",
  "learn one keyboard shortcut you didn't know. ctrl+shift+T reopens closed tabs. you're welcome."
];
var SHAME_COMMENTS = [
  "impressive, honestly.",
  "seek professional help.",
  "a new personal worst.",
  "your therapist needs a therapist.",
  "hall of fame material right there.",
  "and you're still going.",
  "that's not a number, that's a lifestyle.",
  "this should be studied by scientists."
];
var MILESTONES = [
  { d:1, l:'24h' }, { d:3, l:'3d' }, { d:7, l:'1w' },
  { d:14, l:'2w' }, { d:30, l:'1mo' }, { d:90, l:'3mo' }
];
function pick(a) { return a[Math.floor(Math.random()*a.length)]; }
function daysSince(ts) { return Math.floor((Date.now()-ts)/864e5); }
function getRageLevel(todayCount) {
  for (var i = RAGE_LEVELS.length-1; i >= 0; i--) {
    if (todayCount >= RAGE_LEVELS[i].min) return RAGE_LEVELS[i];
  }
  return RAGE_LEVELS[0];
}
function isNightOwl() {
  var h = new Date().getHours();
  return h >= 2 && h < 5;
}
function animNum(id, target) {
  var el = document.getElementById(id);
  var t0 = performance.now();
  (function f(now) {
    var p = Math.min((now-t0)/850,1);
    el.textContent = Math.round((1-Math.pow(1-p,3))*target);
    if (p<1) requestAnimationFrame(f);
  })(t0);
}
function fireConfetti() {
  var canvas = document.getElementById('confettiCanvas');
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var particles = [];
  var colors = ['#ff6b4a','#22d67a','#fbbf24','#a78bfa','#f87171','#38bdf8'];
  for (var i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width/2 + (Math.random()-.5)*200,
      y: canvas.height/2,
      vx: (Math.random()-.5)*12,
      vy: -Math.random()*14 - 4,
      w: Math.random()*8+4,
      h: Math.random()*6+2,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      rv: (Math.random()-.5)*12,
      life: 1
    });
  }
  var startTime = performance.now();
  (function frame() {
    var elapsed = performance.now() - startTime;
    if (elapsed > 3000) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (var j = 0; j < particles.length; j++) {
      var p = particles[j];
      p.x += p.vx;
      p.vy += 0.3;
      p.y += p.vy;
      p.rot += p.rv;
      p.life -= 0.008;
      if (p.life <= 0) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }
    requestAnimationFrame(frame);
  })();
}
function initSnake() {
  var canvas = document.getElementById('snakeCanvas');
  var ctx = canvas.getContext('2d');
  var sz = 14; 
  var cols = 20, rows = 20;
  canvas.width = cols * sz;
  canvas.height = rows * sz;
  var snake, dir, food, score, alive, interval;
  function reset() {
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir = {x:1,y:0};
    score = 0;
    alive = true;
    placeFood();
    document.getElementById('snakeScore').textContent = '0';
  }
  function placeFood() {
    do {
      food = { x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows) };
    } while (snake.some(function(s){return s.x===food.x&&s.y===food.y}));
  }
  function draw() {
    ctx.fillStyle = '#0c0c10';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#ff6b4a';
    ctx.beginPath();
    ctx.arc(food.x*sz+sz/2, food.y*sz+sz/2, sz/2-1, 0, Math.PI*2);
    ctx.fill();
    for (var i=0; i<snake.length; i++) {
      var seg = snake[i];
      var alpha = 1 - (i / snake.length) * 0.6;
      ctx.fillStyle = 'rgba(34,214,122,' + alpha + ')';
      ctx.fillRect(seg.x*sz+1, seg.y*sz+1, sz-2, sz-2);
    }
    if (!alive) {
      ctx.fillStyle = 'rgba(8,8,10,0.7)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#ff6b4a';
      ctx.font = '700 16px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText('rip. space to retry.', canvas.width/2, canvas.height/2);
    }
  }
  function tick() {
    if (!alive) return;
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) { alive = false; draw(); return; }
    if (snake.some(function(s){return s.x===head.x&&s.y===head.y})) { alive = false; draw(); return; }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById('snakeScore').textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === ' ' && !alive) { reset(); return; }
    var map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0} };
    var nd = map[e.key];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) {
      dir = nd;
      e.preventDefault();
    }
  });
  var tx, ty;
  canvas.addEventListener('touchstart', function(e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; });
  canvas.addEventListener('touchend', function(e) {
    if (!alive) { reset(); return; }
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
    } else {
      dir = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
    }
  });
  reset();
  draw();
  interval = setInterval(tick, 120);
}
function render(state) {
  var days = daysSince(state.installedAt || Date.now());
  var hours = Math.round(days * AVG_HOURS);
  var blocks = state.blockCount || 0;
  var todayCount = state.todayCount || 0;
  var worst = state.worstDay || { date: '—', count: 0 };
  var shown = state.milestonesShown || [];
  if (isNightOwl()) {
    document.getElementById('nightBadge').classList.remove('hidden');
    var h = new Date().getHours();
    document.getElementById('nightTime').textContent = h + ':' + String(new Date().getMinutes()).padStart(2,'0') + 'am';
  }
  var rage = isNightOwl() ? RAGE_LEVELS[4] : getRageLevel(todayCount);
  var fill = document.getElementById('rageFill');
  fill.className = 'rage-fill ' + rage.cls;
  document.getElementById('rageLabel').textContent = isNightOwl() ? 'threat level: go to sleep' : rage.label;
  if (isNightOwl()) {
    document.getElementById('titleText').textContent = pick(NIGHT_TITLES);
    document.getElementById('roastText').textContent = '"' + pick(NIGHT_ROASTS) + '"';
  } else {
    document.getElementById('titleText').textContent = pick(rage.titles);
    document.getElementById('roastText').textContent = '"' + pick(rage.roasts) + '"';
  }
  animNum('daysCount', days);
  animNum('hoursCount', hours);
  animNum('blockCount', blocks);
  var next = null, prev = 0;
  for (var i = 0; i < MILESTONES.length; i++) {
    if (MILESTONES[i].d > days) { next = MILESTONES[i]; break; }
    prev = MILESTONES[i].d;
  }
  var pct = next ? ((days - prev) / (next.d - prev)) * 100 : 100;
  setTimeout(function() {
    document.getElementById('weekProgress').style.width = Math.min(pct, 100) + '%';
  }, 200);
  var label = document.getElementById('milestoneLabel');
  if (next) {
    var left = next.d - days;
    label.textContent = left + ' day' + (left===1?'':'s') + ' to ' + next.l;
  } else {
    label.textContent = 'all milestones crushed. legend.';
  }
  var mhtml = '';
  for (var j = 0; j < MILESTONES.length; j++) {
    var m = MILESTONES[j];
    var done = days >= m.d;
    mhtml += '<span class="ms' + (done?' done':'') + '"><span class="ms-dot"></span>' + m.l + '</span>';
  }
  document.getElementById('milestones').innerHTML = mhtml;
  for (var k = 0; k < MILESTONES.length; k++) {
    if (days >= MILESTONES[k].d && shown.indexOf(MILESTONES[k].d) === -1) {
      fireConfetti();
      try { api.runtime.sendMessage({ type: 'MILESTONE_SHOWN', milestone: MILESTONES[k].d }); } catch(e){}
      break;
    }
  }
  document.getElementById('shameDate').textContent = worst.date;
  document.getElementById('shameCount').textContent = worst.count;
  document.getElementById('shameComment').textContent = worst.count > 20
    ? pick(SHAME_COMMENTS) : worst.count > 5
    ? 'not great, not terrible.' : 'rookie numbers, honestly.';
  document.getElementById('suggestionText').textContent = pick(SUGGESTIONS);
}
document.getElementById('snakeToggle').addEventListener('click', function() {
  var wrap = document.getElementById('snakeWrap');
  var wasHidden = wrap.classList.contains('hidden');
  wrap.classList.toggle('hidden');
  this.textContent = wasHidden ? 'hide snake' : '\uD83C\uDFAE bored? play snake instead';
  if (wasHidden) initSnake();
});
try {
  api.runtime.sendMessage({ type: 'GET_STATE' }, function(state) {
    if (api.runtime.lastError || !state) {
      api.storage.local.get(null, function(d) { render(d || {}); });
      return;
    }
    render(state);
  });
} catch(e) {
  api.storage.local.get(null, function(d) { render(d || {}); });
}
