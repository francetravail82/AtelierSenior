/* ============================================================
   CONFIGURATION — le seul fichier à modifier pour les profils et les vidéos
   (partagé par index.html et par les pages de chaque profil)

   PROFILES : name = prénom affiché | avatar = photo | page = fichier de la page du profil
   VIDEOS   : title = titre | src = fichier vidéo (.mp4) | thumb = vignette (optionnelle)
   Tous les fichiers se trouvent à la racine du dépôt GitHub.
   ============================================================ */
const VIDEOS = [  /* vidéos communes à tous les profils */
  { title:"Et si on reprenait la main ?", src:"video1.mp4", thumb:"video1.jpg" },
  { title:"Dynamiser son parcours", src:"video2.mp4", thumb:"video2.jpg" },
  { title:"L'âge, barrière mentale ou vrai frein ?", src:"video3.mp4", thumb:"video3.jpg" },
  { title:"Le parcours en 4 ateliers", src:"video4.mp4", thumb:"video4.jpg" },
  { title:"Infos pratiques et invitation", src:"video5.mp4", thumb:"video5.jpg" }
];
const PROFILES = [
  { name:"Sylvie",    color:"#69408C", avatar:"Sylvie.png",    page:"sylvie.html" },
  { name:"Stéphanie", color:"#9a73c0", avatar:"Stephanie.png", page:"stephanie.html" },
  { name:"Ruxanda",   color:"#4a2b6a", avatar:"Ruxanda.png",   page:"ruxanda.html" }
];
const HOME = "index.html";

/* Affiche la photo du profil (ou l'initiale sur fond de couleur si la photo est absente) */
function paintAvatar(el, p){
  el.style.backgroundImage = "none";
  el.style.backgroundColor = p.color;
  el.textContent = p.name.trim().charAt(0).toUpperCase();
  if(p.avatar){
    const im = new Image();
    im.onload = () => { el.style.backgroundImage = `url("${p.avatar}")`; el.textContent = ""; };
    im.src = p.avatar;
  }
}
