document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DEL MENÚ RESPONSIVE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');

    if (menuToggle && nav) {
        // ... (Tu código del menú responsive sin cambios) ...
    }

    // --- LÓGICA DEL CARRITO DE COMPRAS ---

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartIconContainer = document.getElementById('cart-icon-container');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalHeader = document.getElementById('cart-total-header');
    const cartTotalSidebar = document.getElementById('cart-total-sidebar');
    const checkoutBtn = document.getElementById('checkout-btn');
    const overlay = document.getElementById('overlay');
    
    let cart = [];

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Tu carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.classList.add('cart-item');
                const itemTotal = (item.price * item.quantity).toFixed(2);
                const imageSrc = item.image || 'https://via.placeholder.com/70';

                cartItemElement.innerHTML = `
                    <img src="${imageSrc}" alt="${item.name}">
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

    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalFormatted = `S/${total.toFixed(2)}`;
        if (cartTotalHeader) {
            cartTotalHeader.textContent = totalFormatted;
        }
        if (cartTotalSidebar) {
            cartTotalSidebar.textContent = totalFormatted;
        }
    }

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

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    function toggleCart() {
        if (cartSidebar && overlay) {
            cartSidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        }
    }
    
    // --> NUEVO: Función para mostrar el feedback visual
    function showFeedback(button) {
        // 1. Cambiar el texto y estilo del botón
        const originalText = button.textContent;
        button.textContent = "¡Añadido!";
        button.classList.add('added');

        // 2. Hacer temblar el ícono del carrito
        if (cartIconContainer) {
            cartIconContainer.classList.add('shaking');
        }

        // 3. Volver todo a la normalidad después de un tiempo
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('added');
            if (cartIconContainer) {
                cartIconContainer.classList.remove('shaking');
            }
        }, 1500); // 1.5 segundos
    }


    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;
            
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const imageElement = card.querySelector('img');
            const image = imageElement ? imageElement.src : '';

            addToCart(id, name, price, image);
            
            // --> NUEVO: Llamar a la función de feedback visual
            showFeedback(e.target);
        });
    });

    if (cartIconContainer) cartIconContainer.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);
    
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item-btn')) {
                const id = e.target.dataset.id;
                removeFromCart(id);
            }
        });
    }

    if (cart.length === 0) {
            alert('Tu carrito está vacío. Añade productos antes de continuar.');
            return; // Detiene la ejecución si no hay nada que comprar
        }

        // 1. Prepara el mensaje del pedido
        let mensajePedido = "¡Hola! Quisiera hacer el siguiente pedido desde la página web:\n\n";
        
        cart.forEach(item => {
            mensajePedido += `*Producto:* ${item.name}\n`;
            mensajePedido += `*Cantidad:* ${item.quantity}\n`;
            mensajePedido += `*Precio:* S/${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        mensajePedido += `*TOTAL DEL PEDIDO: S/${total.toFixed(2)}*\n\n`;
        mensajePedido += "Por favor, confírmame los métodos de pago y los detalles para la entrega. ¡Gracias!";

        // 2. Codifica el mensaje para que funcione en una URL
        const mensajeCodificado = encodeURIComponent(mensajePedido);

        // 3. Crea el enlace de WhatsApp y redirige al usuario
        // ¡IMPORTANTE! Reemplaza '51987654321' con TU número de WhatsApp (con el código de país)
        const tuNumeroDeWhatsapp = '51987382581'; // Ya lo tenías en tu botón flotante
        const urlWhatsapp = `https://wa.me/${tuNumeroDeWhatsapp}?text=${mensajeCodificado}`;

        // Abre el enlace en una nueva pestaña
        window.open(urlWhatsapp, '_blank');

        // Opcional: limpiar el carrito después de enviar el pedido
        cart = [];
        renderCart();
        toggleCart();
    });

