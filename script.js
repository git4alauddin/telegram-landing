const config = window.LANDING_CONFIG || {};
const configuredText = (value) => typeof value === 'string' ? value.trim() : '';

const channelName = configuredText(config.channelName);
const avatar = document.getElementById('join-avatar');
if (channelName) {
  document.getElementById('join-title').textContent = channelName;
  document.title = `${channelName} | Telegram channel`;
  avatar.textContent = channelName.charAt(0).toUpperCase();
}

const description = configuredText(config.description);
if (description) {
  document.getElementById('channel-description').textContent = description;
  document.querySelector('meta[name="description"]').content = description;
}

const activeUsers = configuredText(config.activeUsers);
if (activeUsers) {
  const count = document.getElementById('active-users');
  count.textContent = activeUsers;

  if (/^\d+\+?$/.test(activeUsers) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const readableCount = document.createElement('span');
    readableCount.className = 'visually-hidden';
    readableCount.textContent = activeUsers;

    const rollingCount = document.createElement('span');
    rollingCount.className = 'rolling-count';
    rollingCount.setAttribute('aria-hidden', 'true');

    for (const [index, character] of [...activeUsers].entries()) {
      if (character === '+') {
        const suffix = document.createElement('span');
        suffix.textContent = character;
        rollingCount.append(suffix);
        continue;
      }

      const digit = document.createElement('span');
      digit.className = 'rolling-digit';
      const track = document.createElement('span');
      track.className = 'rolling-digit-track';
      track.style.animationDelay = `${index * 90}ms`;

      for (let step = 0; step <= 10; step += 1) {
        const frame = document.createElement('span');
        frame.textContent = String((Number(character) + step) % 10);
        track.append(frame);
      }

      digit.append(track);
      rollingCount.append(digit);
    }

    count.replaceChildren(readableCount, rollingCount);
  }
}

const displayPicture = configuredText(config.displayPicture);
if (displayPicture) {
  const picture = new Image();
  picture.alt = '';
  picture.onload = () => avatar.replaceChildren(picture);
  picture.src = displayPicture;
}

const telegramLink = document.getElementById('telegram-link');
const telegramUrl = configuredText(config.telegramUrl);
if (telegramUrl) {
  telegramLink.href = telegramUrl;
}
const TELEGRAM_CHANNEL_URL = telegramLink.href;

const advertisingManager = configuredText(config.advertisingManager);
const advertisingEmail = configuredText(config.advertisingEmail);
if (advertisingManager && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(advertisingEmail)) {
  document.getElementById('advertising-manager').textContent = advertisingManager;
  document.getElementById('advertising-email').textContent = advertisingEmail;
  document.getElementById('advertising-contact').hidden = false;
}

telegramLink.addEventListener('click', (event) => {
  if (typeof window.fbq === 'function') {
    window.fbq('trackCustom', 'TelegramClick');
  }

  // Keep ordinary navigation open briefly so the browser can send the Pixel event.
  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    window.setTimeout(() => {
      window.location.assign(TELEGRAM_CHANNEL_URL);
    }, 180);
  }
});
