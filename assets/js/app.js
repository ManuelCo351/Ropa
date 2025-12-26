document.addEventListener("DOMContentLoaded", () => {
    
    /* ==============================================
       1. VARIABLES & SELECTORES
       ============================================== */
    const header = document.querySelector(".main-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navWrapper = document.querySelector(".nav-wrapper");
    const body = document.body;

    /* ==============================================
       2. MENÚ MÓVIL (Abrir / Cerrar)
       ============================================== */
    menuToggle.addEventListener("click", () => {
        // Alternamos la clase 'mobile-menu-open' en el header
        header.classList.toggle("mobile-menu-open");
        
        // Bloqueamos el scroll del body si el menú está abierto
        if (header.classList.contains("mobile-menu-open")) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflow = "auto";
        }
    });

    // Cerrar menú al tocar un link (UX importante)
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            header.classList.remove("mobile-menu-open");
            body.style.overflow = "auto";
        });
    });

    /* ==============================================
       3. EFECTO SCROLL EN HEADER
       ============================================== */
    window.addEventListener("scroll", () => {
        // Si bajamos más de 50px, agregamos la clase .scrolled
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* ==============================================
       4. ANIMACIONES DE ENTRADA (Scroll Reveal)
       ============================================== */
    // Configuramos el "Ojo" del navegador (Intersection Observer)
    const observerOptions = {
        threshold: 0.1, // Se activa cuando se ve el 10% del elemento
        rootMargin: "0px 0px -50px 0px" // Margen inferior para que active un poco antes
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregamos la clase .active para que el CSS haga la transición
                entry.target.classList.add("active");
                // Dejamos de observar para que no se repita la animación
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Buscamos todos los elementos que tengan la clase .reveal-text
    const hiddenElements = document.querySelectorAll(".reveal-text");
    hiddenElements.forEach(el => observer.observe(el));
});

/* ==============================================
   5. LÓGICA DEL SHOP (Renderizado y Filtros - VERSIÓN GOOGLE SHEETS)
   ============================================== */

// Esta función se llama desde products.js cuando llegan los datos
window.renderShop = (filtro = 'todos') => {
    const container = document.getElementById('products-container');
    const filterBtns = document.querySelectorAll(".filter-btn");
    
    // Si no estamos en el inicio, no hacemos nada
    if (!container) return;

    // 1. Limpiamos
    container.innerHTML = "";

    // 2. Filtramos la lista global 'window.products'
    let productosAmostrar = window.products;

    if (filtro !== 'todos') {
        // Filtramos comparando la categoría del Excel (en minúscula)
        productosAmostrar = window.products.filter(p => 
            p.category && p.category.toLowerCase() === filtro.toLowerCase()
        );
    }

    // 3. Si no hay nada, mensaje de error
    if (productosAmostrar.length === 0) {
        container.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1/-1; padding: 40px;">Cargando productos o categoría vacía...</p>`;
        return;
    }

    // 4. Dibujamos las tarjetas
    productosAmostrar.forEach(product => {
        // Calculamos precio bonito
        const precioFormateado = new Intl.NumberFormat('es-AR', {
            style: 'currency', currency: 'ARS', minimumFractionDigits: 0
        }).format(product.price);

        const cardHTML = `
            <article class="product-card reveal-text active">
                <a href="product.html?id=${product.id}" class="product-link">
                    <div class="img-container">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="price-row">
                            <span class="price">${precioFormateado}</span>
                        </div>
                        <span class="installments">3 cuotas sin interés</span>
                    </div>
                </a>
            </article>
        `;
        container.innerHTML += cardHTML;
    });

    // 5. Reactivamos los botones de filtro (solo la primera vez)
    // Esto evita agregar el evento click mil veces
    if (!window.filtersInitialized) {
        filterBtns.forEach(btn => {
            btn.onclick = (e) => {
                // Sacar clase active a todos
                filterBtns.forEach(b => b.classList.remove("active"));
                // Poner active al clickeado
                e.target.classList.add("active");
                // Renderizar con el nuevo filtro
                const categoria = e.target.getAttribute("data-filter");
                window.renderShop(categoria);
            };
        });
        window.filtersInitialized = true;
    }
};
