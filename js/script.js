document.addEventListener('DOMContentLoaded', () => {

    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // =========================================================================
    // Navbar Scroll Effect
    // =========================================================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =========================================================================
    // Mobile Menu Toggle
    // =========================================================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        hamburger.classList.toggle('toggle');
        mobileMenu.classList.toggle('active');
        // Prevent scrolling when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // =========================================================================
    // Smooth Scrolling for Anchor Links
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================================
    // Scroll Animations (Intersection Observer)
    // =========================================================================
    const animationSelectors = ['.fade-in', '.slide-up'];
    const elementsToAnimate = document.querySelectorAll(animationSelectors.join(', '));

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    // =========================================================================
    // Dynamic Project Filtering
    // =========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // If filter is 'all' or matches the card's category, show it
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    // Small hack to re-trigger animation for filtered items
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null;
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // =========================================================================
    // Form Validation
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            // Validate Name
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
            }

            // Validate Email
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('error');
            }

            // Validate Message
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('error');
            }

            // If all valid, submit the form via invisible iframe to prevent redirect
            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';

                // Create an invisible iframe if it doesn't exist
                let iframe = document.getElementById('hidden-iframe');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.name = 'hidden-iframe';
                    iframe.id = 'hidden-iframe';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }

                // Target the form submission to the hidden iframe
                contactForm.target = 'hidden-iframe';

                // When iframe loads, we assume the submission was complete
                iframe.onload = () => {
                    successMsg.style.display = 'block';
                    successMsg.style.color = '#43e97b';
                    successMsg.style.background = 'rgba(67, 233, 123, 0.1)';
                    successMsg.style.borderColor = 'rgba(67, 233, 123, 0.2)';
                    successMsg.textContent = 'Message sent successfully!';
                    contactForm.reset();

                    submitBtn.textContent = originalBtnText;

                    // Hide message after 5 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                };

                // Actually submit the form letting the browser navigate inside the iframe
                contactForm.submit();
            }
        });

        // Remove error states on input
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('error');
            });
        });
    }
});
