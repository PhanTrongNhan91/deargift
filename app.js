// --- Cấu hình ngày kỷ niệm và thông điệp tình yêu ---
const ANNIVERSARY_DATE = new Date('2025-06-30T00:00:00+07:00'); // Múi giờ Việt Nam (UTC+7)
const CORRECT_PASSWORD = "300625"; // Mật khẩu người dùng yêu cầu



// --- 1. Xác thực Mật Khẩu (Màn hình khóa Cửa Trái Tim) ---
const lockScreen = document.getElementById('lockScreen');
const heartGate = document.getElementById('heartGate');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const diaryBook = document.querySelector('.diary-book');

let hasUnlocked = false;

function checkPassword() {
    const inputVal = passwordInput.value.trim();

    if (inputVal === CORRECT_PASSWORD) {
        // Nhập đúng mật khẩu! Kích hoạt hiệu ứng mở cửa
        hasUnlocked = true;
        lockScreen.classList.add('unlocked');
        errorMsg.textContent = "";

        // Phát nhạc ngay khi mở khóa thành công (tương tác trực tiếp của người dùng)
        startMusicOnUnlock();

        // Đợi hiệu ứng 3D mở cửa trái tim và fade-out của màn hình khóa hoàn tất (khoảng 1.8 giây)
        setTimeout(() => {
            // Cho phép cuộn sổ nhật ký
            diaryBook.style.overflowY = 'scroll';
            // Tự động kích hoạt hiệu ứng chạy chữ ở trang 2 nếu người dùng cuộn đến
            observeLetterPage();
            
            // Hiển thị nút chia sẻ nổi (Share FAB)
            const shareFab = document.getElementById('shareFab');
            if (shareFab) {
                shareFab.classList.add('active');
            }
        }, 1800);

    } else {
        // Nhập sai mật khẩu! Rung lắc trái tim và báo lỗi
        heartGate.classList.add('shake');
        errorMsg.textContent = "Mã khóa chưa đúng rồi Trang ơi... 😢";
        passwordInput.value = "";
        passwordInput.focus();

        // Gỡ class shake sau khi diễn ra xong hoạt ảnh (500ms) để có thể rung tiếp lần sau
        setTimeout(() => {
            heartGate.classList.remove('shake');
        }, 500);
    }
}

// Bấm nút hoặc nhấn Enter để xác thực
unlockBtn.addEventListener('click', checkPassword);
passwordInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Tự động focus ô nhập mật khẩu khi tải trang
window.addEventListener('DOMContentLoaded', () => {
    passwordInput.focus();
});


// --- 2. Bộ đếm thời gian yêu nhau (Cập nhật vào con dấu) ---
function updateLoveCounter() {
    const now = new Date();
    let totalMs = now - ANNIVERSARY_DATE;

    if (totalMs < 0) {
        document.getElementById('stampDaysCount').textContent = "0";
        return;
    }

    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    document.getElementById('stampDaysCount').textContent = totalDays;
}

// Cập nhật bộ đếm
setInterval(updateLoveCounter, 1000 * 60);
updateLoveCounter();


// --- 3. Hiệu ứng cánh hoa đào rơi lãng mạn (Canvas) ---
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');

