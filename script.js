// Modal handling
const modal = document.getElementById('authModal');
const modalTitle = document.getElementById('modalTitle');
const authForm = document.getElementById('authForm');
const modalContent = document.querySelector('.modal-body');
const modalClose = document.querySelector('.modal-close');

// Form templates
const loginTemplate = `
    <form id="authForm" class="auth-form">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required autocomplete="username">
            <span class="error-message"></span>
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
                <input type="password" id="password" name="password" required autocomplete="current-password">
                <button type="button" class="toggle-password" aria-label="Toggle password visibility">
                    <i class="fas fa-eye" aria-hidden="true"></i>
                </button>
            </div>
            <span class="error-message"></span>
        </div>

        <button type="submit" class="btn btn-primary btn-full">Login</button>
    </form>
    <p class="auth-switch">Don't have an account? <button type="button" class="btn-link" onclick="switchForm('signup')">Sign Up</button></p>
`;

const signupTemplate = `
    <form id="authForm" class="auth-form">
        <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" required autocomplete="name">
            <span class="error-message"></span>
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required autocomplete="email">
            <span class="error-message"></span>
        </div>

        <div class="form-group">
            <label for="newUsername">Username</label>
            <input type="text" id="newUsername" name="username" required autocomplete="username">
            <span class="error-message"></span>
        </div>

        <div class="form-group">
            <label for="newPassword">Password</label>
            <div class="password-input">
                <input type="password" id="newPassword" name="password" required autocomplete="new-password"
                       pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                       title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters">
                <button type="button" class="toggle-password" aria-label="Toggle password visibility">
                    <i class="fas fa-eye" aria-hidden="true"></i>
                </button>
            </div>
            <span class="error-message"></span>
        </div>

        <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input">
                <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password">
                <button type="button" class="toggle-password" aria-label="Toggle password visibility">
                    <i class="fas fa-eye" aria-hidden="true"></i>
                </button>
            </div>
            <span class="error-message"></span>
        </div>

        <button type="submit" class="btn btn-primary btn-full">Sign Up</button>
    </form>
    <p class="auth-switch">Already have an account? <button type="button" class="btn-link" onclick="switchForm('login')">Login</button></p>
`;

// Open modal function
function openModal(type = 'login') {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    switchForm(type);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Add escape key listener
    document.addEventListener('keydown', handleEscapeKey);
}

// Close modal function
function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscapeKey);
}

// Handle escape key
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Switch between login and signup forms
function switchForm(type) {
    modalTitle.textContent = type === 'login' ? 'Login to Your Account' : 'Create an Account';
    modalContent.innerHTML = type === 'login' ? loginTemplate : signupTemplate;
    
    // Reinitialize password toggle functionality
    initializePasswordToggles();
    
    // Initialize form validation
    const form = document.getElementById('authForm');
    initializeFormValidation(form, type);
}

// Initialize password toggle functionality
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form validation
function initializeFormValidation(form, type) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(form, type)) {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate API call
            console.log(`${type} submission:`, data);
            
            // Show success message
            showMessage('success', `${type === 'login' ? 'Login' : 'Registration'} successful!`);
            
            // Close modal after short delay
            setTimeout(closeModal, 2000);
        }
    });

    // Real-time validation
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const errorElement = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    field.classList.remove('invalid');
    errorElement.textContent = '';

    // Required field validation
    if (!field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        // Specific field validations
        switch (field.type) {
            case 'email':
                if (!isValidEmail(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (field.id === 'newPassword' && !isValidPassword(field.value)) {
                    isValid = false;
                    errorMessage = 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers';
                }
                break;
        }

        // Confirm password validation
        if (field.id === 'confirmPassword') {
            const password = document.getElementById('newPassword');
            if (field.value !== password.value) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            }
        }
    }

    if (!isValid) {
        field.classList.add('invalid');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

// Validate entire form
function validateForm(form, type) {
    let isValid = true;
    const fields = form.querySelectorAll('input');

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Utility functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}

// Show message function
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    modalContent.insertBefore(messageDiv, modalContent.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize close button
    modalClose.addEventListener('click', closeModal);
    
    // Initialize form if modal is open
    if (modal.getAttribute('aria-hidden') === 'false') {
        initializePasswordToggles();
        initializeFormValidation(document.getElementById('authForm'), 'login');
    }
});




// Category data
const categories = [
    {
        id: 'fiction',
        title: 'Fiction',
        description: 'Explore worlds of imagination through novels, short stories, and poetry.',
        bookCount: 2547,
        readersCount: 15234,
        image: '/api/placeholder/800/450', // Using placeholder image
        color: 'category-fiction'
    },
    {
        id: 'non-fiction',
        title: 'Non-Fiction',
        description: 'Discover real-world knowledge, biographies, and educational content.',
        bookCount: 3126,
        readersCount: 18965,
        image: '/api/placeholder/800/450',
        color: 'category-non-fiction'
    },
    {
        id: 'science',
        title: 'Science',
        description: 'Journey through scientific discoveries, research, and theories.',
        bookCount: 1845,
        readersCount: 12453,
        image: '/api/placeholder/800/450',
        color: 'category-science'
    },
    {
        id: 'technology',
        title: 'Technology',
        description: 'Stay updated with the latest in technology, programming, and digital innovation.',
        bookCount: 2234,
        readersCount: 16789,
        image: '/api/placeholder/800/450',
        color: 'category-technology'
    },
    {
        id: 'art',
        title: 'Art & Design',
        description: 'Immerse yourself in visual arts, design principles, and creative inspiration.',
        bookCount: 1567,
        readersCount: 9876,
        image: '/api/placeholder/800/450',
        color: 'category-art'
    },
    {
        id: 'history',
        title: 'History',
        description: 'Travel through time with historical accounts, civilizations, and cultural heritage.',
        bookCount: 1982,
        readersCount: 11234,
        image: '/api/placeholder/800/450',
        color: 'category-history'
    }
];

// Function to format numbers
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Function to create category cards
function createCategoryCards() {
    const categoriesGrid = document.querySelector('.categories-grid');
    
    categories.forEach(category => {
        const card = document.createElement('article');
        card.className = `category-card ${category.color}`;
        
        card.innerHTML = `
            <img src="${category.image}" 
                 alt="${category.title} category" 
                 class="category-image"
                 loading="lazy">
            <div class="category-content">
                <h3 class="category-title">${category.title}</h3>
                <p class="category-description">${category.description}</p>
                <div class="category-stats">
                    <span class="stat">
                        <i class="fas fa-book"></i>
                        ${formatNumber(category.bookCount)} Books
                    </span>
                    <span class="stat">
                        <i class="fas fa-users"></i>
                        ${formatNumber(category.readersCount)} Readers
                    </span>
                </div>
            </div>
            <a href="/categories/${category.id}" 
               class="category-link" 
               aria-label="Explore ${category.title} category">
               Explore ${category.title}
            </a>
        `;
        
        categoriesGrid.appendChild(card);
    });
}

// Initialize category cards when DOM is loaded
document.addEventListener('DOMContentLoaded', createCategoryCards);

// Optional: Add intersection observer for animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Add animation to cards after they're created
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.3s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});