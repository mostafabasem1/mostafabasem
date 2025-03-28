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
