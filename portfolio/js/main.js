(() => {
  "use strict";
  const doc = document.documentElement;
  doc.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header state ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

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

  /* ---------- Active section ---------- */
  const links = [...nav.querySelectorAll("a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
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
    sections.forEach((s) => spy.observe(s));

    /* ---------- Reveal on scroll ---------- */
    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
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
      try { await navigator.clipboard.writeText(btn.dataset.copy); say("E-mail copiado"); }
      catch { say(btn.dataset.copy); }
    });
  });

  const year = document.getElementById("ano");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Hero graph: drifting nodes + animated shortest path ---------- */
  const canvas = document.querySelector(".hero-graph");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  const ACCENT = "240,168,90";
  const INK = "185,184,178";
  let W = 0, H = 0, dpr = 1, nodes = [], edges = [], adj = [];
  let path = null, pathStart = 0, nextPathAt = 0;
  let running = false, raf = 0, last = 0;

  const rand = (a, b) => a + Math.random() * (b - a);

  function resize() {
    const r = canvas.getBoundingClientRect();
    const widthChanged = Math.abs(r.width - W) > 1;
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!widthChanged && nodes.length) return; // e.g. mobile URL bar showing/hiding
    const count = Math.max(18, Math.min(54, Math.round((W * H) / 26000)));
    nodes = Array.from({ length: count }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.12, 0.12), vy: rand(-0.12, 0.12),
      r: rand(1.2, 2.4)
    }));
    path = null;
    buildEdges();
  }

  // Connect each node to its 3 nearest neighbours (undirected, deduplicated).
  function buildEdges() {
    const n = nodes.length;
    adj = Array.from({ length: n }, () => []);
    const seen = new Set();
    edges = [];
    for (let i = 0; i < n; i++) {
      const d = [];
      for (let j = 0; j < n; j++) if (j !== i) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        d.push([dx * dx + dy * dy, j]);
      }
      d.sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < 3 && k < d.length; k++) {
        const j = d[k][1], key = i < j ? i + "-" + j : j + "-" + i;
        if (seen.has(key)) continue;
        seen.add(key);
        const w = Math.sqrt(d[k][0]);
        edges.push([i, j]);
        adj[i].push([j, w]); adj[j].push([i, w]);
      }
    }
  }

  function dijkstra(s, t) {
    const n = nodes.length, dist = new Array(n).fill(Infinity), prev = new Array(n).fill(-1), done = new Array(n).fill(false);
    dist[s] = 0;
    for (let it = 0; it < n; it++) {
      let u = -1;
      for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0 || dist[u] === Infinity) break;
      if (u === t) break;
      done[u] = true;
      for (const [v, w] of adj[u]) if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; }
    }
    if (dist[t] === Infinity) return null;
    const p = [];
    for (let v = t; v !== -1; v = prev[v]) p.unshift(v);
    return p.length > 2 ? p : null;
  }

  function pickPath(now) {
    // Favour the right side, where the hero text does not sit.
    const side = W > 760 ? W * 0.45 : 0;
    const pool = nodes.map((n, i) => i).filter((i) => nodes[i].x > side);
    for (let tries = 0; tries < 8 && pool.length > 3; tries++) {
      const a = pool[Math.floor(Math.random() * pool.length)];
      let b = a, best = 0;
      for (const i of pool) {
        const d = Math.hypot(nodes[i].x - nodes[a].x, nodes[i].y - nodes[a].y);
        if (d > best && Math.random() > 0.3) { best = d; b = i; }
      }
      const p = dijkstra(a, b);
      if (p) { path = p; pathStart = now; return; }
    }
    path = null;
  }

  function weight(x) {
    // Fade the graph behind the headline on wide screens.
    if (W <= 760) return 0.45;
    return Math.min(1, Math.max(0.12, (x / W - 0.25) * 1.6));
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (const [i, j] of edges) {
      const a = nodes[i], b = nodes[j];
      const al = 0.13 * Math.min(weight(a.x), weight(b.x));
      ctx.strokeStyle = `rgba(${INK},${al})`;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (const n of nodes) {
      ctx.fillStyle = `rgba(${INK},${0.55 * weight(n.x)})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!path) return;
    const t = (now - pathStart) / 1000;
    const grow = Math.min(1, t / 1.6);
    const fade = (t > 3.6 ? Math.max(0, 1 - (t - 3.6) / 1) : 1) * (W <= 760 ? 0.45 : 1);
    const segs = path.length - 1, shown = grow * segs;
    ctx.strokeStyle = `rgba(${ACCENT},${0.85 * fade})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(nodes[path[0]].x, nodes[path[0]].y);
    for (let k = 0; k < segs; k++) {
      const a = nodes[path[k]], b = nodes[path[k + 1]];
      const f = Math.min(1, shown - k);
      if (f <= 0) break;
      ctx.lineTo(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
    }
    ctx.stroke();
    for (let k = 0; k <= Math.min(segs, Math.floor(shown)); k++) {
      const n = nodes[path[k]], end = k === 0 || k === segs;
      ctx.fillStyle = `rgba(${ACCENT},${fade})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, end ? 3.4 : 2.4, 0, Math.PI * 2); ctx.fill();
      if (end) {
        ctx.strokeStyle = `rgba(${ACCENT},${0.35 * fade})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, 8, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }

  function step(now) {
    const dt = Math.min(48, now - (last || now)) / 16.67;
    last = now;
    for (const n of nodes) {
      n.x += n.vx * dt; n.y += n.vy * dt;
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }
    buildEdges();
    if (now >= nextPathAt) { pickPath(now); nextPathAt = now + 5200; }
    draw(now);
    raf = requestAnimationFrame(step);
  }

  const start = () => { if (running || reduceMotion) return; running = true; last = 0; raf = requestAnimationFrame(step); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize();
  if (reduceMotion) {
    pickPath(0);
    draw(1600); // static frame with a complete path
  } else {
    start();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop())).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); if (reduceMotion) { pickPath(0); draw(1600); } }, 150);
  });
})();
