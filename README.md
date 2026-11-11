# Portfolio — Emna Brahmi

Site personnel statique (HTML, CSS, JavaScript sans framework) publié sur GitHub Pages :
**https://emnab2.github.io**

## Structure des fichiers

```
.
├── index.html              ← tout le contenu du site (une seule page)
├── cv.pdf                  ← votre CV (le bouton « Télécharger mon CV » pointe ici)
├── css/
│   └── style.css           ← mise en page, couleurs, thème sombre, responsive
├── js/
│   └── main.js             ← thème clair/sombre, menu mobile, animations, copie de l'e-mail
├── assets/
│   ├── favicon.svg         ← icône de l'onglet (monogramme EB)
│   ├── favicon-32.png      ← icône de secours pour les anciens navigateurs
│   ├── apple-touch-icon.png← icône sur l'écran d'accueil iPhone
│   └── img/
│       └── og-image.png    ← image d'aperçu lors d'un partage (LinkedIn, WhatsApp…)
├── .nojekyll               ← indique à GitHub Pages de servir les fichiers tels quels
└── README.md
```

## Voir le site en local

Double-cliquez sur `index.html` : il s'ouvre dans votre navigateur.
(Le bouton « Copier l'adresse » fonctionne mieux une fois en ligne, en HTTPS.)

## Modifier le contenu

Tout le texte est dans **`index.html`**, découpé en sections commentées :
`ACCUEIL`, `01 — PROJETS`, `02 — EXPÉRIENCE`, `03 — FORMATION`, `04 — COMPÉTENCES`,
`05 — CERTIFICATIONS`, `06 — ENGAGEMENT`, `07 — CONTACT`.
Cherchez le titre de la section (Ctrl+F) et modifiez le texte entre les balises.

### Remplacer un visuel de projet par une capture d'écran

Chaque projet affiche pour l'instant un visuel sobre (nom + pipeline), bloc
`<figure class="visual" …>`. Pour mettre une vraie capture :

1. Enregistrez l'image dans `assets/projets/` (ex. `labclear.png`, idéalement 1600 × 1000 px,
   moins de 300 Ko ; convertir en WebP ou JPG si besoin).
2. Remplacez le bloc `<figure class="visual" …>…</figure>` du projet par :
   ```html
   <figure class="shot">
     <img src="assets/projets/labclear.png" alt="Capture d'écran de LabClear : tableau des résultats d'analyse" width="1600" height="1000" loading="lazy">
   </figure>
   ```
   Le texte `alt` doit décrire ce que montre l'image. Pour les « Autres projets »,
   utilisez `<figure class="shot shot--small">`.

### Ajouter un lien GitHub de projet

Dans le projet, sous les étiquettes, ajoutez :
```html
<div class="project-links">
  <a class="link" href="https://github.com/Emnab2/NOM-DU-DEPOT" target="_blank" rel="noopener noreferrer"><svg class="icon" aria-hidden="true"><use href="#i-github"/></svg>Voir le code sur GitHub</a>
</div>
```
(pour les « Autres projets », remplacez `<div class="project-links">` par `<p class="minor-link">`).
Liens actuels : LabClear, CreditWise, DelivGo. DocuMind, EDUKINI et SmartStudy n'ont pas de dépôt public.

### Ajouter un lien LinkedIn plus tard

Dans la section Contact, ajoutez une ligne dans `<ul class="contact-list">` :
```html
<li>
  <svg class="icon" aria-hidden="true"><use href="#i-linkedin"/></svg>
  <span class="contact-key">LinkedIn</span>
  <a href="https://www.linkedin.com/in/VOTRE-PROFIL" target="_blank" rel="noopener noreferrer">linkedin.com/in/VOTRE-PROFIL</a>
</li>
```
(l'icône `#i-linkedin` est déjà prête dans le fichier).

### Mettre à jour le CV

Remplacez `cv.pdf` à la racine (gardez exactement ce nom).

### Ajouter une photo (optionnel)

Dans la section `ACCUEIL`, un bloc `<figure class="hero-photo">` est en commentaire.
Placez la photo dans `assets/img/photo.webp` (format portrait 4:5) puis supprimez les
balises de commentaire `<!--` et `-->` autour de ce bloc.

### Ajouter un projet

Copiez un bloc `<article class="project">…</article>` (projet phare) ou
`<article class="minor">…</article>` (autre projet), collez-le à la suite et modifiez :
l'`id` du titre (ex. `p-nouveau`), l'attribut `aria-labelledby` correspondant, le texte,
les étapes et les étiquettes. Pour un projet phare, ajoutez `project--reverse` à un
article sur deux pour alterner l'image à gauche / à droite.

### Changer la couleur d'accent

Dans `css/style.css`, section **1. VARIABLES**, modifiez `--accent` et `--accent-strong`
(thème clair) ainsi que les mêmes variables dans les deux blocs du thème sombre.
Vérifiez le contraste (au moins 4.5:1 avec le fond) sur https://webaim.org/resources/contrastchecker/.
Pensez aussi à mettre à jour la couleur de `assets/favicon.svg`.

## Accessibilité et performances (déjà en place)

- Lien « Aller au contenu », focus clavier visible, menu mobile fermable avec Échap.
- Contrastes conformes WCAG AA dans les deux thèmes.
- Animations désactivées si le système demande de réduire les animations.
- Aucun framework : une page HTML, une feuille CSS, un script de quelques Ko.
