/**
 * ============================================================
 * OBJECT CHỨA TOÀN BỘ NỘI DUNG THIỆP 20/11
 * Bạn có thể dễ dàng sửa tên người nhận, người gửi hoặc dán lời chúc mới vào đây
 * mà không cần can thiệp vào mã nguồn bên dưới.
 * ============================================================
 */
const CONTENT = {
  // Tên người nhận (ví dụ: "Cô Lan", "Thầy Hùng", v.v.)
  recipient: "Cô Lan",

  // Tên người gửi (ví dụ: "Phương Anh", "Học trò của Cô", v.v.)
  sender: "Phương Anh",

  // Tiêu đề màn 1
  screen1Title: "Chúc mừng ngày Nhà giáo",
  screen1Subtitle: "Việt Nam 20/11",

  // Lời chúc / Bức thư màn 3 (Giữ nguyên văn từng chữ, giữ nguyên xuống dòng)
  letter: `Nhân ngày Nhà giáo Việt Nam 20/11, em xin gửi đến Cô lời tri ân sâu sắc và lòng biết ơn chân thành nhất.

Cảm ơn Cô vì những bài giảng tâm huyết, sự bao dung và kiên nhẫn dìu dắt chúng em trưởng thành qua từng ngày. Những bài học cùng niềm tin mà Cô trao gửi sẽ mãi là hành trang quý giá theo em trên suốt chặng đường đời.

Kính chúc Cô luôn dồi dào sức khỏe, ngập tràn niềm vui, bình an và mãi giữ vững ngọn lửa nhiệt huyết với sự nghiệp trồng người cao quý!`
};

/* Biến trạng thái toàn cục */
let currentScreen = 1;
let typewriterTimer = null;
let isAudioPlaying = false;
let audioAvailable = false;
let starAnimationId = null;

// Tham chiếu phần tử DOM
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const screen3 = document.getElementById('screen-3');
const screenLetter = document.getElementById('screen-letter');

const btnOpenCard = document.getElementById('btn-open-card');
const lotusButton = document.getElementById('lotus-button');
const btnOpenLetter = document.getElementById('btn-open-letter');
const btnBackToScreen2 = document.getElementById('btn-back-to-screen2');
const btnCloseLetter = document.getElementById('btn-close-letter');
const btnSkipTypewriter = document.getElementById('btn-skip-typewriter');

const audioToggle = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
const audioIconOn = document.querySelector('.audio-on');
const audioIconOff = document.querySelector('.audio-off');

const skyCanvas = document.getElementById('sky-canvas');
const letterScroll = document.getElementById('letter-scroll');
const letterText = document.getElementById('letter-text');
const letterTitle = document.getElementById('letter-title');
const letterSignature = document.getElementById('letter-signature');
const screen1Recipient = document.getElementById('screen1-recipient');

/* ============================================================
   1. KHỞI TẠO NỘI DUNG VÀ MÀN 1
   ============================================================ */
function initContent() {
  if (screen1Recipient) {
    screen1Recipient.textContent = CONTENT.recipient;
  }
  if (letterTitle) {
    letterTitle.textContent = `Gửi ${CONTENT.recipient} – nhân ngày 20/11 🎉💙`;
  }
  if (letterSignature) {
    letterSignature.textContent = CONTENT.sender;
  }
}

/**
 * Tạo tối đa 14 bong bóng và trái tim xanh bay lên từ đáy màn 1
 */
function createFloatingElements() {
  const container = document.getElementById('floating-elements');
  if (!container) return;

  const totalItems = 14;
  const heartSvg = `
    <svg viewBox="0 0 24 24" width="100%" height="100%">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>`;

  for (let i = 0; i < totalItems; i++) {
    const el = document.createElement('div');
    const isHeart = i % 2 === 0;
    const size = Math.floor(Math.random() * 20) + 16; // 16px - 36px
    const left = Math.random() * 92 + 4; // 4% - 96%
    const duration = Math.random() * 5 + 6; // 6s - 11s
    const delay = Math.random() * 7; // 0s - 7s

    el.className = `floating-item ${isHeart ? 'floating-heart' : 'floating-bubble'}`;
    el.style.left = `${left}%`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    if (isHeart) {
      el.innerHTML = heartSvg;
    }

    container.appendChild(el);
  }
}

