/* =========================================================
   RIJVAN GABRIEL — PORTFOLIO
   JavaScript vanilla — aucune librairie externe
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------
     1. NAVIGATION — fond au scroll
  --------------------------------------------------- */
  const nav = document.getElementById("nav");

  function handleNavBackground(){
    if (window.scrollY > 40) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  handleNavBackground();
  window.addEventListener("scroll", handleNavBackground, { passive: true });


  /* ---------------------------------------------------
     2. BARRE DE PROGRESSION DE SCROLL
  --------------------------------------------------- */
  const scrollProgress = document.getElementById("scrollProgress");

  function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  }
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });


  /* ---------------------------------------------------
     3. MENU MOBILE
  --------------------------------------------------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu(){
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  document.querySelectorAll("[data-nav-mobile]").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });


  /* ---------------------------------------------------
     4. NAVIGATION ACTIVE SELON LA SECTION VISIBLE
  --------------------------------------------------- */
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = "#" + entry.target.id;
      const link = document.querySelector(`[data-nav][href="${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));


  /* ---------------------------------------------------
     5. APPARITION PROGRESSIVE AU SCROLL (data-reveal)
  --------------------------------------------------- */
  const revealElements = document.querySelectorAll("[data-reveal]");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------
     6. RÉVÉLATION DES CARTES PROJETS (effet séquencé)
  --------------------------------------------------- */
  const projectCards = document.querySelectorAll(".project-card");

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("is-visible"), i * 80);
        projectObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  projectCards.forEach(card => projectObserver.observe(card));


  /* ---------------------------------------------------
     7. COMPTEURS ANIMÉS ("Quelques chiffres")
  --------------------------------------------------- */
  const statNumbers = document.querySelectorAll(".stat__number");

  function animateCount(el){
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1600;
    const startTime = performance.now();

    function tick(now){
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat__number").forEach(animateCount);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.getElementById("stats");
  if (statsSection) statsObserver.observe(statsSection);


  /* ---------------------------------------------------
     8. PARALLAXE LÉGÈRE — orbite du hero & motif contact
  --------------------------------------------------- */
  const heroOrbit = document.querySelector(".hero__orbit");
  const heroFrame = document.querySelector(".hero__frame");

  window.addEventListener("scroll", () => {
    if (!heroFrame) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroFrame.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
  }, { passive: true });


  /* ---------------------------------------------------
     9. BOUTON RETOUR VERS LE HAUT
  --------------------------------------------------- */
  const toTop = document.getElementById("toTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 600) {
      toTop.classList.add("is-visible");
    } else {
      toTop.classList.remove("is-visible");
    }
  }, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* ---------------------------------------------------
     10. ANNÉE COURANTE DANS LE FOOTER
  --------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ---------------------------------------------------
     11. LISSAGE DES ANCRES (compense la nav fixe)
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({ top: targetPosition, behavior: "smooth" });
      closeMobileMenu();
    });
  });

});
