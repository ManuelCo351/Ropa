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
       5. LÓGICA DEL SHOP (Renderizado y Filtros)
       ============================================== */
    
    const productsContainer = document.getElementById("products-container");
    const filterBtns = document.querySelectorAll(".filter-btn");

    // A. Función para dar formato de precio argentino ($ 25.000)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    // B. Función Principal: Pintar los productos en pantalla
    function renderProducts(listaProductos) {
        // 1. Limpiamos el contenedor por si tenía cosas viejas
        if (!productsContainer) return; // Protección por si no estamos en la home
        productsContainer.innerHTML = "";

        // 2. Si no hay productos (ej: filtro vacío), mostramos mensaje
        if (listaProductos.length === 0) {
            productsContainer.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1/-1;">No hay productos en esta categoría aún.</p>`;
            return;
        }

        // 3. Recorremos la lista y creamos el HTML de cada uno
        listaProductos.forEach(producto => {
            
            // Lógica para la etiqueta "NUEVO"
            const etiquetaNuevo = producto.nuevo 
                ? '<span class="badge-new">NUEVO</span>' 
                : '';

            // Lógica para las cuotas (si es null no muestra nada)
            const etiquetaCuotas = producto.cuotas 
                ? `<span class="product-installments">${producto.cuotas}</span>` 
                : '';

            // Construimos la tarjeta usando Template Strings (``)
            const tarjetaHTML = `
                <div class="product-card reveal-text active" onclick="window.location.href='product.html?id=${producto.id}'">
                    <div class="card-image">
                        ${etiquetaNuevo}
                        <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${producto.nombre}</h3>
                        <p class="product-price">${formatPrice(producto.precio)}</p>
                        ${etiquetaCuotas}
                    </div>
                </div>
            `;

            // Inyectamos la tarjeta en el contenedor
            productsContainer.innerHTML += tarjetaHTML;
        });
    }

    // C. Inicialización: Cargar todo al principio
    // Verificamos que la variable 'productos' (del otro archivo) exista
    if (typeof productos !== 'undefined') {
        renderProducts(productos);
    } else {
        console.error("No se encontró el archivo products.js");
    }

    // D. Lógica de los Botones de Filtro
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // 1. Efecto visual: Sacar clase 'active' a todos y ponerla al clickeado
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // 2. Leer qué categoría quiere el usuario
            const categoriaSeleccionada = btn.getAttribute("data-filter");

            // 3. Filtrar el array de productos
            if (categoriaSeleccionada === "todos") {
                renderProducts(productos); // Mostrar todo
            } else {
                // Crear nueva lista solo con esa categoría
                const filtrados = productos.filter(p => p.categoria === categoriaSeleccionada);
                renderProducts(filtrados);
            }
        });
    });

