<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>{{ $devis->theme_projet }} - Proposition d'Aménagement</title>
<style>

@page {
  size: 960pt 540pt;
  margin: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: DejaVu Sans, sans-serif;
  color: #2b1810;
  background: #f5f0eb;
}

/* =====================
   SLIDE STRUCTURE
===================== */
.page {
  width: 960pt;
  height: 540pt;
  max-height: 540pt;
  overflow: hidden;
  position: relative;
  display: block;
}

.page:last-child {
  page-break-after: avoid;
}

/* =====================
   PAGE 1 - COVER
===================== */
.cover {
  background-color: #e8ddd5;
  background-image: url("{{ $bg_part }}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0pt 40pt;
}

.cover-header {
    
    text-align: center;
  margin-bottom: 15pt;
  padding-bottom: 12pt;
}

.cover-header h1 {
  margin-top: 15pt;
  font-size: 28pt;
  letter-spacing: 2pt;
  font-weight: 800;
}

.cover-header p {
  font-size: 21pt;
  margin-top: 4pt;
}

/* Cover body: two-column layout via table */
.cover-body {
  display: table;
  width: 100%;
  margin-top: 10pt;
}

.cover-left {
  display: table-cell;
  width: 55%;
  vertical-align: middle;
  padding-right: 20pt;
}

.cover-left h2 {
  font-size: 52pt;
  line-height: 1.05;
  margin-bottom: 12pt;
  font-weight: bold;
  letter-spacing: 1pt;
}

.cover-left .subtitle {
  font-size: 16pt;
  margin-bottom: 22pt;
  font-weight: 300;
}

.cover-info {
  font-size: 11pt;
  line-height: 2;
}

.cover-info .contact-row {
  color: #2b5a7a;
  font-weight: bold;
}

.cover-logo {
  display: table-cell;
  width: 50%;
  vertical-align: middle;
  text-align: center;
}

.cover-logo img {
  max-width: 340pt;
  max-height: 340pt;
}

/* =====================
   PAGE 2 - INTRO
===================== */
.intro {
  background: white;
}

.intro-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 780pt;
}

.intro-inner p {
  font-size: 13pt;
  line-height: 1.9;
  text-align: justify;
  color: #2b1810;
}

/* =====================
   PAGE 3 - TITRE SOCLE
===================== */
.socle-titre {
  background: #f8e8d0;
}

.socle-titre-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.socle-titre-inner h1 {
  font-size: 48pt;
  letter-spacing: 2pt;
  font-weight: 500;
  color: #333333;
}

/* =====================
   PAGE 4 - IMAGES + TABLEAU
===================== */
.bloc-images {
  position: absolute;
  background: #f4e2ce;
  padding: 0pt 0pt;
  padding-top: 20pt;
}

.images-row {
  margin-left: 40pt;
  margin-top: 20pt;
}

.images-row img {
  width: 240pt;
  height: 240pt;
  margin: 0 8pt;
  margin-top: 20pt;
  object-fit: cover;
  display: inline-block;
}

/* TABLE */
.tableau {
  position: absolute;
  width: 82%;
  border: 3pt solid #000;
}

.tableau-header {
  background: #000;
  color: white;
  display: table;
  width: 100%;
}

.th-cell {
  display: table-cell;
  width: 50%;
  padding: 10pt 18pt;
  font-size: 18pt;
  font-weight: bold;
  text-align: center;
  border-right: 3pt solid #fff;
}

.th-cell:last-child {
  border-right: none;
}

.tableau-body {
  display: table;
  width: 100%;
  background: #c0c0c0;
}

.designation {
  display: table-cell;
  width: 50%;
  padding: 20pt 22pt;
  font-size: 13pt;
  line-height: 1.4;
  border-right: 3pt solid #000;
  vertical-align: middle;
}

.cout {
  display: table-cell;
  width: 50%;
  padding: 20pt;
  font-size: 30pt;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}

/* =====================
   PAGE 5 - EVALUATION
===================== */
.slide {
  background: #f1e7dc;
  padding: 40pt 80pt 20pt 80pt;
}

.slide-top {
  text-align: center;
  color: #5a3b1f;
  margin-right: 140pt;
}

.slide-top h4 {
  font-size: 11pt;
  font-weight: 500;
  color: #2f5d9f;
  margin-bottom: 6pt;
}

