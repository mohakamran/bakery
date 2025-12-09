// Premium Bakery Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS with enhanced settings
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-in-out',
        mirror: true
    });

    // Slider functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-white', i === index);
            dot.classList.toggle('bg-white/50', i !== index);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Initialize slider
    if (slides.length > 0) {
        showSlide(0);
        
        // Auto-advance slides
        setInterval(nextSlide, 5000);
        
        // Manual slide control
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.lg:hidden button');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            console.log('Mobile menu clicked');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Progress bar functionality
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = (window.scrollY / documentHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Search bar functionality
    const searchBtn = document.getElementById('searchBtn');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const navMenu = document.getElementById('navMenu');
    const searchBarContainer = document.getElementById('searchBarContainer');
    
    if (searchBtn && searchBarContainer && navMenu) {
        searchBtn.addEventListener('click', function() {
            // Hide nav menu and show search bar
            navMenu.classList.add('hidden');
            searchBarContainer.classList.remove('hidden');
            searchBtn.classList.add('hidden');
            
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        });
    }
    
    if (closeSearch && searchBarContainer && navMenu) {
        closeSearch.addEventListener('click', function() {
            // Hide search bar and show nav menu
            searchBarContainer.classList.add('hidden');
            navMenu.classList.remove('hidden');
            searchBtn.classList.remove('hidden');
            searchInput.value = '';
        });
    }
    
    // Cart dropdown functionality
    const cartBtn = document.getElementById('cartBtn');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    let cart = [];
    
    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cartDropdown.classList.toggle('opacity-0');
            cartDropdown.classList.toggle('invisible');
            cartDropdown.classList.toggle('opacity-100');
            cartDropdown.classList.toggle('visible');
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartDropdown && !cartDropdown.contains(e.target) && e.target !== cartBtn) {
            cartDropdown.classList.add('opacity-0', 'invisible');
            cartDropdown.classList.remove('opacity-100', 'visible');
        }
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('button');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            if (button.textContent.includes('Add to Cart')) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get product info
                    const card = this.closest('.group');
                    if (card) {
                        const title = card.querySelector('h4')?.textContent || 'Product';
                        const priceText = card.querySelector('.text-2xl')?.textContent || '$0';
                        const price = parseFloat(priceText.replace('$', ''));
                        
                        // Add to cart
                        const existingItem = cart.find(item => item.title === title);
                        if (existingItem) {
                            existingItem.quantity++;
                        } else {
                            cart.push({
                                title: title,
                                price: price,
                                quantity: 1
                            });
                        }
                        
                        updateCart();
                        
                        // Show notification
                        showNotification(`${title} added to cart!`);
                    }
                });
            }
        });
    }
    
    function updateCart() {
        if (!cartItems || !cartCount || !cartTotal) return;
        
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartCount.textContent = totalItems;
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-chocolate/50 text-center py-8">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="flex items-center justify-between py-2 border-b border-chocolate/10">
                    <div>
                        <h4 class="font-semibold text-chocolate text-sm">${item.title}</h4>
                        <p class="text-chocolate/50 text-xs">$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <span class="text-primary font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Testimonials slider functionality
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevTestimonialBtn = document.querySelector('.prev-testimonial');
    const nextTestimonialBtn = document.querySelector('.next-testimonial');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length;
        showTestimonial(currentTestimonial);
    }
    
    // Initialize testimonials slider
    if (testimonialSlides.length > 0) {
        showTestimonial(0);
        
        // Auto-advance testimonials
        setInterval(nextTestimonial, 5000);
        
        // Manual testimonial controls
        if (prevTestimonialBtn) {
            prevTestimonialBtn.addEventListener('click', prevTestimonial);
        }
        if (nextTestimonialBtn) {
            nextTestimonialBtn.addEventListener('click', nextTestimonial);
        }
    }

    // Event type selection functionality
    const eventTypeButtons = document.querySelectorAll('.event-type-btn');
    if (eventTypeButtons.length > 0) {
        eventTypeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active state from all buttons
                eventTypeButtons.forEach(btn => {
                    btn.classList.remove('bg-gradient-warm', 'text-white', 'border-transparent');
                    btn.classList.add('border-chocolate/20', 'text-chocolate');
                });
                
                // Add active state to clicked button
                this.classList.remove('border-chocolate/20', 'text-chocolate');
                this.classList.add('bg-gradient-warm', 'text-white', 'border-transparent');
                
                // Show feedback
                const selectedEvent = this.textContent;
                console.log('Selected event type:', selectedEvent);
                
                // You could update a hidden input field or show a confirmation
                const confirmation = document.createElement('div');
                confirmation.className = 'mt-2 p-2 bg-green-100 text-green-700 rounded-lg text-sm';
                confirmation.textContent = `Event type "${selectedEvent}" selected!`;
                
                // Remove any existing confirmation
                const existingConfirmation = this.parentElement.parentElement.querySelector('.bg-green-100');
                if (existingConfirmation) {
                    existingConfirmation.remove();
                }
                
                // Add new confirmation
                this.parentElement.parentElement.appendChild(confirmation);
                
                // Remove confirmation after 3 seconds
                setTimeout(() => {
                    confirmation.remove();
                }, 3000);
            });
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing with: ' + email);
                this.reset();
            }
        });
    }
});