// main.js
// Generar estrellas y corazones flotantes dinámicamente
function createFloatingElements() {
    const svg = document.querySelector('.floating-svg');
    if (!svg) return;
    // Estrellas
    for (let i = 0; i < 30; i++) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        star.setAttribute('cx', Math.random() * window.innerWidth);
        star.setAttribute('cy', Math.random() * window.innerHeight);
        star.setAttribute('r', Math.random() * 2 + 1);
        star.setAttribute('fill', '#fff');
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.classList.add('svg-star-dyn');
        svg.appendChild(star);
    }
    // Corazones
    for (let i = 0; i < 10; i++) {
        const heart = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 18 + 12;
        heart.setAttribute('d', `M${x} ${y} C${x} ${y-10}, ${x+size} ${y-10}, ${x+size} ${y} C${x+size} ${y+10}, ${x} ${y+20}, ${x} ${y} Z`);
        heart.setAttribute('fill', '#ff4d8d');
        heart.style.animationDelay = `${Math.random() * 6}s`;
        heart.classList.add('svg-heart-dyn');
        svg.appendChild(heart);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    createFloatingElements();
});
        // Elementos del DOM
        const letterClosed = document.getElementById('letterClosed');
        const letterExpanded = document.getElementById('letterExpanded');
        const heartButton = document.getElementById('heartButton');
        const closeBtn = document.getElementById('closeBtn');
        const modal = document.getElementById('modal');
        const modalImage = document.getElementById('modalImage');
        const modalVideo = document.getElementById('modalVideo');
        const modalClose = document.getElementById('modalClose');

        // Abrir carta expandida
        function openExpandedLetter() {
            letterClosed.style.opacity = '0';
            letterClosed.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                letterClosed.style.display = 'none';
                letterExpanded.classList.add('show');
                closeBtn.classList.add('show');
                
                // Configurar observer después de un breve delay
                setTimeout(() => {
                    setupIntersectionObserver();
                }, 100);
            }, 500);
        }

        // Cerrar todo
        function closeEverything() {
            letterExpanded.classList.remove('show');
            closeBtn.classList.remove('show');
            
            // Limpiar observer
            if (window.observer) {
                window.observer.disconnect();
            }
            
            // Pausar todos los videos
            const videos = document.querySelectorAll('video');
            videos.forEach(video => video.pause());
            
            setTimeout(() => {
                letterClosed.style.display = 'flex';
                letterClosed.style.opacity = '1';
                letterClosed.style.transform = 'scale(1)';
            }, 500);
        }

        // Configurar Intersection Observer
        function setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Si es un video, iniciarlo
                        const video = entry.target.querySelector('video');
                        if (video) {
                            video.play().catch(e => console.log('Video autoplay prevented:', e));
                        }
                    } else {
                        // Si es un video, pausarlo cuando sale de vista
                        const video = entry.target.querySelector('video');
                        if (video) {
                            video.pause();
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            // Observar todos los elementos
            const allElements = document.querySelectorAll('.text-card, .instagram-card, .signature-section');
            allElements.forEach(element => {
                observer.observe(element);
            });
            
            window.observer = observer;
        }

        // Abrir modal
        function openModal(src, type) {
            modal.classList.add('show');
            modalImage.style.display = 'none';
            modalVideo.style.display = 'none';
            
            if (type === 'image') {
                modalImage.src = src;
                modalImage.style.display = 'block';
            } else {
                modalVideo.src = src;
                modalVideo.style.display = 'block';
            }
        }

        // Cerrar modal
        function closeModal() {
            modal.classList.remove('show');
            modalVideo.pause();
        }

        // Event listeners para elementos de galería
        document.addEventListener('DOMContentLoaded', () => {
            const mediaElements = document.querySelectorAll('.instagram-media img, .instagram-media video');
            mediaElements.forEach(element => {
                element.addEventListener('click', () => {
                    if (element.tagName === 'IMG') {
                        openModal(element.src, 'image');
                    } else {
                        openModal(element.src, 'video');
                    }
                });
            });
        });

        // Event listeners principales
        heartButton.addEventListener('click', openExpandedLetter);
        closeBtn.addEventListener('click', closeEverything);
        modalClose.addEventListener('click', closeModal);

        // Cerrar modal al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (letterExpanded.classList.contains('show')) {
                if (e.key === 'Escape') {
                    closeEverything();
                }
            }
        });