.slide-top h2 {
  font-size: 26pt;
  font-weight: 600;
  margin-bottom: 14pt;
}

.slide-top ul {
  list-style: none;
  font-size: 12pt;
  line-height: 1.9;
}

/* Decorative shapes */
.shape-beige {
  position: absolute;
  right: 0;
  top: 195pt;
  width: 42%;
  height: 160pt;
  background: #d7c1b4;
}

.shape-gold {
  position: absolute;
  right: 100pt;
  top: 240pt;
  width: 36%;
  height: 60pt;
  background: #c9b27e;
}

/* Evaluation block */
.slide-evaluation {
  position: absolute;
  right: 100pt;
  bottom: 90pt;
  text-align: center;
}

.slide-evaluation h3 {
  font-size: 20pt;
  letter-spacing: 1pt;
  margin-bottom: 10pt;
}

.slide-price {
  background: #c9b27e;
  padding: 14pt 70pt;
  font-size: 36pt;
  font-weight: 800;
  display: inline-block;
}

/* Color palette */
.palette {
  position: absolute;
  bottom: 80pt;
  left: 80pt;
}

.color-swatch {
  display: inline-block;
  width: 40pt;
  height: 40pt;
  margin-right: 8pt;
}

.c1 { background: #7a4b2b; }
.c2 { background: #e1cdb5; }
.c3 { background: #b88566; }

.slide-footer {
  position: absolute;
  bottom: 20pt;
  left: 80pt;
  right: 80pt;
  font-size: 10pt;
  font-weight: 500;
  border-top: 1pt solid #c0a080;
  padding-top: 8pt;
}

/* =====================
   PAGE 6 - CONDITIONS
===================== */
.conditions {
  background: #fdf8f3;
}

/* Decorative circle */
.rond {
  position: absolute;
  width: 160pt;
  height: 160pt;
  background: #ac945380;
  top: 20pt;
  left: 20pt;
  border-radius: 80pt;
}

.conditions-text {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 520pt;
  font-size: 13pt;
  line-height: 1.9;
  text-align: center;
  color: #2b1810;
}

.conditions-payment {
  position: absolute;
  bottom: 50pt;
  left: 60pt;
}

.conditions-payment h1 {
  font-size: 16pt;
  margin-bottom: 12pt;
  font-weight: bold;
}

.conditions-payment p {
  font-size: 13pt;
  line-height: 1.9;
}

/* =====================
   PAGE 7 - FIN / CONTACT
===================== */
.fin {
  background-color: #e8ddd5;
  background-image: url("{{ $bg_pdf }}");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.fin-text {
  position: absolute;
  top: 70pt;
  left: 60pt;
  width: 380pt;
  font-size: 30pt;
  color: #2b1810;
  line-height: 1.35;
  font-weight: 600;
}

.code-qr {
  position: absolute;
  background: white;
  width: 90pt;
  height: 90pt;
  right: 100pt;
  bottom: 70pt;
}

.reseau {
  position: absolute;
  right: 60pt;
  bottom: 40pt;
}

.reseau p {
  font-size: 15pt;
  color: #60391f;
  font-weight: bold;
}

/* Contact bar at bottom */
.contact {
  position: absolute;
  left: 40pt;
  bottom: 20pt;
  right: 220pt;
}

.contacts-item {
  display: table;
  width: 100%;
}

.contact-item {
  display: table-cell;
  vertical-align: top;
  color: #60391f;
  font-size: 10pt;
  padding-right: 12pt;
}

.contact-label {
  display: block;
  font-weight: bold;
  font-size: 9pt;
  margin-bottom: 3pt;
  text-transform: uppercase;
}

.contact-label a {
  color: #60391f;
  text-decoration: none;
}
</style>
</head>
<body>

{{-- ===================== BOUCLE SUR LES BLOCS ===================== --}}
@foreach($devis->blocs as $blocIndex => $bloc)

  {{-- PAGE COUVERTURE : uniquement pour le premier bloc --}}
  @if($blocIndex === 0)
  <div class="page cover">
    <div class="cover-header">
      <h1>PROJET-{{ strtoupper($devis->nom) }}-{{ strtoupper($devis->localisation) }}</h1>
      <p>({{ $devis->style_projet }})</p>
    </div>

    <div class="cover-body">
      <div class="cover-left">
        {{-- Thème affiché en grandes lettres (ex: HARMONIA / ÉQUILIBRE) --}}
        @php $themeParts = explode(' ', $devis->theme_projet, 2); @endphp
        <h2>{{ $themeParts[0] }}<br>{{ $themeParts[1] ?? '' }}</h2>
        <p class="subtitle">{{ $devis->type_projet }}</p>
        <div class="cover-info">
          <div class="row">LIEU: {{ strtoupper($devis->localisation) }} &nbsp;&nbsp;&nbsp; NOM: {{ strtoupper($devis->nom) }}{{ $devis->prenom ? ' '.$devis->prenom : '' }}</div>
          <div class="row">DATE D'ÉDITION: {{ $devis->date_edition }}</div>
          <div class="row contact-row">CONTACT: {{ $devis->telephone ?? '+225 07 09 17 64 76' }}</div>
        </div>
      </div>

      <div class="cover-logo">
        <img src="{{ $logo }}" alt="Logo">
      </div>
    </div>
  </div>

  {{-- PAGE INTRODUCTION --}}
  <div class="page intro">
    <div class="intro-inner">
      <p>
    @if(!empty($devis->intro))
        {{ $devis->intro }}
    @else
        Veuillez trouver ci-joint le point des travaux à effectuer à votre domicile, suite
        à la révision du projet. Nous maintenons l'intégralité des travaux pratiques
        initialement prévus. Toutefois, le volet harmonisation décorative, incluant
        l'acquisition des moquettes et des ornements décoratifs, a été retiré du
        budget. En effet, ce poste faisait l'objet d'une enveloppe ouverte et non
        définitivement arrêtée. Compte tenu de notre connaissance du terrain, nous
        avions initialement envisagé la mise en place d'un package décoratif adapté à
        ce budget. Cependant, suite à une réduction globale de trois millions (3 000 000 FCFA),
        nous avons jugé préférable de reporter ce volet à une phase ultérieure. Cette
        décision nous permettra de concentrer pleinement nos efforts sur la réalisation
        optimale des travaux pratiques de base, en toute liberté d'exécution, afin de
        vous garantir une prestation conforme à vos attentes et à nos standards de qualité.
    @endif
</p>
    </div>
  </div>
  @endif

  {{-- PAGE TITRE DU BLOC --}}
  <div class="page socle-titre">
    <div class="socle-titre-inner">
      <h1>{{ strtoupper($bloc->nom) }}</h1>
    </div>
  </div>

  {{-- BOUCLE SUR LES PAGES DU BLOC --}}
@foreach($bloc->pages as $pageIndex => $page)

  {{-- PAGE IMAGES + TABLEAU --}}
  <div class="page bloc-images" style="position: relative; background: #f4e2ce;">

    @php
      $pageImages = $page->images->sortBy('ordre')->values();
      $imagesBase64 = $pageImages->map(fn($img) => $imagesData[$img->chemin] ?? '')->filter()->values();
    @endphp

    {{-- Images row --}}
    <div class="images-row" style="margin-left: 40pt; margin-top: 20pt; text-align: center;">
      @for($i = 0; $i < min(3, count($imagesBase64)); $i++)
        @if(isset($imagesBase64[$i]) && $imagesBase64[$i])
          <img src="{{ $imagesBase64[$i] }}" alt="Image {{ $i + 1 }}" style="width: 240pt; height: 240pt; margin: 0 8pt; margin-top: 20pt; object-fit: cover; display: inline-block;">
        @endif
      @endfor
      {{-- Si moins de 3 images, afficher des placeholders ou rien --}}
      @for($i = count($imagesBase64); $i < 3; $i++)
        <div style="width: 240pt; height: 240pt; margin: 0 8pt; margin-top: 20pt; display: inline-block; background: #e0d0c0;"></div>
      @endfor
    </div>

    {{-- Tableau --}}
    <div class="tableau" style="position: absolute; bottom: 60pt; left: 50%; transform: translateX(-50%); width: 82%; border: 3pt solid #000;">
      <div class="tableau-header" style="background: #000; color: white; display: table; width: 100%;">
        <div class="th-cell" style="display: table-cell; width: 50%; padding: 10pt 18pt; font-size: 18pt; font-weight: bold; text-align: center; border-right: 3pt solid #fff;">DESIGNATION</div>
        <div class="th-cell" style="display: table-cell; width: 50%; padding: 10pt 18pt; font-size: 18pt; font-weight: bold; text-align: center;">COUT DU BUDGET</div>
      </div>
      <div class="tableau-body" style="display: table; width: 100%; background: #c0c0c0;">
        <div class="designation" style="display: table-cell; width: 50%; padding: 20pt 22pt; font-size: 13pt; line-height: 1.4; border-right: 3pt solid #000; vertical-align: middle;">
          {{ $page->designation }}
        </div>
        <div class="cout" style="display: table-cell; width: 50%; padding: 20pt; font-size: 30pt; font-weight: bold; text-align: center; vertical-align: middle;">
          @php
            $pageTotal = $page->materiels->sum(fn($m) => $m->pieces * $m->prix);
          @endphp
          {{ number_format($pageTotal, 0, ',', '.') }} FCFA
        </div>
      </div>
    </div>

  </div>

@endforeach {{-- fin pages --}}

  {{-- PAGE EVALUATION : affichée après le dernier bloc seulement --}}
  @if($blocIndex === $devis->blocs->count() - 1)
  <div class="page slide">
    <div class="slide-top">
      <h4>Délai d'Exécution</h4>
     <h2>
        @if(!empty($devis->delai_realisation))
            {{ $devis->delai_realisation }}
        @else
            10 à 15 jours / Jours ouvrables
        @endif
      </h2>
      <ul>
        <li>• Priorisation de l'atelier sur 10 jours</li>
        <li>• Mobilisation accélérée</li>
        <li>• Prime d'urgence harmonia 5%</li>
      </ul>
    </div>

    <div class="shape-beige"></div>
    <div class="shape-gold"></div>

    <div class="slide-evaluation">
      <h3>EVALUATION GENERALE</h3>
      <div class="slide-price">{{ number_format($totalGeneral, 0, ',', '.') }} FCFA</div>
    </div>

    <div class="palette">
      <span class="color-swatch c1"></span>
      <span class="color-swatch c2"></span>
      <span class="color-swatch c3"></span>
    </div>

    <div class="slide-footer">
      Le montant global inclut la conception, la fabrication, l'installation ainsi que le pilotage complet et la responsabilité d'exécution de l'ouvrage.
    </div>
  </div>

  {{-- PAGE CONDITIONS --}}
  <div class="page conditions">
    <div class="rond"></div>

    <p class="conditions-text">
      Tous les travaux réalisés sur le site sont soumis aux droits d'auteur,
      conférant au prestataire le droit d'utiliser les contenus (images, vidéos,
      modèles 3D, etc.) à des fins de communication et de valorisation de son
      savoir-faire.
    </p>

    <div class="conditions-payment">
      <h1>CONDITIONS DE PAIEMENT</h1>
      <p>• 70 % à la validation du devis</p>
      <p>• 20 % en cours de fabrication</p>
      <p>• 10 % à la livraison et installation</p>
      <p>Le démarrage des travaux est conditionné au règlement de l'avance.</p>
    </div>
  </div>

  {{-- PAGE FIN / CONTACT --}}
  <div class="page fin">
    <div class="fin-text">
      <p>Si vous avez des interrogations,<br>n'hésitez pas à nous joindre !</p>
    </div>

    <div class="code-qr">
        <img src="{{ $code_qr }}" alt="Code QR" style="width: 100%; height: 100%;">
    </div>

    <div class="contact">
      <div class="contacts-item">
        <div class="contact-item">
          <span class="contact-label">Téléphone</span>
          +225 07 78 37 90 70
        </div>
        <div class="contact-item">
          <span class="contact-label">Adresse</span>
          Abidjan - Faya,<br>Carrefour Prestige
        </div>
        <div class="contact-item">
          <span class="contact-label">Site web</span>
          www.TifyDécor.com
        </div>
        <div class="contact-item">
          <span class="contact-label">Email</span>
          contact@tifydecor.org
        </div>
      </div>
    </div>
  </div>
  @endif

@endforeach {{-- fin blocs --}}

</body>
</html>