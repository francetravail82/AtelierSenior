/* Page de profil : lit config.js (PROFILES, VIDEOS) et construit la page du profil indiqué par <body data-page="..."> */
(function(){
  const $ = id => document.getElementById(id);
  const me = PROFILES.find(p => p.page === document.body.dataset.page) || PROFILES[0];
  const vids = me.videos || VIDEOS;
  const tints = ["#69408C","#8a62b0","#4a2b6a","#a583c6","#5a3480"];   /* aplats de repli si pas de vignette */
  document.title = me.name + " · Atelier Senior";

  /* Barre du haut : profil actif + menu pour changer de profil */
  $("meName").textContent = me.name;
  paintAvatar($("meAvatar"), me);
  const menu = $("menu"), btn = $("switch");
  PROFILES.filter(p => p !== me).forEach(p => {
    const a = document.createElement("a");
    a.href = p.page; a.setAttribute("role","menuitem");
    a.innerHTML = `<div class="av"></div><span></span>`;
    a.querySelector("span").textContent = p.name;
    paintAvatar(a.querySelector(".av"), p);
    menu.appendChild(a);
  });
  menu.appendChild(document.createElement("hr"));
  const home = document.createElement("a");
  home.className = "home"; home.href = HOME; home.setAttribute("role","menuitem");
  home.textContent = "Retour à l'accueil";
  menu.appendChild(home);
  const closeMenu = () => { menu.classList.add("hidden"); btn.setAttribute("aria-expanded","false"); };
  btn.onclick = e => {
    e.stopPropagation();
    const open = menu.classList.toggle("hidden") === false;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  };
  document.addEventListener("click", e => { if(!e.target.closest(".meWrap")) closeMenu(); });

  /* Bandeau violet */
  paintAvatar($("heroAvatar"), me);
  $("heroWho").textContent = "Sélection pour " + me.name;
  const first = vids[0];
  $("heroTitle").textContent = first ? first.title : "Bienvenue";
  $("heroPlay").onclick = () => first && play(first);

  /* Rangées de vignettes */
  function attachPreview(el, v){   /* sans vignette : 1re image de la vidéo */
    const addVideo = () => {
      if(!v.src) return;
      const pv = document.createElement("video");
      pv.className = "pv"; pv.muted = true; pv.playsInline = true; pv.preload = "metadata";
      pv.setAttribute("aria-hidden","true"); pv.src = v.src + "#t=1";
      el.insertBefore(pv, el.firstChild);
    };
    if(v.thumb){ const im = new Image(); im.onerror = addVideo; im.src = v.thumb; } else addVideo();
  }
  const rows = $("rows");
  [["Reprendre la lecture", vids.slice(0,3)],
   ["Sélection de " + me.name, vids],
   ["Tendances actuelles", [...vids].reverse()]].forEach(([title, list]) => {
    if(!list.length) return;
    const r = document.createElement("section"); r.className = "row";
    r.innerHTML = `<h3></h3><div class="scroller"></div>`;
    r.querySelector("h3").textContent = title;
    list.forEach((v,k) => {
      const c = document.createElement("button"); c.className = "card";
      c.style.backgroundColor = tints[k % tints.length];
      if(v.thumb) c.style.backgroundImage = `url("${v.thumb}")`;
      c.innerHTML = `<div class="play glass">▶</div><div class="t"></div>`;
      c.querySelector(".t").textContent = v.title;
      attachPreview(c, v);
      c.onclick = () => play(v);
      r.querySelector(".scroller").appendChild(c);
    });
    rows.appendChild(r);
  });

  /* Lecteur : lancement en plein écran au clic */
  const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  const exitFs = () => { try{ if(document.exitFullscreen) return document.exitFullscreen(); if(document.webkitExitFullscreen) return document.webkitExitFullscreen(); }catch(e){} };
  function play(v){
    $("playerTitle").textContent = v.title;
    const m = $("playerMedia"); m.innerHTML = "";
    $("player").classList.remove("hidden");
    if(!v.src){ m.innerHTML = `<div class="empty">Vidéo à venir — ajoute le lien du fichier dans config.js.</div>`; return; }
    const el = document.createElement("video");
    el.src = v.src; el.controls = true; el.autoplay = true; el.playsInline = true;
    if(v.thumb) el.poster = v.thumb;
    el.onerror = () => { exitFs(); m.innerHTML = `<div class="empty">Vidéo introuvable — vérifie le nom du fichier.</div>`; };
    el.onended = closePlayer;                                   /* fin de la vidéo : retour à la page */
    el.addEventListener("webkitendfullscreen", closePlayer);    /* iPhone / iPad */
    m.appendChild(el);
    try{
      if(el.requestFullscreen) el.requestFullscreen().catch(()=>{});
      else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if(el.webkitEnterFullscreen) el.addEventListener("loadedmetadata", () => { try{ el.webkitEnterFullscreen(); }catch(e){} }, {once:true});
    }catch(e){}
  }
  function closePlayer(){
    const v = $("playerMedia").querySelector("video"); if(v) v.pause();
    if(fsElement()) exitFs();
    $("playerMedia").innerHTML = ""; $("player").classList.add("hidden");
  }
  ["fullscreenchange","webkitfullscreenchange"].forEach(ev =>
    document.addEventListener(ev, () => { if(!fsElement() && !$("player").classList.contains("hidden") && $("playerMedia").querySelector("video")) closePlayer(); }));
  $("closePlayer").onclick = closePlayer;
  $("player").onclick = e => { if(e.target === $("player")) closePlayer(); };
  document.addEventListener("keydown", e => { if(e.key === "Escape"){ closePlayer(); closeMenu(); } });
})();
