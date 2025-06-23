document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('menu-mobile'); 
    const navLinks = document.querySelector('.tautan-nav'); 

    
    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('aktif'); 
    });

    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('aktif')) { 
                navLinks.classList.remove('aktif');
            }
        });
    });

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});