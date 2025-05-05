// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
  // Set current year in footer
  document.getElementById(
    "current-year"
  ).textContent = new Date().getFullYear();

  // Initialize theme
  initTheme();

  // Mobile menu toggle
  initMobileMenu();

  // Smooth scrolling for anchor links
  initSmoothScrolling();

  // Testimonial Slider
  initTestimonialSlider();

  // Contact form submission
  initContactForm();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize carousel navigation
  initCarouselNavigation();
  
  // Initialize background parallax
  initParallax();
  
  // Nav scroll effect
  initNavScroll();
});

// Theme initialization and toggle
function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const themeIcon = document.getElementById("theme-icon");
  const themeIconMobile = document.getElementById("theme-icon-mobile");

  // Apply theme based on preference
  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add("dark");
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
      themeIconMobile.classList.remove("fa-moon");
      themeIconMobile.classList.add("fa-sun");
    } else {
      document.documentElement.classList.remove("dark");
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
      themeIconMobile.classList.remove("fa-sun");
      themeIconMobile.classList.add("fa-moon");
    }
  }

  // Toggle theme function
  function toggleTheme() {
    if (document.documentElement.classList.contains("dark")) {
      // Switch to light theme
      applyTheme(false);
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark theme
      applyTheme(true);
      localStorage.setItem("theme", "dark");
    }
  }

  // Check for saved theme preference or use user's system preference
  const prefersDark = localStorage.getItem("theme") === "dark" || 
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  applyTheme(prefersDark);

  // Theme toggle click handlers
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleMobile.addEventListener("click", toggleTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches);
    }
  });
}

// Mobile menu initialization
function initMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    // Add slide animation when showing menu
    if (!mobileMenu.classList.contains("hidden")) {
      const menuItems = mobileMenu.querySelectorAll("a");
      menuItems.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateX(20px)";
        setTimeout(() => {
          item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
        }, 100 * index);
      });
    }
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });
}

// Smooth scrolling initialization
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const yOffset = -70; // Adjust for fixed header
        const y =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    });
  });
}

// Testimonial slider initialization
function initTestimonialSlider() {
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");
  let currentSlide = 0;

  function showSlide(index) {
    testimonialSlides.forEach(slide => {
      slide.classList.remove("active");
    });

    dots.forEach(dot => {
      dot.classList.remove("bg-green-200", "dark:bg-green-700");
      dot.classList.add("bg-gray-300", "dark:bg-gray-600");
    });

    testimonialSlides[index].classList.add("active");
    dots[index].classList.remove("bg-gray-300", "dark:bg-gray-600");
    dots[index].classList.add("bg-green-200", "dark:bg-green-700");

    // Update slide container position
    const container = document.querySelector(".testimonial-container");
    container.style.transform = `translateX(-${index * 100}%)`;
  }

  // Auto-rotate testimonials
  let testimonialInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
  }, 5000);

  // Manual navigation with dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(testimonialInterval);
      currentSlide = index;
      showSlide(currentSlide);

      // Restart auto-rotation after manual navigation
      testimonialInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
      }, 5000);
    });
  });
  
  // Add swipe support for testimonials on mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const testimonialElement = document.querySelector('.testimonial-slider');
  
  if (testimonialElement) {
    testimonialElement.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    testimonialElement.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);
    
    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // Swipe left, next slide
        clearInterval(testimonialInterval);
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
      }
      if (touchEndX > touchStartX + 50) {
        // Swipe right, previous slide
        clearInterval(testimonialInterval);
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
      }
      
      // Restart auto-rotation
      testimonialInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
      }, 5000);
    }
  }
}

// Contact form initialization
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    // Add input animations
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      const label = input.previousElementSibling;
      
      // Focus effect
      input.addEventListener('focus', () => {
        label.classList.add('text-green-600', 'dark:text-green-400');
      });
      
      // Blur effect
      input.addEventListener('blur', () => {
        label.classList.remove('text-green-600', 'dark:text-green-400');
      });
    });
    
    // Form submission
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();

      // In a real-world scenario, you would send the form data to a server
      // Here we'll just show a success message

      const name = document.getElementById("name").value;
      const formElements = contactForm.elements;

      // Disable form elements
      for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
      }

      // Replace form with success message
      contactForm.innerHTML = `
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-green-900 animate-pulse">
            <i class="fas fa-check text-green-600 text-2xl dark:text-green-300"></i>
          </div>
          <h3 class="text-xl font-bold mb-2">Thank You, ${name}!</h3>
          <p class="text-gray-600 dark:text-gray-300">Your message has been received. We'll get back to you shortly.</p>
        </div>
      `;
    });
  }
}

// Initialize scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const staggerItems = document.querySelectorAll('.stagger-item');
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
    );
  }
  
  // Function to animate elements when they enter viewport
  function checkAnimations() {
    animatedElements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('visible');
      }
    });
    
    // Staggered animations for grid items
    staggerItems.forEach(item => {
      if (isInViewport(item)) {
        item.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkAnimations();
  
  // Add scroll listener
  window.addEventListener('scroll', checkAnimations);
}

// Initialize carousel navigation
function initCarouselNavigation() {
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const prevBtn = carousel.nextElementSibling?.classList.contains('carousel-nav') ? 
                   carousel.nextElementSibling : null;
    const nextBtn = prevBtn?.nextElementSibling?.classList.contains('carousel-nav') ? 
                   prevBtn.nextElementSibling : null;
    
    if (prevBtn && nextBtn) {
      // Previous button click
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
          left: -carousel.offsetWidth / 2,
          behavior: 'smooth'
        });
      });
      
      // Next button click
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
          left: carousel.offsetWidth / 2,
          behavior: 'smooth'
        });
      });
    }
  });
}

// Initialize parallax effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  function updateParallax() {
    parallaxElements.forEach(element => {
      const scrollPosition = window.pageYOffset;
      const elementTop = element.offsetTop;
      const elementVisible = elementTop - window.innerHeight;
      
      if (scrollPosition > elementVisible) {
        const speed = element.getAttribute('data-speed') || 0.5;
        const yPos = (scrollPosition - elementTop) * speed;
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      }
    });
  }
  
  window.addEventListener('scroll', updateParallax);
  updateParallax();
}

// Initialize scroll effect for navigation
function initNavScroll() {
  const nav = document.querySelector('nav');
  
  function updateNav() {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', updateNav);
  updateNav();
}

// Add to cart animation
function addToCartAnimation(button) {
  button.classList.add('animate-pulse');
  
  // Show added to cart notification
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out';
  notification.innerText = 'Added to cart!';
  document.body.appendChild(notification);
  
  // Remove animation and notification after 2 seconds
  setTimeout(() => {
    button.classList.remove('animate-pulse');
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}
