  document.addEventListener('DOMContentLoaded', function() {
        // تهيئة الجزيئات المتحركة
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // تعيين مواقع عشوائية
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // تعيين تأثير حركة عشوائي
            const duration = Math.random() * 30 + 20;
            particle.style.animation = `float ${duration}s infinite ease-in-out`;
        });
        
        // تأثير تمرير الصفحة
        const scrollElements = document.querySelectorAll('.animate__animated');
        const elementInView = (el, percentageScroll = 100) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= 
                ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
            );
        };
        
        const displayScrollElement = (element) => {
            element.classList.add('animate__fadeIn');
        };
        
        const hideScrollElement = (element) => {
            element.classList.remove('animate__fadeIn');
        };
        
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 100)) {
                    displayScrollElement(el);
                } else {
                    hideScrollElement(el);
                }
            });
        }
        
        window.addEventListener('scroll', () => {
            handleScrollAnimation();
        });
    });
