const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const contactForm = document.querySelector(".contact-form");
const themeToggle = document.querySelector(".theme-toggle");
const typedRole = document.querySelector("#typed-role");
const canvas = document.querySelector("#network-bg");
const ctx = canvas?.getContext("2d");
const portfolioLinks = window.portfolioLinks || {};

document.querySelectorAll(".js-github-link").forEach(link => {
    if (portfolioLinks.github) {
        link.href = portfolioLinks.github;
    }
});

document.querySelectorAll(".js-linkedin-link").forEach(link => {
    if (portfolioLinks.linkedin) {
        link.href = portfolioLinks.linkedin;
    }
});

if (year) {
    year.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle?.querySelector("i")?.classList.replace("fa-sun", "fa-moon");
}

themeToggle?.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");

    const icon = themeToggle.querySelector("i");
    if (icon) {
        icon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
});

window.addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", window.scrollY > 24);

    let currentId = "";
    document.querySelectorAll("main section[id]").forEach(section => {
        const sectionTop = section.offsetTop - 130;
        if (window.scrollY >= sectionTop) {
            currentId = section.id;
        }
    });

    sectionLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
});

menuToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", event => {
        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        navLinks?.classList.remove("open");
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealItems.forEach(item => observer.observe(item));

contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    alert("Thanks for reaching out. Please send the message directly to kaduritesh4@gmail.com.");
    contactForm.reset();
});

const roles = [
    "Web Developer",
    "Java Programmer",
    "Embedded Systems Enthusiast",
    "IoT Project Builder"
];

let roleIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeRole() {
    if (!typedRole) {
        return;
    }

    const current = roles[roleIndex];
    typedRole.textContent = current.slice(0, letterIndex);

    if (!deleting && letterIndex < current.length) {
        letterIndex += 1;
        setTimeout(typeRole, 85);
        return;
    }

    if (!deleting && letterIndex === current.length) {
        deleting = true;
        setTimeout(typeRole, 1200);
        return;
    }

    if (deleting && letterIndex > 0) {
        letterIndex -= 1;
        setTimeout(typeRole, 45);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 240);
}

typeRole();

const particles = [];
let canvasWidth = 0;
let canvasHeight = 0;

function particleColor(alpha) {
    return document.body.classList.contains("light-mode")
        ? `rgba(217, 119, 6, ${alpha})`
        : `rgba(255, 214, 10, ${alpha})`;
}

function resizeCanvas() {
    if (!canvas || !ctx) {
        return;
    }

    const ratio = window.devicePixelRatio || 1;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles.length = 0;
    const count = Math.min(95, Math.max(42, Math.floor(canvasWidth / 18)));

    for (let i = 0; i < count; i += 1) {
        particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.7 + 0.8
        });
    }
}

function drawParticles() {
    if (!ctx) {
        return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvasWidth) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > canvasHeight) {
            particle.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = particleColor(0.55);
        ctx.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
            const next = particles[nextIndex];
            const distance = Math.hypot(particle.x - next.x, particle.y - next.y);

            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(next.x, next.y);
                ctx.strokeStyle = particleColor((1 - distance / 150) * 0.22);
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", resizeCanvas);
