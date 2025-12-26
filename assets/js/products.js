// ==========================================
// CONEXIÓN CON GOOGLE SHEETS (BASE DE DATOS)
// ==========================================

// Tu link real de Google Sheets (Publicado como CSV)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbnEh19rwIV-ksZZBaez6Ma_XpGtSYEkz_NSOLOvrczFTkQMdn7MB4rSPDLhTBazGXfOavA4c2zq4z/pub?output=csv';

// Lista global donde se guardarán los productos
window.products = [];

// Función para optimizar imágenes (WebP)
const imgAPI = (ruta) => {
    if (!ruta) return 'assets/img/placeholder.jpg'; // Imagen por defecto si falta
    if (ruta.startsWith('http')) return ruta; // Si ya es un link completo, dejarlo así
    const dominio = 'https://hijo-prodigo.vercel.app/'; 
    return `https://wsrv.nl/?url=${dominio}${ruta}&output=webp&q=80`;
};

// Función maestra que descarga y procesa los datos
function cargarProductos() {
    console.log("Iniciando descarga de productos...");
    return new Promise((resolve) => {
        Papa.parse(SHEET_URL, {
            download: true,
            header: true, // Usa la fila 1 como nombres de variables
            dynamicTyping: true, // Convierte números automáticamente
            complete: function(results) {
                // Transformamos los datos del Excel al formato de tu web
                window.products = results.data
                    .filter(row => row.id) // Ignoramos filas vacías
                    .map(row => ({
                        id: row.id,
                        name: row.name,
                        price: row.price,
                        image: imgAPI(row.image),
                        category: row.category,
                        // Stock inteligente leyendo tus columnas
                        stock: {
                            S: row.stock_s || 0,
                            M: row.stock_m || 0,
                            L: row.stock_l || 0,
                            XL: row.stock_xl || 0
                        }
                    }));
                
                console.log("✅ Inventario cargado:", window.products);
                
                // AVISAR A LA PÁGINA QUE LOS DATOS LLEGARON
                // Si estamos en el inicio (catálogo), actualizar la vista
                if (typeof renderShop === 'function') renderShop();
                
                // Si estamos en el detalle de producto, actualizar la info
                if (typeof loadProductDetail === 'function') loadProductDetail();

                resolve(window.products);
            },
            error: function(err) {
                console.error("❌ Error al leer Google Sheet:", err);
            }
        });
    });
}

// Arrancamos la carga apenas se lee el archivo
cargarProductos();