/* ============================================================
   2. HỆ THỐNG CHUYỂN MÀN HÌNH (Transition fade 0.8s)
   ============================================================ */
function goToScreen(screenNumber, instant = false) {
  // Ẩn tất cả màn
  [screen1, screen2, screen3].forEach((s) => {
    if (instant) {
      s.style.transition = 'none';
    } else {
      s.style.transition = '';
    }
    s.classList.remove('screen-active');
  });

  currentScreen = screenNumber;
  closeLetterModal();

  const target = screenNumber === 1 ? screen1 : screenNumber === 2 ? screen2 : screen3;
  target.classList.add('screen-active');

  if (instant) {
    // Khôi phục lại transition sau khi render tức thì
    setTimeout(() => {
      [screen1, screen2, screen3].forEach((s) => {
        s.style.transition = '';
      });
    }, 60);
  }

  if (screenNumber === 1) {
    stopStarfield();
  } else if (screenNumber === 2) {
    // Đảm bảo hoa sen trở lại trạng thái ban đầu
    lotusButton.classList.remove('blooming');
    startStarfield();
  } else if (screenNumber === 3) {
    // Màn 3 Mới: Màn QR trên nền đêm sao lấp lánh
    startStarfield();
  }
}

/* ============================================================
   3. BẦU TRỜI ĐÊM: CANVAS SAO VÀ SAO BĂNG (MÀN 2 & MÀN 3)
   ============================================================ */
let stars = [];
let shootingStars = [];
let canvasWidth = 0;
let canvasHeight = 0;
let ctx = null;

function initStarfield() {
  if (!skyCanvas) return;
  ctx = skyCanvas.getContext('2d');
  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  if (!skyCanvas) return;
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  skyCanvas.width = canvasWidth;
  skyCanvas.height = canvasHeight;
  generateStars();
}

function generateStars() {
  stars = [];
  const starCount = Math.floor(Math.random() * 40) + 80; // 80 - 120 sao

  const colors = [
    '#ffffff', // Trắng
    '#7fd8ff', // --cyan-glow
    '#cfe5ff', // --blue-100
    '#fff3b0'  // Vàng nhạt
  ];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * (canvasHeight * 0.75), // Tập trung ở 3/4 trên bầu trời
      radius: Math.random() * 1.5 + 0.6,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}

function addShootingStar() {
  if (currentScreen !== 2 && currentScreen !== 3) return;
  // Bắt đầu từ góc trên bất kỳ
  const startX = Math.random() * (canvasWidth * 0.8) + (canvasWidth * 0.1);
  const startY = Math.random() * (canvasHeight * 0.3);
  const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // ~45 độ
  const speed = Math.random() * 6 + 7;

  shootingStars.push({
    x: startX,
    y: startY,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    length: Math.random() * 60 + 50,
    alpha: 1,
    life: 0,
    maxLife: 45
  });
}

function drawStarfield() {
  if (!ctx || (currentScreen !== 2 && currentScreen !== 3)) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 1. Vẽ các sao tĩnh nhấp nháy
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.2) {
      s.speed = -s.speed;
    }

    ctx.save();
    ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
    ctx.fillStyle = s.color;
    ctx.shadowBlur = 4;
    ctx.shadowColor = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Vẽ sao băng
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const st = shootingStars[i];
    st.x += st.dx;
    st.y += st.dy;
    st.life++;
    st.alpha = Math.max(0, 1 - (st.life / st.maxLife));

    ctx.save();
    ctx.globalAlpha = st.alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#7fd8ff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(st.x, st.y);
    ctx.lineTo(st.x - st.dx * 3.5, st.y - st.dy * 3.5);
    ctx.stroke();
    ctx.restore();

    if (st.life >= st.maxLife) {
      shootingStars.splice(i, 1);
    }
  }

  // Xác suất ngẫu nhiên xuất hiện sao băng mới (khoảng 3-6s một lần)
  if (Math.random() < 0.008 && shootingStars.length < 2) {
    addShootingStar();
  }

  starAnimationId = requestAnimationFrame(drawStarfield);
}

