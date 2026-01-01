// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navList = document.querySelector('.nav-list');

mobileToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileToggle.innerHTML = navList.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && !e.target.closest('.mobile-toggle')) {
        navList.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Gallery View Toggle
const viewBtns = document.querySelectorAll('.view-btn');
const galleryGrid = document.querySelector('.gallery-grid');

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        viewBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Change gallery layout based on view
        const view = btn.dataset.view;
        
        switch(view) {
            case 'grid':
                galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
                galleryGrid.style.gridAutoRows = '200px';
                break;
            case 'masonry':
                galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
                galleryGrid.style.gridAutoRows = '150px';
                break;
            case 'list':
                galleryGrid.style.gridTemplateColumns = '1fr';
                galleryGrid.style.gridAutoRows = '300px';
                break;
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            navList.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        
        // Simple validation
        if (emailInput.value && emailInput.value.includes('@')) {
            // Show success state
            submitBtn.innerHTML = '<i class="fas fa-check"></i>';
            submitBtn.style.backgroundColor = '#28a745';
            
            // Reset after 2 seconds
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                submitBtn.style.backgroundColor = '';
                emailInput.value = '';
            }, 2000);
        } else {
            // Show error state
            emailInput.style.borderColor = '#dc3545';
            setTimeout(() => {
                emailInput.style.borderColor = '';
            }, 2000);
        }
    });
}

// Pricing Card Hover Effect Enhancement
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        if (!img.src) {
            imageObserver.observe(img);
        }
    });
});

// Dynamic Year in Footer
const yearSpan = document.querySelector('#current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Responsive Image Handling
function handleResponsiveImages() {
    const screenWidth = window.innerWidth;
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        if (screenWidth < 768) {
            img.style.objectFit = 'cover';
        } else {
            img.style.objectFit = 'contain';
        }
    });
}

// Initial call
handleResponsiveImages();

// Listen for window resize
window.addEventListener('resize', handleResponsiveImages);

// Add CSS Grid overlay for debugging (remove in production)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'g') {
        document.body.classList.toggle('show-grid-overlay');
    }
});

// Add CSS for grid overlay
const style = document.createElement('style');
style.textContent = `
    .show-grid-overlay .gallery-grid > * {
        outline: 1px solid rgba(255, 0, 0, 0.3);
        background: rgba(0, 255, 0, 0.1);
    }
    
    .show-grid-overlay .blog-grid > * {
        outline: 1px solid rgba(0, 0, 255, 0.3);
        background: rgba(255, 255, 0, 0.1);
    }
`;
document.head.appendChild(style);

// Initialize
console.log('Flexbox & Grid Demo initialized successfully!');