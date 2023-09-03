const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLink = document.querySelectorAll('.nav-link');

const handleMobileMenu = () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
};

hamburger.addEventListener('click', handleMobileMenu);

// close the mobile menu when clicked on a nav link
navLink.forEach((n) => n.addEventListener('click', handleMobileMenu));

// Event Listeners: Handling toggle event
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

//  toggle background color / theme
const switchTheme = () => {
  if (toggleSwitch.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark'); //add this
    return;
  }

  document.documentElement.setAttribute('data-theme', 'light');
  localStorage.setItem('theme', 'light'); //add this
};

toggleSwitch.addEventListener('change', switchTheme, false);

// get the currentTheme from local storage or null if there isn't one

const currentTheme = localStorage.getItem('theme') || null;

const setTheme = function () {
  // if there's no current theme in local storage || null, quickly exit this function
  if (!currentTheme) return;

  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
  }
};

setTheme();

//Adding date

let myDate = document.querySelector('#datee');

const yes = new Date().getFullYear();
myDate.innerHTML = yes;
