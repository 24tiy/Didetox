var api = typeof browser !== 'undefined' ? browser : chrome;
var COOLDOWN = 7 * 864e5;
var AVG = 2.4;
function daysSince(ts) { return Math.floor((Date.now() - ts) / 864e5); }
function fmtCD(ms) {
  if (ms <= 0) return 'done!';
  var d = Math.floor(ms / 864e5);
  var h = Math.floor((ms % 864e5) / 36e5);
  var m = Math.floor((ms % 36e5) / 6e4);
  return d + 'd ' + h + 'h ' + m + 'm';
}
function show(id) {
  ['stDefault','stCooldown','stReady'].forEach(function(n) {
    document.getElementById(n).classList.toggle('hidden', n !== id);
  });
}
function getRageLvl(tc) {
  if (tc >= 21) return 5;
  if (tc >= 11) return 4;
  if (tc >= 6) return 3;
  if (tc >= 3) return 2;
  return 1;
}
var cdInterval;
function render(s) {
  var days = daysSince(s.installedAt || Date.now());
  document.getElementById('pDays').textContent = days;
  document.getElementById('pHours').textContent = Math.round(days * AVG);
  document.getElementById('pBlocks').textContent = s.blockCount || 0;
  var tc = s.todayCount || 0;
  var lvl = getRageLvl(tc);
  var fill = document.getElementById('pRage');
  fill.className = 'rage-row-fill';
  fill.style.width = (lvl * 20) + '%';
  if (lvl === 2) fill.classList.add('r2');
  if (lvl === 3) fill.classList.add('r3');
  if (lvl === 4) fill.classList.add('r4');
  if (lvl >= 5) fill.classList.add('r5');
  document.getElementById('pRageLvl').textContent = lvl + '/5';
  var w = s.worstDay || { date:'—', count:0 };
  document.getElementById('pShameDate').textContent = w.date;
  document.getElementById('pShameCount').textContent = w.count;
  if (!s.removalRequestedAt) {
    show('stDefault');
  } else {
    var left = COOLDOWN - (Date.now() - s.removalRequestedAt);
    if (left <= 0) {
      show('stReady');
    } else {
      show('stCooldown');
      clearInterval(cdInterval);
      function tick() {
        var r = COOLDOWN - (Date.now() - s.removalRequestedAt);
        if (r <= 0) { show('stReady'); clearInterval(cdInterval); return; }
        document.getElementById('cdTimer').textContent = fmtCD(r);
      }
      tick();
      cdInterval = setInterval(tick, 30000);
    }
  }
}
function load() {
  try {
    api.runtime.sendMessage({ type: 'GET_STATE' }, function(s) {
      if (api.runtime.lastError || !s) {
        api.storage.local.get(null, function(d) { render(d || {}); });
        return;
      }
      render(s);
    });
  } catch(e) {
    api.storage.local.get(null, function(d) { render(d || {}); });
  }
}
document.getElementById('reqBtn').addEventListener('click', function() {
  if (!confirm("Starting the 7-day cooldown. You can cancel anytime if you chicken out.")) return;
  api.runtime.sendMessage({ type: 'REQUEST_REMOVAL' }, load);
});
document.getElementById('cancelBtn').addEventListener('click', function() {
  api.runtime.sendMessage({ type: 'CANCEL_REMOVAL' }, load);
});
document.getElementById('stayBtn').addEventListener('click', function() {
  api.runtime.sendMessage({ type: 'CANCEL_REMOVAL' }, load);
});
load();
