/* =================================================================
   AADP — Interactions
   ================================================================= */
(function () {
  "use strict";

  // JS actif : autorise l'animation reveal (contenu visible par défaut si JS échoue).
  document.documentElement.classList.add("js");

  /* ---------- Données : Axes scientifiques ---------- */
  const AXES = {
    1: {
      kicker: "Axe 01",
      title: "Faire et réformer les Constitutions en Afrique",
      problem: "Comment les Constitutions africaines sont-elles élaborées, révisées et transformées ? Pourquoi certaines réformes renforcent-elles la stabilité politique tandis que d'autres provoquent des crises ?",
      sub: [
        "Les conférences nationales et les processus constituants",
        "Les commissions de réforme constitutionnelle",
        "Les révisions constitutionnelles et la question des mandats présidentiels",
        "Les référendums constitutionnels et la légitimation populaire du pouvoir",
        "La participation citoyenne aux réformes",
        "Le consensus politique dans les processus constituants",
        "La participation des juridictions constitutionnelles au pouvoir constituant",
      ],
    },
    2: {
      kicker: "Axe 02",
      title: "Élections, alternance politique et légitimité du pouvoir",
      problem: "Les processus électoraux constituent-ils encore le principal mécanisme de légitimation des gouvernants ? Comment restaurer la confiance dans les mécanismes de désignation des gouvernants ?",
      sub: [
        "Les processus électoraux et la stabilité constitutionnelle",
        "Les systèmes et contentieux électoraux en Afrique",
        "La dégradation des formes classiques d'exercice de la souveraineté",
        "La fragmentation politique par la multiplication des partis et groupes d'opinion",
        "La question de l'indépendance des commissions électorales",
        "La participation politique des citoyens et l'inclusion des minorités",
        "La fragmentation partisane et la gouvernabilité",
      ],
    },
    3: {
      kicker: "Axe 03",
      title: "Gouverner efficacement : régimes, pouvoirs et stabilité",
      problem: "Comment les systèmes politiques africains adaptent-ils la séparation des pouvoirs aux contraintes de gouvernance et de stabilité ? La séparation des pouvoirs est-elle une réalité ou un mythe ?",
      sub: [
        "Les types de régimes politiques en Afrique",
        "Repenser une classification des régimes propre au fonctionnement institutionnel africain",
        "Le mythe de la séparation des pouvoirs et la tendance présidentialiste croissante",
        "Transitions constitutionnelles, régimes militaires et concentration du pouvoir",
        "La place des accords politiques dans le paysage institutionnel",
        "Le choix de la forme de l'État comme facteur de stabilité et de développement",
      ],
    },
    4: {
      kicker: "Axe 04",
      title: "Les juges face au pouvoir : justice constitutionnelle et État de droit",
      problem: "Les juridictions constitutionnelles peuvent-elles devenir les véritables gardiennes du jeu démocratique ? Quels sont les nouveaux gardiens de la Constitution en Afrique ?",
      sub: [
        "L'influence croissante des juridictions constitutionnelles africaines",
        "Le contrôle des révisions constitutionnelles",
        "La déontologie de la vie publique",
        "La formation des élites administratives, politiques et juridictionnelles",
        "Les autorités indépendantes et la lutte contre la corruption",
      ],
    },
    5: {
      kicker: "Axe 05",
      title: "Réformer l'État africain face aux nouveaux défis du XXIᵉ siècle",
      problem: "Comment les Constitutions africaines s'adaptent-elles à l'internationalisation du droit et aux nouveaux défis environnementaux et numériques des sociétés africaines ?",
      sub: [
        "Les défis sécuritaires",
        "Le changement climatique",
        "Les ressources naturelles",
        "La transition numérique",
        "L'intelligence artificielle et la protection des données",
        "Les défis migratoires",
        "Les nouvelles formes de participation citoyenne",
        "Les rapports entre souveraineté nationale et intégration régionale",
      ],
    },
  };

  /* ---------- Données : Intervenants (sélection) ---------- */
  const SPEAKERS = window.AADP_SPEAKERS || [];

  /* ---------- Utilitaires ---------- */
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const initials = (name) => name.replace(/^(Pr\.|Dr\.|Me|M\.)\s*/i, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  /* ---------- Header au scroll ---------- */
  const header = $("#header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (toggle && menu) {
    const closeMenu = () => { toggle.setAttribute("aria-expanded", "false"); menu.classList.remove("is-open"); };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });
    $$(".nav__link, .nav__cta", menu).forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------- Reveal au scroll ---------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Programme : onglets ---------- */
  const tabs = $$(".program__tab");
  const days = $$(".program__day");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const d = tab.dataset.day;
      tabs.forEach((t) => { const on = t === tab; t.classList.toggle("is-active", on); t.setAttribute("aria-selected", String(on)); });
      days.forEach((day) => { const on = day.dataset.day === d; day.classList.toggle("is-active", on); day.hidden = !on; });
    });
  });

  /* ---------- Intervenants : galerie ---------- */
  const grid = $("#speakersGrid");
  if (grid) {
    SPEAKERS.filter((sp) => sp.featured !== "president").forEach((sp, i) => {
      const btn = document.createElement("button");
      btn.className = "speaker reveal";
      btn.dataset.delay = String(i % 4);
      const pos = sp.pos ? ' style="object-position:center ' + sp.pos + '"' : "";
      const avatar = sp.photo
        ? '<div class="speaker__avatar speaker__avatar--photo"><img src="' + sp.photo + '" alt="Portrait de ' + sp.name + '"' + pos + ' loading="lazy" width="120" height="120" /></div>'
        : '<div class="speaker__avatar" aria-hidden="true">' + initials(sp.name) + "</div>";
      btn.innerHTML =
        avatar +
        '<div class="speaker__name">' + sp.name + "</div>" +
        '<div class="speaker__role">' + sp.univ + " · " + sp.country + "</div>" +
        '<span class="speaker__tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>' + sp.field + "</span>";
      btn.addEventListener("click", () => openSpeaker(sp));
      grid.appendChild(btn);
    });
    // (ré)observer les cartes injectées
    if (!reduce && "IntersectionObserver" in window) {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io2.unobserve(e.target); } });
      }, { threshold: 0.12 });
      $$(".speaker.reveal").forEach((el) => io2.observe(el));
    } else {
      $$(".speaker.reveal").forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* ---------- Modales ---------- */
  let lastFocus = null;
  function openModal(modal) {
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const close = $(".modal__close", modal);
    if (close) close.focus();
  }
  function closeModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }
  $$(".modal").forEach((modal) => {
    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", () => closeModal(modal)));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { const open = $(".modal.is-open"); if (open) closeModal(open); }
  });

  // Axes
  const axisModal = $("#axisModal");
  if (axisModal) {
    $$(".axis-card").forEach((card) => {
      card.addEventListener("click", () => {
        const data = AXES[card.dataset.axis];
        if (!data) return;
        $("#axisModalKicker").textContent = data.kicker;
        $("#axisModalTitle").textContent = data.title;
        $("#axisModalProblem").textContent = data.problem;
        const list = $("#axisModalList");
        list.innerHTML = "";
        data.sub.forEach((s) => { const li = document.createElement("li"); li.textContent = s; list.appendChild(li); });
        openModal(axisModal);
      });
    });
  }

  // Intervenant
  const speakerModal = $("#speakerModal");
  function openSpeaker(sp) {
    if (!speakerModal) return;
    const av = $("#spModalAvatar");
    if (sp.photo) {
      av.classList.add("sp-modal__avatar--photo");
      const pos = sp.pos ? ' style="object-position:center ' + sp.pos + '"' : "";
      av.innerHTML = '<img src="' + sp.photo + '" alt="Portrait de ' + sp.name + '"' + pos + " />";
    } else {
      av.classList.remove("sp-modal__avatar--photo");
      av.textContent = initials(sp.name);
    }
    $("#spModalField").textContent = sp.field;
    $("#speakerModalName").textContent = sp.name;
    $("#spModalCountry").innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>' + sp.country;
    $("#spModalUniv").textContent = sp.univ;
    $("#spModalBio").textContent = sp.bio;
    openModal(speakerModal);
  }

  /* ---------- FAQ ---------- */
  $$(".faq__item").forEach((item) => {
    const q = $(".faq__q", item);
    const a = $(".faq__a", item);
    q.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      $$(".faq__item").forEach((it) => {
        it.classList.remove("is-open");
        $(".faq__q", it).setAttribute("aria-expanded", "false");
        $(".faq__a", it).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- Formulaire ---------- */
  const form = $("#regForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      $("#formFields").style.display = "none";
      $("#formSuccess").classList.add("is-visible");
      $("#formSuccess").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    });
  }

  /* ---------- Année dynamique déjà fixée à 2026 dans le footer ---------- */
})();