function startStarfield() {
  // Kiểm tra prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (ctx) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      generateStars();
      for (const s of stars) {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return;
  }

  if (!starAnimationId) {
    starAnimationId = requestAnimationFrame(drawStarfield);
  }
}

function stopStarfield() {
  if (starAnimationId) {
    cancelAnimationFrame(starAnimationId);
    starAnimationId = null;
  }
}

/* ============================================================
   4. HIỆU ỨNG GÕ CHỮ CHO BỨC THƯ & ĐIỀU KHIỂN MODAL BỨC THƯ
   ============================================================ */
function revealFooter() {
  const letterFooter = document.querySelector('.letter-footer');
  if (letterFooter) letterFooter.classList.add('revealed');
}

function hideFooter() {
  const letterFooter = document.querySelector('.letter-footer');
  if (letterFooter) letterFooter.classList.remove('revealed');
}

function openLetterModal() {
  if (!screenLetter) return;
  screenLetter.classList.add('modal-active');
  screenLetter.setAttribute('aria-hidden', 'false');
  startTypewriter();
}

function closeLetterModal() {
  if (!screenLetter) return;
  screenLetter.classList.remove('modal-active');
  screenLetter.setAttribute('aria-hidden', 'true');
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
}

function startTypewriter() {
  // Reset trạng thái
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }

  hideFooter();

  const rawText = CONTENT.letter;
  if (!letterText) return;
  letterText.innerHTML = '';
  if (letterScroll) letterScroll.scrollTop = 0;

  let currentIndex = 0;
  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typewriter-cursor';
  letterText.appendChild(cursorSpan);

  // Nếu người dùng bật reduced motion thì hiện toàn bộ ngay lập tức
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    skipTypewriter();
    return;
  }

  typewriterTimer = setInterval(() => {
    if (currentIndex < rawText.length) {
      const char = rawText[currentIndex];
      // Chèn ký tự trước con trỏ
      cursorSpan.insertAdjacentText('beforebegin', char);
      currentIndex++;

      // Tự động cuộn xuống khi nội dung dài ra
      if (letterScroll) {
        letterScroll.scrollTop = letterScroll.scrollHeight;
      }
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;

      // Hiện chữ ký với fade-in 0.6s
      revealFooter();

      // Giữ con trỏ nhấp nháy thêm 2 giây rồi xóa nhẹ
      setTimeout(() => {
        if (cursorSpan && cursorSpan.parentNode) {
          cursorSpan.remove();
        }
      }, 2000);
    }
  }, 35);
}

function skipTypewriter() {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
  if (letterText) {
    letterText.textContent = CONTENT.letter;
    const existingCursor = letterText.querySelector('.typewriter-cursor');
    if (existingCursor) existingCursor.remove();
  }
  if (letterScroll) letterScroll.scrollTop = 0;
  revealFooter();
}

/* ============================================================
   5. BỘ ĐIỀU KHIỂN NHẠC NỀN (Tự động kiểm tra file assets/music.mp3)
   ============================================================ */
function checkAndInitAudio() {
  if (!bgMusic) return;

  // Kiểm tra file assets/music.mp3 xem có tồn tại không mà không in lỗi ra console
  fetch('assets/music.mp3', { method: 'HEAD' })
    .then((res) => {
      if (res.ok) {
        audioAvailable = true;
        if (audioToggle) {
          audioToggle.style.display = 'flex';
        }
      }
    })
    .catch(() => {
      // Không có file nhạc thì giữ nút ẩn, không báo lỗi
      audioAvailable = false;
    });
}

