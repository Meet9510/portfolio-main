// ─── CUSTOM INTERACTIVE CURSOR ───
const cursorDot = document.createElement('div');
cursorDot.className = 'custom-cursor-dot';
const cursorRing = document.createElement('div');
cursorRing.className = 'custom-cursor-ring';
const ambientGlow = document.createElement('div');
ambientGlow.className = 'cursor-glow';

document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);
document.body.appendChild(ambientGlow);

let mousePos = { x: 0, y: 0 };
let dotPos = { x: 0, y: 0 };
let ringPos = { x: 0, y: 0 };
let glowPos = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
});

function updateCursor() {
  // Instant tracking for dot
  dotPos.x = mousePos.x;
  dotPos.y = mousePos.y;
  
  // Spring LERP interpolation for Ring and Ambient background glow
  ringPos.x += (mousePos.x - ringPos.x) * 0.15;
  ringPos.y += (mousePos.y - ringPos.y) * 0.15;

  glowPos.x += (mousePos.x - glowPos.x) * 0.08;
  glowPos.y += (mousePos.y - glowPos.y) * 0.08;

  cursorDot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
  cursorRing.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
  ambientGlow.style.left = glowPos.x + 'px';
  ambientGlow.style.top = glowPos.y + 'px';

  requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor Hover Event Delegation
document.addEventListener('mouseover', e => {
  const target = e.target.closest('a, button, .bento-item, .social-btn, .hamburger, .bento-filter-btn, .social-icons a');
  if (target) {
    cursorDot.classList.add('hovered');
    cursorRing.classList.add('hovered');
  } else {
    cursorDot.classList.remove('hovered');
    cursorRing.classList.remove('hovered');
  }
});


// ─── AMBIENT AURA & MESH GRADIENT BACKGROUND ───
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

const blobs = [
  { x: W * 0.25, y: H * 0.25, vx: 0.2, vy: 0.15, baseR: 600, color: 'rgba(201, 149, 58, 0.12)' }, // Luxury Gold
  { x: W * 0.75, y: H * 0.65, vx: -0.15, vy: -0.2, baseR: 700, color: 'rgba(168, 85, 85, 0.08)' }, // Crimson/Rose Gold
  { x: W * 0.5, y: H * 0.35, vx: 0.1, vy: -0.12, baseR: 500, color: 'rgba(100, 70, 160, 0.06)' },  // Imperial Amethyst
  { x: W * 0.15, y: H * 0.8, vx: -0.12, vy: 0.18, baseR: 550, color: 'rgba(50, 140, 110, 0.06)' },  // Emerald Sage/Teal
  { x: W * 0.85, y: H * 0.2, vx: 0.15, vy: -0.15, baseR: 650, color: 'rgba(176, 131, 71, 0.09)' }  // Warm Bronze/Amber
];

let mouse = { x: null, y: null, targetX: null, targetY: null };
document.addEventListener('mousemove', e => {
  mouse.targetX = e.clientX;
  mouse.targetY = e.clientY;
});

let canvasMoving = true;
let tick = 0;

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);

  // Smooth mouse interpolation
  if (mouse.targetX !== null) {
    if (mouse.x === null) {
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    } else {
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
    }
  }

  if (canvasMoving) {
    tick += 0.5; // slow speed for fluid motion
  }

  // Draw and update ambient blobs (dynamic mesh gradient background)
  blobs.forEach((b, idx) => {
    if (canvasMoving) {
      b.x += b.vx;
      b.y += b.vy;
    }

    // Dynamic scale wave for breathing texture
    const currentR = b.baseR + Math.sin(tick * 0.005 + idx) * 80;

    // Bounce off limits
    if (b.x - currentR < -300 || b.x + currentR > W + 300) b.vx *= -1;
    if (b.y - currentR < -300 || b.y + currentR > H + 300) b.vy *= -1;

    // Draw glowing radial gradient
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, currentR);
    grad.addColorStop(0, b.color);
    grad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(b.x, b.y, currentR, 0, Math.PI * 2);
    ctx.fill();
  });

  // Interactive mouse glow trail (ambient spotlight effect)
  if (mouse.x !== null) {
    const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 400);
    mouseGrad.addColorStop(0, 'rgba(232, 192, 122, 0.05)');
    mouseGrad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.fillStyle = mouseGrad;
    ctx.arc(mouse.x, mouse.y, 400, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── MOBILE HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger-menu');
const menu = document.getElementById('menu');
if (hamburger && menu) {
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
  });
  
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
    });
  });
  
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
      hamburger.classList.remove('active');
      menu.classList.remove('active');
    }
  });
}

