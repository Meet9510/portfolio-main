// Run when page loads
window.onload = function() {
  
  // Navbar scroll effect
  var navbar = document.getElementById('navbar');
  
  window.onscroll = function() {
    if (window.pageYOffset > 50) {
      if (!navbar.classList.contains('scrolled')) {
        navbar.classList.add('scrolled');
      }
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  // Mobile Hamburger Menu
  var hamburger = document.getElementById('hamburger-menu');
  var menu = document.getElementById('menu');
  
  if (hamburger && menu) {
    hamburger.onclick = function(e) {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      menu.classList.toggle('active');
    };
    
    // Close menu when a link inside is clicked
    var menuLinks = menu.getElementsByTagName('a');
    for (var i = 0; i < menuLinks.length; i++) {
      menuLinks[i].onclick = function() {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      };
    }
    
    // Close menu when clicking outside
    document.onclick = function(e) {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      }
    };
  }
  
  // Portfolio grid layout - display block only (columns handled by CSS)
  var grid = document.querySelector('.portfolio-grid');
  if (grid) {
    grid.style.display = 'block';
  }
  
  // Smooth scroll for portfolio links
  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].href.indexOf('#Portfolio') > -1) {
      links[i].onclick = function(e) {
        e.preventDefault();
        var section = document.getElementById('Portfolio');
        if (section) {
          section.scrollIntoView({behavior: 'smooth'});
        }
        hamburger.classList.remove('active');
        menu.classList.remove('active');
      };
    }
  }
  
  // Scroll to portfolio if in URL
  if (window.location.hash == '#Portfolio') {
    var section = document.getElementById('Portfolio');
    if (section) {
      section.scrollIntoView({behavior: 'smooth'});
    }
  }
};
