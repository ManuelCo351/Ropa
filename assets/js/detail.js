/* ==============================================
   LÓGICA DEL DETALLE DE PRODUCTO (CON GOOGLE SHEETS)
   ============================================== */

// Variable para guardar el talle seleccionado
let talleSeleccionado = null;

// Esta función se ejecuta cuando products.js termina de descargar los datos
window.loadProductDetail = () => {
    // 1. Buscamos el ID en la URL (ej: product.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) return; // Si no hay ID, no hacemos nada

    // 2. Buscamos el producto en la lista que trajo Google
    // Usamos '==' para que el "1" (texto) coincida con el 1 (número)
    const product = window.products.find(p => p.id == id);

    if (!product) {
        document.getElementById('product-title').innerText = "Producto no encontrado";
        return;
    }

    // 3. Rellenamos la página con los datos reales
    
    // Título
    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.innerText = product.name;

    // Precio
    const priceEl = document.getElementById('product-price');
    if (priceEl) {
        priceEl.innerText = new Intl.NumberFormat('es-AR', {
            style: 'currency', currency: 'ARS', minimumFractionDigits: 0
        }).format(product.price);
    }

    // Imagen Principal
    const imgEl = document.getElementById('main-img');
    if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
    }

    // Breadcrumb (La ruta arriba: Inicio / Hoodies / Nombre)
    const breadName = document.getElementById('bread-name');
    const breadCat = document.getElementById('bread-category');
    if (breadName) breadName.innerText = product.name;
    if (breadCat) breadCat.innerText = product.category || 'Colección';

    // 4. Lógica de los Talles (Botones S, M, L, XL)
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        const talle = btn.innerText; // "S", "M", etc.
        const stockDisponible = product.stock[talle];

        // Si no hay stock (0), desactivamos el botón
        if (!stockDisponible || stockDisponible <= 0) {
            btn.classList.add('disabled');
            btn.style.opacity = "0.3";
            btn.style.cursor = "not-allowed";
        } else {
            // Si hay stock, permitimos clickear
            btn.onclick = () => {
                // Sacar clase 'selected' a los otros
                sizeBtns.forEach(b => b.classList.remove('selected'));
                // Poner 'selected' a este
                btn.classList.add('selected');
                talleSeleccionado = talle;
            };
        }
    });

    // 5. Configurar el Botón "AGREGAR AL CARRITO"
    const addBtn = document.querySelector('.btn-add-cart');
    if (addBtn) {
        // Clonamos el botón para borrar eventos viejos
        const newBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newBtn, addBtn);

        newBtn.onclick = () => {
            // Validar que eligió talle
            if (!talleSeleccionado) {
                alert("⚠️ Por favor, seleccioná un talle.");
                return;
            }

            // Validar cantidad (del input)
            const inputQty = document.querySelector('.quantity-selector input');
            const cantidad = inputQty ? parseInt(inputQty.value) : 1;

            // Armar el objeto para el carrito
            const itemParaCarrito = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: cantidad,
                size: talleSeleccionado
            };

            // Llamar a la función del carrito (está en cart.js)
            if (typeof addToCart === 'function') {
                addToCart(itemParaCarrito);
            } else {
                console.error("No encuentro la función addToCart");
            }
        };
    }
};

// Lógica extra: Selector de cantidad (+ y -)
const btnMinus = document.querySelector('.quantity-selector button:first-child');
const btnPlus = document.querySelector('.quantity-selector button:last-child');
const inputQty = document.querySelector('.quantity-selector input');

if (btnMinus && btnPlus && inputQty) {
    btnMinus.onclick = () => {
        let val = parseInt(inputQty.value);
        if (val > 1) inputQty.value = val - 1;
    };
    btnPlus.onclick = () => {
        let val = parseInt(inputQty.value);
        inputQty.value = val + 1;
    };
    }
               
