var api = typeof browser !== 'undefined' ? browser : chrome;
function todayKey() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
api.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    api.storage.local.set({
      installedAt: Date.now(),
      blockCount: 0,
      todayKey: todayKey(),
      todayCount: 0,
      worstDay: { date: todayKey(), count: 0 },
      removalRequestedAt: null,
      milestonesShown: []
    });
  }
});
function incrementBlock() {
  api.storage.local.get(null, function(s) {
    var tk = todayKey();
    var tc = (s.todayKey === tk) ? (s.todayCount || 0) + 1 : 1;
    var worst = s.worstDay || { date: tk, count: 0 };
    if (tc > worst.count) {
      worst = { date: tk, count: tc };
    }
    api.storage.local.set({
      blockCount: (s.blockCount || 0) + 1,
      todayKey: tk,
      todayCount: tc,
      worstDay: worst
    });
  });
}
if (api.webNavigation) {
  api.webNavigation.onCompleted.addListener(function(d) {
    if (d.frameId !== 0) return;
    if (d.url.startsWith(api.runtime.getURL('blocked.html'))) {
      incrementBlock();
    }
  });
}
api.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.type === 'GET_STATE') {
    api.storage.local.get(null, function(data) {
      var tk = todayKey();
      if (data.todayKey !== tk) {
        data.todayKey = tk;
        data.todayCount = 0;
        api.storage.local.set({ todayKey: tk, todayCount: 0 });
      }
      sendResponse(data);
    });
    return true;
  }
  if (msg.type === 'REQUEST_REMOVAL') {
    api.storage.local.set({ removalRequestedAt: Date.now() }, function() { sendResponse({ ok: true }); });
    return true;
  }
  if (msg.type === 'CANCEL_REMOVAL') {
    api.storage.local.set({ removalRequestedAt: null }, function() { sendResponse({ ok: true }); });
    return true;
  }
  if (msg.type === 'MILESTONE_SHOWN') {
    api.storage.local.get(['milestonesShown'], function(d) {
      var arr = d.milestonesShown || [];
      if (arr.indexOf(msg.milestone) === -1) arr.push(msg.milestone);
      api.storage.local.set({ milestonesShown: arr });
      sendResponse({ ok: true });
    });
    return true;
  }
});
