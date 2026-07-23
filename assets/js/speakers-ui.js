(function () {
  "use strict";

  const speakers = window.AADP_SPEAKERS || [];
  const grid = document.getElementById("intervenantsGrid");
  const exergueGrid = document.getElementById("directionExergue");
  const modal = document.getElementById("speakerBioModal");
  if (!modal || !speakers.length) return;

  const initials = (name) =>
    name
      .replace(/^(Pr\.|Dr\.|Me|M\.)\s*/i, "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  let lastFocus = null;

  function openModal(sp) {
    lastFocus = document.activeElement;
    const av = document.getElementById("bioModalAvatar");
    if (sp.photo) {
      av.className = "bio-modal__avatar bio-modal__avatar--photo";
      const pos = sp.pos ? ' style="object-position:center ' + sp.pos + '"' : "";
      av.innerHTML = '<img src="' + sp.photo + '" alt="Portrait de ' + sp.name + '"' + pos + " />";
    } else {
      av.className = "bio-modal__avatar";
      av.textContent = initials(sp.name);
    }
    document.getElementById("bioModalField").textContent = sp.field || "";
    document.getElementById("bioModalName").textContent = sp.name;
    document.getElementById("bioModalUniv").textContent = sp.univ + " · " + sp.country;
    document.getElementById("bioModalBio").textContent = sp.bio || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    modal.querySelector(".bio-modal__close").focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  function avatarHtml(sp) {
    const pos = sp.pos ? ' style="object-position:center ' + sp.pos + '"' : "";
    return sp.photo
      ? '<div class="avatar avatar--photo"><img src="' + sp.photo + '" alt=""' + pos + ' loading="lazy" /></div>'
      : '<div class="avatar" aria-hidden="true">' + initials(sp.name) + "</div>";
  }

  function observeReveal(root) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  if (exergueGrid) {
    speakers
      .filter((sp) => sp.featured === "exergue")
      .forEach((sp) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "exergue reveal";
        btn.setAttribute("aria-label", "Voir la biographie de " + sp.name);
        btn.innerHTML =
          avatarHtml(sp) +
          '<div class="exergue__body">' +
          '<div class="exergue__role">' + (sp.field || "Direction de l'Académie") + "</div>" +
          "<b>" + sp.name + "</b>" +
          "<span>" + sp.univ + " · " + sp.country + "</span>" +
          "</div>";
        btn.addEventListener("click", () => openModal(sp));
        exergueGrid.appendChild(btn);
      });
    observeReveal(exergueGrid);
  }

  if (grid) {
    speakers
      .filter((sp) => !sp.featured)
      .forEach((sp) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "membre reveal";
        btn.setAttribute("aria-label", "Voir la biographie de " + sp.name);
        btn.innerHTML =
          avatarHtml(sp) +
          "<b>" + sp.name + "</b>" +
          "<span>" + sp.univ + " · " + sp.country + "</span>";
        btn.addEventListener("click", () => openModal(sp));
        grid.appendChild(btn);
      });
    observeReveal(grid);
  }

  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
})();
