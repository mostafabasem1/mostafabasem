 document.addEventListener("DOMContentLoaded", function () {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar-b');

        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop && currentScroll > 100) {
                // التمرير للأسفل: إخفاء القائمة
                navbar.classList.add('hidden');
            } else {
                // التمرير للأعلى: إظهار القائمة
                navbar.classList.remove('hidden');
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // تفادي القيم السالبة
        });
    });
  document.addEventListener('DOMContentLoaded', function() {
        // Floating buttons functionality
        const floatingBtn = document.getElementById('meta-floating-btn');
        const elementsContainer = document.getElementById('meta-elements');
        
        if (floatingBtn && elementsContainer) {
            floatingBtn.addEventListener('click', function() {
                elementsContainer.classList.toggle('active');
                
                if (elementsContainer.classList.contains('active')) {
                    floatingBtn.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    floatingBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
                }
            });
        }
        
        // Close floating menu when clicking outside
        document.addEventListener('click', function(event) {
            if (floatingBtn && elementsContainer && !floatingBtn.contains(event.target) && !elementsContainer.contains(event.target)) {
                elementsContainer.classList.remove('active');
                floatingBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
            }
        });
        
        // Intersection Observer for smooth animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1
        });
        
        document.querySelectorAll('.transition-element').forEach(el => {
            observer.observe(el);
        });
    });
