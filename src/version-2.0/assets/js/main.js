// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  preloader.style.display = 'none';
});

// Back to top button
document.addEventListener('DOMContentLoaded', function() {
  let backtotop = document.querySelector('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    window.addEventListener('scroll', toggleBacktotop);
  }
});

// Navbar
  document.addEventListener('DOMContentLoaded', function () {
      var hamburgerIcon = document.getElementById('hamburger-icon');
      var mobileNavbar = document.querySelector('.mobile-navbar');

      hamburgerIcon.addEventListener('click', function () {
          mobileNavbar.classList.toggle('active');

          // Toggle between hamburger and close icon
          if (mobileNavbar.classList.contains('active')) {
              hamburgerIcon.classList.remove('fa-bars-staggered');
              hamburgerIcon.classList.add('fa-times');
              mobileNavbar.style.display = 'block'; // Display the mobile navbar
          } else {
              hamburgerIcon.classList.remove('fa-times');
              hamburgerIcon.classList.add('fa-bars-staggered');
              mobileNavbar.style.display = 'none'; // Hide the mobile navbar
          }
      });
  });

// Hero Type Effect
  document.addEventListener("DOMContentLoaded", function() {
      const typedSpan = document.querySelector('.typed');
      if (typedSpan) {
          let typedStrings = typedSpan.getAttribute('data-typed-items');
          typedStrings = typedStrings.split(',');
          new Typed('.typed', {
              strings: typedStrings,
              loop: true,
              typeSpeed: 100,
              backSpeed: 50,
              backDelay: 2000
          });
      }
  });

// Example starter JavaScript for disabling form submissions if there are invalid fields
  (() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  
// Animation on scroll
  document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  });
// Dark Theme
  document.addEventListener("DOMContentLoaded", function() {
    const modeToggles = document.querySelectorAll(".fa-solid.fa-moon");
    const body = document.body;
    const logo = document.getElementById("logo");
  
    // Check if dark mode is active in localStorage
    const darkModeActive = localStorage.getItem("darkMode") === "true";
    if (darkModeActive) {
      body.classList.add("dark-mode");
      modeToggles.forEach(function(toggle) {
        toggle.classList.remove("fa-moon");
        toggle.classList.add("fa-sun");
      });
      logo.src = "assets/images/logo-white.png";
    }
  
    modeToggles.forEach(function(modeToggle) {
      modeToggle.addEventListener("click", function() {
        // Toggle dark mode class on the body
        body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
  
        // Toggle moon and sun icons based on dark mode status
        modeToggles.forEach(function(toggle) {
          if (toggle.classList.contains("fa-moon")) {
            toggle.classList.remove("fa-moon");
            toggle.classList.add("fa-sun");
          } else {
            toggle.classList.remove("fa-sun");
            toggle.classList.add("fa-moon");
          }
        });
  
        // Update image source based on dark mode status
        if (body.classList.contains("dark-mode")) {
          logo.src = "assets/images/logo-white.png";
        } else {
          logo.src = "assets/images/logo-black.png";
        }
      });
    });
  });
  

  
  
  

  
  
  