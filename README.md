<p align="center">
<img src="https://user-images.githubusercontent.com/62628408/149734737-cd534c5b-03d9-4ad3-af77-70d6784d98cc.png" align="center" width="50%">
</p>


<h1 align="center">Portfolio Template - HTML</h1>

<p align="center">
<img src="https://img.shields.io/github/repo-size/CommunityPro/portfolio-html?color=green&label=project%20size">
<a href="https://github.com/CommunityPro/portfolio-html/issues?q=is%3Aopen+is%3Aissue">
<img src="https://img.shields.io/github/issues-raw/Communitypro/portfolio-html?color=green">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/good%20first%20issue">     
<img src="https://img.shields.io/github/labels/CommunityPro/portfolio-html/good%20first%20issue">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/help%20wanted"> 
<img src="https://img.shields.io/github/labels/CommunityPro/portfolio-html/help%20wanted">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/bug">
<img src="https://img.shields.io/github/labels/Communitypro/portfolio-html/bug">
</a>
<a href="https://github.com/CommunityPro/portfolio-html/labels/enhancement"> 
<img src="https://img.shields.io/github/labels/Communitypro/portfolio-html/enhancement">
</a>

<a href="https://app.netlify.com/sites/cpro-portfolio-html/deploys">
    <img src="https://api.netlify.com/api/v1/badges/d831b80b-40d4-473a-b552-13055a16a6da/deploy-status">
</a>
</p>

<p align="center">Build your portfolio using this super easy template. Free to use if you are a member of the community or a contributor to this project. if not, read our <a href="https://github.com/CommunityPro/portfolio-html/blob/main/REQUIREMENTS.md">requirements</a> if you plan on using this template for your portfolio.</p>

<p align="center">This project is made from the tireless efforts of the community, so feel free to <a href= "https://www.buymeacoffee.com/evavic44">support</a> our work by contributing, staring ✨ the project or <a href="https://camo.githubusercontent.com/37a7cffb8b4d73c06dbfea643b9e783b144ed5383815c08bcffc9d40a1bee61c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f73706f6e736f722d3330333633443f7374796c653d666f722d7468652d6261646765266c6f676f3d4769744875622d53706f6e736f7273266c6f676f436f6c6f723d237768697465">sponsoring</a> us. 🙏🏽</p>

<p align="center">
<img src="https://forthebadge.com/images/badges/built-by-developers.svg">
<img src="https://forthebadge.com/images/badges/built-with-love.svg">
<img src="https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg">
<img src="https://forthebadge.com/images/badges/open-source.svg">
</p>

<hr>

<img src="https://user-images.githubusercontent.com/62628408/150613011-b78a7f5a-0af1-4312-aab0-0022e7258693.png" width="100%">
<a href="https://gitpod.io/https:/CommunityPro/portfolio-html"><img src="https://gitpod.io/button/open-in-gitpod.svg"></a>

## Design credit: 
- <a href="https://github.com/CommunityPro">Communitypro</a>
- <a href="https://dribbble.com/shots/14385288-Portfolio-Landing-Page?utm_source=Clipboard_Shot&utm_campaign=oguzyagiz&utm_content=Portfolio%3A%20Landing%20Page&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=oguzyagiz&utm_content=Portfolio%3A%20Landing%20Page&utm_medium=Social_Share">Dribble Inspiration</a>
- <a href="https://github.com/frankiefab100">Franklin U.O. Ohaegbulam</a>
- <a href="https://openpeeps.com/">Open Peeps Illustration</a> by <a href="https://twitter.com/pablostanley">Pablo Stanley</a> 

## How to Contribute

Are you contributing to this project, please ensure all pull requests and contributions comply with our <a href="https://github.com/CommunityPro/portfolio-html/blob/main/CONTRIBUTING.md">guidelines</a>

Before making any changes, ensure you have raised an issue <a href="https://github.com/CommunityPro/portfolio-html/issues/new/choose">here</a>, unless it is a minimal change like Typo error then you can go right ahead.

## Folder Structure

```bash
├── template
│   ├── index.html
│   ├── css
│   │   ├── style.css
│   │   ├── utilities.css
│   ├── assets
│   │   ├── favicon
│   │   │   ├── android-chrome-192x192
│   │   │   ├── android-chrome-512x512
│   │   │   ├── apple-touch-icon
│   │   │   ├── favicon-16x16
│   │   │   ├── favicon-32x32
│   │   │   ├── favicon.ico
│   │   │   ├── site.webmanifest   
│   │   ├── profile-image
│   │   ├── logo
│   ├── js
│   │   ├── script.js
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug.md
│   │   ├── feature.md
│   ├── Pull_request_template.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── REQUIREMENTS.md
├── package.json
└── .gitignore
```

<div align="center">
    <h1>✨ How to Customize this Template ✨</h1>
</div>

The root page of this project is located at `/template/index.html` This is the default page you see when you visit the site.
Want to customize this template to suit your style, here are a few things you can change: 

### 1. Logo
The logo of this template is controlled by this line in the `index.html` markup, replace the `./assets/logo.png` with your logo link or replace the current logo image without yours and rename it to `logo.png`

```html
<!-- Logo -->
<h1 id="logo">
    <a href="#"><img src="./assets/logo.png" alt="Your Logo"></a>
</h1>
```

### 2. Navigation Links
```html
<ul class="nav-menu">
   <li><a class="nav-link" href="#">PROJECTS</a></li>
   <li><a class="nav-link" href="#">CONTACT</a></li>
   <li><a class="nav-link" href="#">BlOG</a></li>
   <li><a class="nav-link btn btn-primary" href="#">RESUME <i class="fas fa-arrow-right"></i></a>
   </li>     
</ul>
```
Replace the `#` symbol with your respective link. Delete any `nav-link` that is not being used or edit the name with your own preffered link source.
- The Last navigation link is the highlightd yellow button on the template. Which is styled with the `btn` & `btn-primary` classes.

## Styling
We are using plain `CSS` for this project and you can find that in the `template/css/` folder
- Style.css is the main file
- utilities.css is where reusable styling will be. 

## Sponsor
<div>
  <a href="https://www.buymeacoffee.com/evavic44">
    <img width="150px" alt="bmc-button" src="https://user-images.githubusercontent.com/62628408/127788747-8850d386-fc61-4fff-b18f-8c5ee597be34.png">
  </a>
<img width="150px" height="100%" src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#white">
</div>

If you like this project, kindly star ⭐ and share this project. It means the world to us.
You can also offer support by donating to keep this project going.
