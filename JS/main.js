

// ============================= NAV LIST OPEN & CLOSE LOGIC =========================================
const nav = document.querySelector('nav');
const navMenu = document.querySelector('.nav_Menu');
const navOpen = document.getElementById('nav_list_open');
const navClose = document.getElementById('nav_list_close');


navOpen.addEventListener('click', () => {navMenu.classList.replace('max-md:right-[-120%]', 'max-md:right-0')});
navClose.addEventListener('click', () => {navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]')});
window.addEventListener('click', (e) => {
    if(!nav.contains(e.target)){
        navMenu.classList.replace('max-md:right-0', 'max-md:right-[-120%]')
        return;
    }
    return;
})