// ====== Navbar Scroll Effect ======
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ====== Update Footer Year ======
document.getElementById('year').textContent = new Date().getFullYear();

// ====== Scroll Animations (Intersection Observer) ======
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.slide-up').forEach(element => {
    observer.observe(element);
});


// ====== Confetti Effect ======
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];
let animationId;

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Vibrant Luminous Colors (Rose, Peach, Gold, White)
const colors = ['#ff4d6d', '#ff8fa3', '#ffb3c1', '#d4af37', '#ffffff'];

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.w = Math.random() * 4 + 2; // Smaller for glitter effect
        this.h = Math.random() * 4 + 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 5 - 2.5;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // Reset particle if it goes off screen
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.8;
        
        // Draw slightly rounded confetti
        ctx.beginPath();
        ctx.roundRect(-this.w/2, -this.h/2, this.w, this.h, 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize particles
function initConfetti() {
    const particleCount = window.innerWidth < 768 ? 50 : 100; // Less particles on mobile
    for (let i = 0; i < particleCount; i++) {
        confettiParticles.push(new ConfettiParticle());
    }
}

// Animation loop
function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    animationId = requestAnimationFrame(animateConfetti);
}

// Start glitter on load, runs continuously
initConfetti();
animateConfetti();

// Optional: add burst of glitter around click
document.addEventListener('click', (e) => {
    // Only add burst if it's not the music button
    if (!e.target.closest('#music-toggle')) {
        for (let i = 0; i < 30; i++) {
            let p = new ConfettiParticle();
            p.x = e.clientX;
            p.y = e.clientY;
            p.speedY = Math.random() * 6 - 8;
            p.speedX = Math.random() * 6 - 3;
            confettiParticles.push(p);
        }
    }
});

// ====== Background Music Logic ======
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
let isMusicPlaying = false;

// Set initial volume
bgMusic.volume = 0.3; // Mild volume

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
    } else {
        bgMusic.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
    }
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering document level click listener
    toggleMusic();
});

// Sync state with actual audio events
bgMusic.addEventListener('play', () => {
    isMusicPlaying = true;
    musicIcon.textContent = '🔊';
});

bgMusic.addEventListener('pause', () => {
    isMusicPlaying = false;
    musicIcon.textContent = '🔇';
});

// Autoplay workaround: Play music on first user interaction with the document
document.addEventListener('click', function initAudio() {
    if (!isMusicPlaying) {
        bgMusic.play().catch(err => console.log('Autoplay blocked:', err));
    }
    document.removeEventListener('click', initAudio);
}, { once: true });