let petals = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Petal {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.0 + 0.6;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * Math.PI;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
        this.windAngle = Math.random() * 10;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.fillStyle = `rgba(255, 183, 197, ${this.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 1.7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 143, 163, ${this.opacity * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size / 2, 0);
        ctx.stroke();

        ctx.restore();
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.windAngle) * 0.3;
        this.rotation += this.rotationSpeed;
        this.windAngle += 0.01;

        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reset();
        }
    }
}

const totalPetals = 30;
for (let i = 0; i < totalPetals; i++) {
    petals.push(new Petal());
}

function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });
    requestAnimationFrame(animatePetals);
}
animatePetals();


// --- 4. Trình phát nhạc nền vintage ---
const bgMusic = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const musicPlayer = document.getElementById('musicPlayer');
const musicIcon = playPauseBtn.querySelector('i');

let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.className = 'fas fa-play';
        playPauseBtn.classList.remove('playing');
        musicPlayer.querySelector('.song-status').textContent = 'Đã dừng phát nhạc.';
    } else {
        bgMusic.play().then(() => {
            musicIcon.className = 'fas fa-pause';
            playPauseBtn.classList.add('playing');
            musicPlayer.querySelector('.song-status').textContent = 'Đang phát nhạc nền...';
        }).catch(err => {
            console.log("Không thể tự động phát nhạc do chính sách bảo mật trình duyệt.");
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

// Bắt đầu phát nhạc ngay khi người dùng nhấn mở khóa thành công
function startMusicOnUnlock() {
    if (!isMusicPlaying) {
        toggleMusic();
    }
}

playPauseBtn.addEventListener('click', toggleMusic);


// --- 5. Hiệu ứng gõ chữ tự động khi lật đến trang thư ---
const typewrittenDiv = document.getElementById('typewrittenText');
const fullLetterText = typewrittenDiv.innerHTML.trim();
typewrittenDiv.innerHTML = '';
let typingInterval = null;
let hasTyped = false;
let hasFinishedTyping = false;

// Tách các ký tự và thẻ HTML một lần duy nhất khi tải trang
const characters = [];
let i = 0;
while (i < fullLetterText.length) {
    if (fullLetterText[i] === '<') {
        let tag = '';
        while (i < fullLetterText.length && fullLetterText[i] !== '>') {
            tag += fullLetterText[i];
            i++;
        }
        tag += '>';
        i++;
        characters.push(tag);
    } else {
        characters.push(fullLetterText[i]);
        i++;
    }
}

function startTypewriter() {
    if (hasTyped) {
        typewrittenDiv.innerHTML = fullLetterText;
        hasFinishedTyping = true;
        return;
    }
    hasTyped = true;

    let index = 0;
    let lastTime = null;
    const charsPerSecond = 85; // Tốc độ gõ chữ mượt mà (~7-8 giây)
    let fraction = 0;

    function typeStep(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        lastTime = timestamp;

        fraction += (delta / 1000) * charsPerSecond;
        const charsToAdd = Math.floor(fraction);
        fraction -= charsToAdd;

        if (charsToAdd > 0) {
            let newContent = '';
            const endLimit = Math.min(index + charsToAdd, characters.length);
            for (let k = index; k < endLimit; k++) {
                newContent += characters[k];
            }
            index = endLimit;
            typewrittenDiv.innerHTML += newContent;
            
            // Cuộn container cha (.letter-lines) thay vì div chứa chữ
            if (typewrittenDiv.parentElement) {
                typewrittenDiv.parentElement.scrollTop = typewrittenDiv.parentElement.scrollHeight;
            }
        }

        if (index < characters.length) {
            typingInterval = requestAnimationFrame(typeStep);
        } else {
            hasFinishedTyping = true;
            typingInterval = null;
        }
    }

    typingInterval = requestAnimationFrame(typeStep);
}

function skipTypewriter() {
    if (typingInterval) {
        cancelAnimationFrame(typingInterval);
        typingInterval = null;
    }
    typewrittenDiv.innerHTML = fullLetterText;
    if (typewrittenDiv.parentElement) {
        typewrittenDiv.parentElement.scrollTop = typewrittenDiv.parentElement.scrollHeight;
    }
    hasFinishedTyping = true;
}

function stopTypewriter() {
    if (typingInterval) {
        cancelAnimationFrame(typingInterval);
        typingInterval = null;
    }
    typewrittenDiv.innerHTML = '';
    hasFinishedTyping = false;
    hasTyped = false;
}

// Bắt đầu lắng nghe sự kiện click để hiện chữ nhanh (Click to Skip)
const letterBox = document.querySelector('.handwritten-letter-box');
if (letterBox) {
    letterBox.style.cursor = 'pointer';
    letterBox.addEventListener('click', () => {
        if (!hasFinishedTyping) {
            skipTypewriter();
        }
    });
}

// Hàm khởi tạo observer trang thư tình (chỉ gọi sau khi đã mở khóa)
function observeLetterPage() {
    const pageLetter = document.getElementById('page-letter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(startTypewriter, 800);
            }
        });
    }, {
        threshold: 0.5
    });
    observer.observe(pageLetter);
}





// --- 7. Hiệu ứng xuất hiện khi cuộn trang (Scroll Reveal cho Timeline) ---
const timelineItems = document.querySelectorAll('.timeline-item');
const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

timelineItems.forEach(item => {
    revealOnScroll.observe(item);
});


// --- 8. Logic điều khiển Lightbox (Phóng to ảnh) ---
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const polaroids = document.querySelectorAll('.polaroid-photo');

function openLightbox(polaroid) {
    const img = polaroid.querySelector('img');
    
    // Nếu ảnh chưa được tải lên hoặc bị lỗi hiển thị (display: none), không mở Lightbox
    if (img && img.style.display === 'none') {
        return;
    }

    if (img) {
        const src = img.getAttribute('src');
        // Ưu tiên lấy chú thích từ data-caption, nếu không có sẽ lấy từ phần tử .polaroid-caption
        let caption = polaroid.getAttribute('data-caption');
        if (!caption) {
            const captionEl = polaroid.querySelector('.polaroid-caption');
            caption = captionEl ? captionEl.innerText : '';
        }

        lightboxImg.setAttribute('src', src);
        lightboxCaption.innerText = caption;
        
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
    }
}

function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    // Xóa src ảnh sau khi hiệu ứng đóng hoàn tất để tránh nhấp nháy ảnh cũ khi mở ảnh mới
    setTimeout(() => {
        lightboxImg.setAttribute('src', '');
        lightboxCaption.innerText = '';
    }, 400);
}

// Đăng ký sự kiện click cho tất cả các tấm ảnh Polaroid
polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', (e) => {
        // Tránh kích hoạt nếu click trúng vào đường link hoặc nút đặc biệt khác nếu có
        openLightbox(polaroid);
    });
});

// Đóng khi click vào nút Close (X)
lightboxCloseBtn.addEventListener('click', closeLightbox);

// Đóng khi click ra ngoài vùng ảnh (vùng nền đen)
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// Đóng khi nhấn phím Escape (ESC) trên bàn phím
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
    }
});


// --- 9. Logic điều khiển Modal Chia Sẻ & Sinh Mã QR ---
const shareFabBtn = document.getElementById('shareFabBtn');
const shareModal = document.getElementById('shareModal');
const shareCloseBtn = document.getElementById('shareCloseBtn');
const shareLinkInput = document.getElementById('shareLinkInput');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyToast = document.getElementById('copyToast');
const qrImage = document.getElementById('qrImage');
const qrPlaceholder = document.getElementById('qrPlaceholder');

function generateQRCode(url) {
    // Ẩn hình ảnh QR cũ và hiện biểu tượng đang tải
    qrImage.style.display = 'none';
    qrPlaceholder.style.display = 'flex';
    qrPlaceholder.querySelector('p').innerText = 'Đang tạo mã QR...';
    qrPlaceholder.querySelector('i').className = 'fa-solid fa-qrcode animate-pulse';

    // Tạo URL API sinh mã QR với màu sắc phối hợp giao diện (Màu nâu gỗ ấm #865439 trên nền giấy ngà #fdfbf7)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=865439&bgcolor=fdfbf7&data=${encodeURIComponent(url)}`;
    
    // Gán đường dẫn tải mã
    qrImage.setAttribute('src', qrApiUrl);
    
    // Khi mã QR đã tải xong thành công
    qrImage.onload = () => {
        qrPlaceholder.style.display = 'none';
        qrImage.style.display = 'block';
    };
    
    // Nếu gặp lỗi khi tải API
    qrImage.onerror = () => {
        qrPlaceholder.querySelector('p').innerText = 'Không thể tải mã QR. Vui lòng kiểm tra kết nối mạng!';
        qrPlaceholder.querySelector('i').className = 'fa-solid fa-triangle-exclamation';
    };
}