// ─── SMOOTH SPA NAV SCROLLING ───
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sectionId = link.getAttribute('href');
    const target = document.querySelector(sectionId);
    if (target) {
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    }
  });
});

// ─── SCROLL REVEAL OBSERVER ───
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ─── ACTIVE SECTION NAV LINK HIGHLIGHT ───
const sections = document.querySelectorAll('section[id], #home, #Portfolio, #contact');
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const activeId = entry.target.getAttribute('id');
      document.querySelectorAll('#menu.items a').forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === activeId);
      });
    }
  });
}, { threshold: 0.25, rootMargin: '-20% 0px -60% 0px' });
sections.forEach(sec => activeObserver.observe(sec));

// ─── BENTO FILTERING ───
const filterBtns = document.querySelectorAll('.bento-filter-btn');
const bentoItems = document.querySelectorAll('.bento-item');

if (filterBtns.length && bentoItems.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all, add to this
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      bentoItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.classList.remove('filtered-out');
          // Restart animation
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95) translateY(10px)';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = '';
            item.style.transition = 'all 0.5s ease-out';
          }, 30);
        } else {
          item.classList.add('filtered-out');
        }
      });
    });
  });
}

// ─── BENTO MOUSE GLOW & TILT ───
bentoItems.forEach(item => {
  item.addEventListener('mousemove', e => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set custom properties for spotlight shader
    item.style.setProperty('--mouse-x', `${x}px`);
    item.style.setProperty('--mouse-y', `${y}px`);

    // 3D Tilt
    const tiltX = (x / rect.width - 0.5) * 10; // range [-5, 5]
    const tiltY = (y / rect.height - 0.5) * -10; // range [-5, 5]
    item.style.transform = `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg) translateY(-4px)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
    item.style.transition = 'all 0.5s ease';
  });

  item.addEventListener('mouseenter', () => {
    item.style.transition = 'none';
  });
});

// ─── 3D TILT FOR STATIC CARDS ───
function applyTilt(elements, maxAngle = 10) {
  elements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * maxAngle}deg) rotateX(${-y * maxAngle}deg) translateY(-6px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'all 0.5s ease-out';
    });
    
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}
applyTilt(document.querySelectorAll('.adv-item'), 8);
applyTilt(document.querySelectorAll('.about-card'), 8);

// ─── BENTO LIGHTBOX DETAILS MODAL ───
const lightbox = document.getElementById('bento-lightbox');
if (lightbox) {
  const lightboxImg = document.getElementById('lightbox-main-img');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const backdrop = lightbox.querySelector('.lightbox-backdrop');

  bentoItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.getAttribute('data-img');
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');
      const tag = item.querySelector('.bento-tag').textContent;

      if (lightboxImg) lightboxImg.src = img;
      if (lightboxTag) lightboxTag.textContent = tag;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ─── FOUNDER CARD MOUSE PARALLAX ───
const founderCard = document.querySelector('.founder-card');
if (founderCard) {
  founderCard.addEventListener('mousemove', e => {
    const rect = founderCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    const photo = founderCard.querySelector('.founder-photo-wrap');
    const info = founderCard.querySelector('.founder-info');
    
    if (photo) photo.style.transform = `translate(${x * 20}px, ${y * 20}px) rotateY(${x * 10}deg)`;
    if (info) info.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
  });
  
  founderCard.addEventListener('mouseleave', () => {
    const photo = founderCard.querySelector('.founder-photo-wrap');
    const info = founderCard.querySelector('.founder-info');
    if (photo) {
      photo.style.transform = '';
      photo.style.transition = 'all 0.6s ease';
    }
    if (info) {
      info.style.transform = '';
      info.style.transition = 'all 0.6s ease';
    }
  });
}

// ─── GENERAL MOUSE SPOTLIGHT COORDINATES ───
const spotlightContainers = document.querySelectorAll('.stack-card, .stats-bar, .founder-section');
spotlightContainers.forEach(container => {
  container.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    container.style.setProperty('--mouse-x', `${x}px`);
    container.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ─── ADVANTAGES 3D CAROUSEL ───
const cards = document.querySelectorAll('.stack-card');
const dots = document.querySelectorAll('.nav-dot');
const prevArrow = document.querySelector('.prev-arrow');
const nextArrow = document.querySelector('.next-arrow');
let carouselIndex = 0;

function updateCarousel() {
  if (!cards.length) return;
  const totalCards = cards.length;
  
  cards.forEach((card, index) => {
    // Reset carousel positions
    card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
    
    // Circular relative distance calculation
    let diff = index - carouselIndex;
    if (diff < -2) diff += totalCards;
    if (diff > 3) diff -= totalCards;
    
    if (diff === 0) {
      card.classList.add('active');
    } else if (diff === -1) {
      card.classList.add('prev');
    } else if (diff === 1) {
      card.classList.add('next');
    } else if (diff === -2) {
      card.classList.add('far-prev');
    } else if (diff === 2) {
      card.classList.add('far-next');
    }
  });
  
  // Dots sync
  dots.forEach((dot, index) => {
    if (index === carouselIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// Prev/Next arrows
if (prevArrow && nextArrow) {
  prevArrow.addEventListener('click', () => {
    carouselIndex = (carouselIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  });
  
  nextArrow.addEventListener('click', () => {
    carouselIndex = (carouselIndex + 1) % cards.length;
    updateCarousel();
  });
}

// Dots navigation
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    carouselIndex = index;
    updateCarousel();
  });
});

// Card clicking rotation
cards.forEach((card, index) => {
  card.addEventListener('click', () => {
    if (card.classList.contains('prev') || card.classList.contains('far-prev') || card.classList.contains('next') || card.classList.contains('far-next')) {
      carouselIndex = index;
      updateCarousel();
    }
  });
});

// Initial load
if (cards.length > 0) {
  updateCarousel();
}

// ─── STATS COUNT-UP ANIMATION ───
const statsBarSection = document.querySelector('.stats-bar');
if (statsBarSection) {
  const statElements = statsBarSection.querySelectorAll('.stat-num');
  let animationDone = false;

  const statsAnimObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationDone) {
        animationDone = true;
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const duration = 1800; // Total duration in ms
          const stepTime = 16; // ~60fps
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = target + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.15 });
  statsAnimObserver.observe(statsBarSection);
}

// ─── MAGNETIC SOCIAL BUTTONS ───
const magneticSocials = document.querySelectorAll('.founder-socials .social-btn');
magneticSocials.forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ─── SCROLL-LINKED PROGRESSIVE TEXT REVEAL ───
const revealText = document.querySelector('.progressive-text-reveal');
if (revealText) {
  const text = revealText.textContent;
  revealText.innerHTML = '';
  
  // Split into words
  const words = text.split(' ');
  words.forEach(word => {
    const span = document.createElement('span');
    span.textContent = word + ' ';
    span.style.transition = 'color 0.4s ease, opacity 0.4s ease';
    span.style.opacity = '0.2';
    span.style.color = 'var(--muted)';
    revealText.appendChild(span);
  });
  
  const spans = revealText.querySelectorAll('span');
  
  const handleScrollReveal = () => {
    const rect = revealText.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress as element passes through viewport
    const startOffset = windowHeight * 0.9;
    const endOffset = windowHeight * 0.2;
    
    const progress = (startOffset - rect.top) / (startOffset - endOffset);
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    spans.forEach((span, i) => {
      const threshold = i / spans.length;
      if (clampedProgress > threshold) {
        span.style.opacity = '1';
        span.style.color = '#fff';
        if (i % 6 === 0) {
          span.style.color = 'var(--c1)'; // Highlight some words in studio gold
        }
      } else {
        span.style.opacity = '0.2';
        span.style.color = 'var(--muted)';
      }
    });
  };
  
  window.addEventListener('scroll', handleScrollReveal);
  handleScrollReveal();
}



