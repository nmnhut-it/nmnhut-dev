import { CameraEngine } from './engine/camera-engine.js';
import { GestureDispatcher } from './engine/gesture-dispatcher.js';

const HOLD_MS = 650;
const CHOICES = [
  { key: 'scissors', count: 1, label: 'Kéo', beats: 'paper' },
  { key: 'rock', count: 2, label: 'Búa', beats: 'scissors' },
  { key: 'paper', count: 3, label: 'Bao', beats: 'rock' },
];
const byKey = Object.fromEntries(CHOICES.map(c => [c.key, c]));
const byCount = Object.fromEntries(CHOICES.map(c => [c.count, c]));

let active = null;

export function open(opts = {}) {
  if (active) active.close(false);
  return new Promise(resolve => {
    let done = false, live = true, locked = false;
    let held = 0, target = 0, last = 0;
    let cameraEngine = null, gestureDispatcher = null;
    const el = document.createElement('div');
    el.className = 'rpsgate';
    el.innerHTML = `
      <div class="rps-cam"><video playsinline muted></video><div class="rps-gauge"><i></i></div></div>
      <div class="rps-card" role="dialog" aria-modal="true">
        <div class="rps-kicker">CỔNG OẲN TÙ TÌ</div>
        <h2>${opts.title || 'Đảo bí mật'}</h2>
        <div class="rps-status">Giữ 1 / 2 / 3 ngón: Kéo / Búa / Bao</div>
        <div class="rps-arena">
          <div class="rps-side">
            <span>Bạn</span>
            <div class="rps-token player"><div class="rps-art blank"></div></div>
          </div>
          <div class="rps-vs">VS</div>
          <div class="rps-side">
            <span>Máy</span>
            <div class="rps-token cpu"><div class="rps-art blank"></div></div>
          </div>
        </div>
        <div class="rps-actions">
          ${CHOICES.map(c => `<button type="button" data-choice="${c.key}"><span class="rps-mini ${c.key}"></span>${c.count} · ${c.label}</button>`).join('')}
        </div>
        <button class="rps-back" type="button">TRỞ LẠI</button>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('on'));

    const status = el.querySelector('.rps-status');
    const gauge = el.querySelector('.rps-gauge i');
    const chip = el.querySelector('.rps-cam');
    const video = chip.querySelector('video');
    const playerArt = el.querySelector('.rps-token.player .rps-art');
    const cpuArt = el.querySelector('.rps-token.cpu .rps-art');

    const close = ok => {
      if (done) return;
      done = true; live = false;
      if (gestureDispatcher) gestureDispatcher.disarmActGate();
      if (cameraEngine) cameraEngine.release();
      el.classList.remove('on');
      setTimeout(() => el.remove(), 220);
      active = null;
      resolve(!!ok);
    };
    active = { close };

    function showChoice(host, key) {
      host.className = `rps-art ${key || 'blank'}`;
    }
    function resetRound(copy = 'Giữ 1 / 2 / 3 ngón: Kéo / Búa / Bao') {
      locked = false;
      held = 0;
      target = 0;
      last = performance.now();
      gauge.style.width = '0%';
      showChoice(playerArt, '');
      showChoice(cpuArt, '');
      status.textContent = copy;
    }
    function playRound(playerKey) {
      if (done || locked) return;
      locked = true;
      const player = byKey[playerKey];
      const cpu = CHOICES[Math.floor(Math.random() * CHOICES.length)];
      showChoice(playerArt, player.key);
      showChoice(cpuArt, cpu.key);
      gauge.style.width = '100%';
      const result = player.key === cpu.key ? 'tie' : (player.beats === cpu.key ? 'win' : 'lose');
      if (result === 'win') {
        status.textContent = `${player.label} thắng ${cpu.label}. Cổng mở!`;
        setTimeout(() => close(true), 650);
      } else {
        status.textContent = result === 'tie'
          ? `${player.label} hòa ${cpu.label}. Chơi lại nào.`
          : `${player.label} thua ${cpu.label}. Thử lại nhé.`;
        setTimeout(() => resetRound(), 900);
      }
    }

    el.querySelector('.rps-back').onclick = () => close(false);
    el.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => playRound(btn.dataset.choice));
    });

    try {
      gestureDispatcher = new GestureDispatcher({
        isRunning: () => false,
        frozenCheck: () => false,
        boothSummon: () => false,
        boothEmit: () => {},
        hud: () => {},
      });
      cameraEngine = new CameraEngine(video, {
        onFrame: res => gestureDispatcher.onHands(res),
        watchdogActive: () => live && gestureDispatcher.hasActiveConsumer(),
      });
      cameraEngine.ensure().then(() => {
        if (!live) return;
        video.srcObject = cameraEngine.stream;
        video.play().catch(() => {});
        chip.classList.add('on');
        last = performance.now();
        gestureDispatcher.armActGate((count, has) => {
          if (!live) { gestureDispatcher.disarmActGate(); return; }
          if (locked) { last = performance.now(); return; }
          const now = performance.now(), dt = Math.min(100, now - last); last = now;
          const next = has && byCount[count] ? count : 0;
          if (next && next === target) held += dt;
          else { target = next; held = 0; }
          gauge.style.width = target ? Math.min(1, held / HOLD_MS) * 100 + '%' : '0%';
          status.textContent = target ? `Đang giữ ${byCount[target].label}...` : 'Giữ 1 / 2 / 3 ngón: Kéo / Búa / Bao';
          if (target && held >= HOLD_MS) playRound(byCount[target].key);
        });
      }).catch(() => {
        resetRound('Camera chưa sẵn sàng. Dùng nút chọn cũng được.');
      });
    } catch (err) {
      console.warn('SideRpsGate: camera unavailable, tap choices remain active', err);
      resetRound('Camera chưa sẵn sàng. Dùng nút chọn cũng được.');
    }
  });
}

window.SideRpsGate = { open };