function openShareModal() {
    // Lấy URL hiện tại của trình duyệt (hỗ trợ cả chạy cục bộ lẫn khi đã host online)
    let currentUrl = window.location.href;
    
    // Nếu chạy dưới giao diện file cục bộ (file:///), tạo mã hướng dẫn truy cập
    if (currentUrl.startsWith('file:///')) {
        currentUrl = 'http://localhost:3000'; // Fallback link mô phỏng chạy local
    }
    
    shareLinkInput.value = currentUrl;
    
    // Mở modal
    shareModal.classList.add('active');
    shareModal.setAttribute('aria-hidden', 'false');
    
    // Sinh mã QR
    generateQRCode(currentUrl);
}

function closeShareModal() {
    shareModal.classList.remove('active');
    shareModal.setAttribute('aria-hidden', 'true');
}

// Click nút share nổi để mở modal
if (shareFabBtn) {
    shareFabBtn.addEventListener('click', openShareModal);
}

// Click nút đóng (X) trong modal
if (shareCloseBtn) {
    shareCloseBtn.addEventListener('click', closeShareModal);
}

// Click ra ngoài thẻ share card để đóng modal
shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        closeShareModal();
    }
});

// Nhấn ESC để đóng modal share
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && shareModal.classList.contains('active')) {
        closeShareModal();
    }
});

// Logic sao chép liên kết kèm hiệu ứng phản hồi
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // Cho các thiết bị di động
        
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            // Hiện toast thông báo sao chép thành công
            copyToast.innerText = 'Đã sao chép liên kết thành công! ❤️';
            copyToast.classList.add('show');
            
            // Thay đổi nút sao chép tạm thời
            const copyIcon = copyLinkBtn.querySelector('i');
            const copyText = copyLinkBtn.querySelector('span');
            copyIcon.className = 'fa-solid fa-check';
            copyText.innerText = 'Đã chép';
            
            // Khôi phục nút sau 2 giây
            setTimeout(() => {
                copyToast.classList.remove('show');
                copyIcon.className = 'fa-solid fa-copy';
                copyText.innerText = 'Sao chép';
            }, 2000);
        }).catch(err => {
            // Nếu trình duyệt cũ hoặc không hỗ trợ Clipboard API
            copyToast.innerText = 'Không thể tự sao chép. Hãy chép tay từ ô nhập nhé!';
            copyToast.classList.add('show');
            setTimeout(() => {
                copyToast.classList.remove('show');
            }, 3000);
        });
    });
}
