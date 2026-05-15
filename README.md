# DiDeTOX

A browser extension that blocks social media and makes you feel bad about trying to access it.

You install it, it blocks everything, and you can't remove it for 7 days. That's the whole pitch.

## What it does

Blocks 35 social media sites across all regions: Facebook, Instagram, X/Twitter, TikTok, YouTube, Reddit, VK, Discord, Twitch, LinkedIn, Telegram, WhatsApp, Threads, Bluesky, Mastodon, Pinterest, Snapchat, Tumblr, Weibo, Xiaohongshu, Bilibili, Douyin, Line, Quora, OK.ru, BeReal, Truth Social, Messenger, Lemon8, Kuaishou, Likee, Triller.

When you try to visit any of them, you get roasted.

## Features

**Rage-o-meter.** The extension tracks how many times you've tried today. The more you try, the meaner it gets. 5 levels, from "oh hey" to "SEEK HELP".

**Night owl mode.** Try to access social media between 2am and 5am and you get a special set of brutal messages. You deserve it.

**Screen glitch.** Every time you land on the blocked page it does a little ACCESS DENIED shake, like you just got caught.

**Snake game.** Because you need something to do with your hands. Hidden behind a button on the blocked page.

**Confetti.** When you hit a milestone (24h, 3d, 1w, 2w, 1mo, 3mo) you get a confetti explosion. You earned it.

**Hall of shame.** Tracks your worst day (most attempts) and reminds you of it every single time.

**"Instead, you could:"** Random suggestions like "text your mom, she misses you more than your followers do" or "do 10 push-ups. or 5. or 1. one is fine."

**7-day removal cooldown.** You can request removal, but you have to wait 7 days. You can cancel the request anytime (and the extension will judge you for it).

## How to install

**Chrome / Edge / Brave / Opera:**

1. Download and unzip
2. Go to `chrome://extensions`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the folder

**Firefox:**

1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file

Firefox temporary add-ons don't persist after restart. For permanent install you'd need to sign it through Mozilla.

## How it works

Uses Manifest V3 `declarativeNetRequest` to redirect blocked domains to `blocked.html`. All state (install date, block count, daily attempts, worst day, milestones, removal cooldown) lives in `chrome.storage.local`.

Cross-browser compatible. Uses `browser`/`chrome` API detection so it runs on both Chromium-based browsers and Firefox without changes.

## File structure

```
manifest.json     main config
rules.json        list of blocked domains
background.js     service worker, tracks state
blocked.html/css/js  the page you see when blocked
popup.html/js     extension popup with stats
icons/            extension icons
```

## License

Do whatever you want with it. If it helps you stop doomscrolling, that's payment enough.
