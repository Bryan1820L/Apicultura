document.addEventListener('DOMContentLoaded', function() {

    // =======================================================
    // --- LÓGICA DEL MENÚ RESPONSIVE (TU CÓDIGO ORIGINAL) ---
    // =======================================================

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) { // Verificamos que los elementos existan
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            // Cambiar icono de hamburguesa a X y viceversa
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                menuToggle.setAttribute('aria-label', 'Cerrar menú');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-label', 'Abrir menú');
            }
        });

        // Opcional: Cerrar menú al hacer clic en un enlace (para SPAs o anclas)
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });
    }


    // ====================================================
    // --- LÓGICA DEL CARRITO DE COMPRAS (CÓDIGO NUEVO) ---
    // ====================================================

    // 1. Selección de elementos del DOM para el carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartIconContainer = document.getElementById('cart-icon-container');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalHeader = document.getElementById('cart-total-header');
    const cartTotalSidebar = document.getElementById('cart-total-sidebar');
    const checkoutBtn = document.getElementById('checkout-btn');
    const overlay = document.getElementById('overlay');
    
    // 2. Estado del carrito (nuestra base de datos en memoria)
    let cart = [];

    // 3. Funciones del carrito

    // Función para RENDERIZAR (dibujar) el carrito en el panel
    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                const itemTotal = (item.price * item.quantity).toFixed(2);

                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Cantidad: ${item.quantity}</p>
                        <p class="cart-item-price">S/${itemTotal}</p>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">×</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        updateCartTotal();
    }

    // Función para ACTUALIZAR los totales
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalFormatted = `S/${total.toFixed(2)}`;
        
        cartTotalHeader.textContent = totalFormatted;
        cartTotalSidebar.textContent = totalFormatted;
    }

    // Función para AÑADIR un producto al carrito
    function addToCart(productId, productName, productPrice, productImage) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        renderCart();
    }

    // Función para QUITAR un producto del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // Función para ABRIR Y CERRAR el panel del carrito
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    // 4. Event Listeners del carrito (Escuchar las acciones del usuario)

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const image = card.querySelector('img').src;

            addToCart(id, name, price, image);
        });
    });

    cartIconContainer.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    overlay.addEventListener('click', toggleCart);
    
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const id = e.target.dataset.id;
            removeFromCart(id);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Procesando pago... (función de demostración)');
            cart = [];
            renderCart();
            toggleCart();
        } else {
            alert('No hay productos en tu carrito para pagar.');
        }
    });
    
    // 5. Inicialización del carrito
    renderCart();
});
