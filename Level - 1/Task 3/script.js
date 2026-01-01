// DOM Elements
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const openModalBtn = document.getElementById('openModalBtn');
const heroModalBtn = document.getElementById('heroModalBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const demoModal = document.getElementById('demoModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeModalBtn2 = document.getElementById('closeModalBtn2');
const modalActionBtn = document.getElementById('modalActionBtn');
const modalFeedback = document.getElementById('modalFeedback');
const startDemoBtn = document.getElementById('startDemoBtn');
const counterValue = document.getElementById('counterValue');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const resetBtn = document.getElementById('resetBtn');
const doubleBtn = document.getElementById('doubleBtn');
const halfBtn = document.getElementById('halfBtn');
const randomBtn = document.getElementById('randomBtn');
const registrationForm = document.getElementById('registrationForm');
const clearFormBtn = document.getElementById('clearFormBtn');
const formFeedback = document.getElementById('formFeedback');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const closeToastBtn = document.getElementById('closeToastBtn');
const showToastBtn = document.getElementById('showToastBtn');
const backToTopBtn = document.getElementById('backToTopBtn');
const currentImage = document.getElementById('currentImage');
const imageCounter = document.getElementById('imageCounter');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const thumbnails = document.querySelectorAll('.thumbnail');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.getElementById('strengthText');

// State Variables
let counter = 0;
let currentImageIndex = 0;
const images = [
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
];

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Toggle dropdown menu on mobile
        if (link.classList.contains('dropdown-toggle')) {
            const dropdown = link.parentElement.querySelector('.dropdown-menu');
            if (window.innerWidth <= 768) {
                dropdown.classList.toggle('active');
            }
        }
    });
});

// Modal Functions
function openModal() {
    demoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalFeedback.classList.remove('show');
}

function closeModal() {
    demoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Modal Event Listeners
openModalBtn.addEventListener('click', openModal);
heroModalBtn.addEventListener('click', openModal);
startDemoBtn.addEventListener('click', openModal);

closeModalBtn.addEventListener('click', closeModal);
closeModalBtn2.addEventListener('click', closeModal);

// Close modal when clicking outside
demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
        closeModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal.classList.contains('active')) {
        closeModal();
    }
});

// Modal Action Button
modalActionBtn.addEventListener('click', () => {
    modalFeedback.textContent = 'Button clicked! Thanks for interacting with the modal.';
    modalFeedback.classList.add('show');
    modalFeedback.style.color = '#155724';
    modalFeedback.style.backgroundColor = '#d4edda';
    modalFeedback.style.border = '1px solid #c3e6cb';
});

// Theme Toggle
toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    const isDark = document.body.classList.contains('dark-theme');
    showToast(isDark ? 'Dark theme activated!' : 'Light theme activated!');
});

// Counter Functions
function updateCounter() {
    counterValue.textContent = counter;
    counterValue.style.color = counter > 0 ? '#2ecc71' : counter < 0 ? '#e74c3c' : '#4a6fa5';
}

incrementBtn.addEventListener('click', () => {
    counter++;
    updateCounter();
});

decrementBtn.addEventListener('click', () => {
    counter--;
    updateCounter();
});

resetBtn.addEventListener('click', () => {
    counter = 0;
    updateCounter();
    showToast('Counter reset to zero!');
});

doubleBtn.addEventListener('click', () => {
    counter *= 2;
    updateCounter();
});

halfBtn.addEventListener('click', () => {
    counter = Math.round(counter / 2);
    updateCounter();
});

randomBtn.addEventListener('click', () => {
    counter = Math.floor(Math.random() * 1000) - 500;
    updateCounter();
    showToast(`Random value: ${counter}`);
});

// Form Validation
function validateName() {
    const name = document.getElementById('name').value.trim();
    const error = document.getElementById('nameError');
    
    if (name.length < 2) {
        error.textContent = 'Name must be at least 2 characters';
        return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        error.textContent = 'Name can only contain letters and spaces';
        return false;
    }
    
    error.textContent = '';
    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value.trim();
    const error = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        error.textContent = 'Email is required';
        return false;
    }
    
    if (!emailRegex.test(email)) {
        error.textContent = 'Please enter a valid email address';
        return false;
    }
    
    error.textContent = '';
    return true;
}

