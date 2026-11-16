(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header state + scroll progress ---------- */
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".progress");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    progress.style.setProperty("--p", (Math.round(p * 40) / 40).toFixed(3)); // stepped, pixel-like
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only").textContent = open ? "Fechar menu" : "Abrir menu";
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });

  /* ---------- Observers: active nav, reveal, timeline ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const links = [...nav.querySelectorAll("a")];
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => reveal.observe(el));

    const tl = [...document.querySelectorAll(".tl-item")];
    const reading = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) tl.forEach((li) => li.classList.toggle("is-reading", li === en.target));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    tl.forEach((li) => reading.observe(li));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Hero: text typed in like a streamed response ---------- */
  const lead = document.querySelector("[data-type]");
  if (lead && !reduceMotion) {
    const full = lead.textContent.trim();
    lead.setAttribute("aria-label", full);
    const out = document.createElement("span");
    out.setAttribute("aria-hidden", "true");
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");
    lead.textContent = "";
    lead.append(out, caret);
    let i = 0;
    const tick = () => {
      // advance word by word with small jitter, like tokens arriving
      const next = full.indexOf(" ", i + 1);
      i = next === -1 ? full.length : next;
      out.textContent = full.slice(0, i);
      if (i < full.length) setTimeout(tick, 45 + Math.random() * 70);
    };
    setTimeout(tick, 500);
  }

  /* ---------- Profile photo rendered as pixel art ---------- */
  const photo = document.querySelector(".pf-photo img");
  if (photo) {
    const pixelate = () => {
      try {
        const size = 88;
        const c = document.createElement("canvas");
        c.width = size; c.height = size;
        const ctx = c.getContext("2d");
        const s = Math.min(photo.naturalWidth, photo.naturalHeight);
        ctx.drawImage(photo, (photo.naturalWidth - s) / 2, 0, s, s, 0, 0, size, size);
        const d = ctx.getImageData(0, 0, size, size);
        const a = d.data;
        for (let k = 0; k < a.length; k += 4) for (let q = 0; q < 3; q++) a[k + q] = Math.round(a[k + q] / 24) * 24;
        ctx.putImageData(d, 0, 0);
        c.setAttribute("role", "img");
        c.setAttribute("aria-label", photo.alt);
        photo.replaceWith(c);
      } catch (_) { /* keep the regular photo if the canvas is unavailable */ }
    };
    if (photo.complete && photo.naturalWidth) pixelate(); else photo.addEventListener("load", pixelate, { once: true });
  }

  /* ---------- Copy e-mail ---------- */
  const toast = document.querySelector(".toast");
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2000);
  };
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); say("E-mail copiado ♥"); }
      catch { say(btn.dataset.copy); }
    });
  });

  const year = document.getElementById("ano");
  if (year) year.textContent = new Date().getFullYear();
})();