function startMusicOnUserGesture() {
  if (audioAvailable && !isAudioPlaying && bgMusic) {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
      updateAudioIcon();
    }).catch(() => {
      // Trình duyệt chặn autoplay thì im lặng bỏ qua
    });
  }
}

function toggleAudio() {
  if (!audioAvailable || !bgMusic) return;

  if (isAudioPlaying) {
    bgMusic.pause();
    isAudioPlaying = false;
  } else {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
    }).catch(() => {});
  }
  updateAudioIcon();
}

function updateAudioIcon() {
  if (isAudioPlaying) {
    audioIconOn.style.display = 'block';
    audioIconOff.style.display = 'none';
  } else {
    audioIconOn.style.display = 'none';
    audioIconOff.style.display = 'block';
  }
}

/* ============================================================
   6. GẮN SỰ KIỆN TƯƠNG TÁC
   ============================================================ */
function attachEvents() {
  // Lần chạm đầu tiên bất kỳ để unlock autoplay nhạc
  document.addEventListener('pointerdown', startMusicOnUserGesture, { once: true });

  // Nút mở thiệp (Màn 1 -> Màn 2)
  if (btnOpenCard) {
    btnOpenCard.addEventListener('click', () => {
      startMusicOnUserGesture();
      goToScreen(2);
    });
  }

  // Chạm vào bông sen (Màn 2 -> Màn 3)
  if (lotusButton) {
    const handleLotusClick = () => {
      startMusicOnUserGesture();
      lotusButton.classList.add('blooming');
      setTimeout(() => {
        goToScreen(3);
      }, 550);
    };

    lotusButton.addEventListener('click', handleLotusClick);
    lotusButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLotusClick();
      }
    });
  }

  // Nút mở thư từ màn QR
  if (btnOpenLetter) {
    btnOpenLetter.addEventListener('click', openLetterModal);
  }

  // Nút quay lại Màn 2 từ màn QR
  if (btnBackToScreen2) {
    btnBackToScreen2.addEventListener('click', () => {
      goToScreen(2);
    });
  }

  // Nút đóng thư "×" (quay về Màn QR)
  if (btnCloseLetter) {
    btnCloseLetter.addEventListener('click', closeLetterModal);
  }

  // Bấm ra ngoài backdrop thư để đóng thư
  if (screenLetter) {
    screenLetter.addEventListener('click', (e) => {
      if (e.target === screenLetter || e.target.classList.contains('letter-modal-backdrop')) {
        closeLetterModal();
      }
    });
  }

  // Phím Escape để đóng thư
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && screenLetter && screenLetter.classList.contains('modal-active')) {
      closeLetterModal();
    }
  });

  // Nút bỏ qua gõ chữ
  if (btnSkipTypewriter) {
    btnSkipTypewriter.addEventListener('click', skipTypewriter);
  }

  // Nút bật/tắt nhạc
  if (audioToggle) {
    audioToggle.addEventListener('click', toggleAudio);
  }

  // Hỗ trợ chuyển màn hình qua query param hoặc hash (?screen=2 hoặc #2)
  window.addEventListener('hashchange', checkInitialNavigation);
}

function checkInitialNavigation() {
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen');
  const hash = window.location.hash;

  if (screenParam === '2' || hash === '#2' || hash === '#screen-2') {
    goToScreen(2, true);
  } else if (screenParam === '3' || hash === '#3' || hash === '#screen-3' || hash === '#qr') {
    goToScreen(3, true);
  } else if (screenParam === 'letter' || hash === '#letter') {
    goToScreen(3, true);
    openLetterModal();
    if (params.get('skip') === '1') {
      skipTypewriter();
    }
  } else if (screenParam === '1' || hash === '#1' || hash === '#screen-1') {
    goToScreen(1, true);
  }
}

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  initContent();
  createFloatingElements();
  initStarfield();
  checkAndInitAudio();
  attachEvents();
  checkInitialNavigation();
});