function validatePassword() {
    const password = document.getElementById('password').value;
    const error = document.getElementById('passwordError');
    
    if (password.length < 8) {
        error.textContent = 'Password must be at least 8 characters';
        updatePasswordStrength(0);
        return false;
    }
    
    let strength = 0;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength++;
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength++;
    // Check for numbers
    if (/[0-9]/.test(password)) strength++;
    // Check for special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    updatePasswordStrength(strength);
    
    if (strength < 2) {
        error.textContent = 'Password is too weak';
        return false;
    }
    
    error.textContent = '';
    return true;
}

function updatePasswordStrength(strength) {
    const width = strength * 25;
    let color = '#e74c3c';
    let text = 'Weak';
    
    if (strength === 2) {
        color = '#f39c12';
        text = 'Fair';
    } else if (strength === 3) {
        color = '#3498db';
        text = 'Good';
    } else if (strength === 4) {
        color = '#2ecc71';
        text = 'Strong';
    }
    
    strengthBar.style.width = `${width}%`;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Password strength: ${text}`;
    strengthText.style.color = color;
}

function validatePhone() {
    const phone = document.getElementById('phone').value.trim();
    const error = document.getElementById('phoneError');
    
    if (phone && !/^[\d\s\-\(\)]+$/.test(phone)) {
        error.textContent = 'Please enter a valid phone number';
        return false;
    }
    
    error.textContent = '';
    return true;
}

function validateTerms() {
    const terms = document.getElementById('terms').checked;
    const error = document.getElementById('termsError');
    
    if (!terms) {
        error.textContent = 'You must agree to the terms and conditions';
        return false;
    }
    
    error.textContent = '';
    return true;
}

// Real-time form validation
document.getElementById('name').addEventListener('input', validateName);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('password').addEventListener('input', validatePassword);
document.getElementById('phone').addEventListener('input', validatePhone);
document.getElementById('terms').addEventListener('change', validateTerms);

// Form Submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isPhoneValid = validatePhone();
    const isTermsValid = validateTerms();
    
    if (isNameValid && isEmailValid && isPasswordValid && isPhoneValid && isTermsValid) {
        formFeedback.textContent = 'Form submitted successfully!';
        formFeedback.className = 'form-feedback success';
        formFeedback.style.display = 'block';
        
        showToast('Form submitted successfully!');
        
        // Reset form after 2 seconds
        setTimeout(() => {
            registrationForm.reset();
            formFeedback.style.display = 'none';
            updatePasswordStrength(0);
        }, 2000);
    } else {
        formFeedback.textContent = 'Please fix the errors above before submitting.';
        formFeedback.className = 'form-feedback error';
        formFeedback.style.display = 'block';
    }
});

// Clear Form
clearFormBtn.addEventListener('click', () => {
    registrationForm.reset();
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    formFeedback.style.display = 'none';
    updatePasswordStrength(0);
    showToast('Form cleared!');
});

// Image Gallery
function updateGallery() {
    currentImage.src = images[currentImageIndex];
    imageCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    
    // Update active thumbnail
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateGallery();
});

nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateGallery();
});

// Thumbnail click events
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        currentImageIndex = index;
        updateGallery();
    });
});

// Toast Notification Functions
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

closeToastBtn.addEventListener('click', () => {
    toast.classList.remove('show');
});

showToastBtn.addEventListener('click', () => {
    showToast('This is a demo toast notification!');
});

// Back to Top
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Keyboard navigation for gallery
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateGallery();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateGallery();
    }
});

// Initialize
updateCounter();
updateGallery();

// Show welcome toast on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        showToast('Welcome to the JavaScript Interactive Demo! Try all the features.');
    }, 1000);
});