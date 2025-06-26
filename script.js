document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA DEL MENÚ RESPONSIVE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('header nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
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
        if (cartTotalHeader) { cartTotalHeader.textContent = totalFormatted; }
        if (cartTotalSidebar) { cartTotalSidebar.textContent = totalFormatted; }
    }

    function addToCart(productId, productName, productPrice, productImage) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) { existingItem.quantity++; } 
        else {
            cart.push({
                id: productId, name: productName, price: productPrice,
                image: productImage, quantity: 1
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
    
    function showFeedback(button) {
        const originalText = button.textContent;
        button.textContent = "¡Añadido!";
        button.classList.add('added');
        if (cartIconContainer) { cartIconContainer.classList.add('shaking'); }
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('added');
            if (cartIconContainer) { cartIconContainer.classList.remove('shaking'); }
        }, 1500);
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

    // =========================================================================
    // === ESTE ES EL LUGAR CORRECTO PARA LA LÓGICA DEL BOTÓN DE PAGO ===
    // =========================================================================
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            
            console.log("Botón 'Proceder al Pago' presionado.");

            if (cart.length === 0) {
                console.log("El carrito está vacío. Mostrando alerta.");
                alert('Tu carrito está vacío. Añade productos antes de continuar.');
                return;
            }
            
            console.log("El carrito tiene productos. Preparando el mensaje...");

            let mensajePedido = "¡Hola! Quisiera hacer el siguiente pedido desde la página web:\n\n";
            cart.forEach(item => {
                mensajePedido += `*Producto:* ${item.name}\n`;
                mensajePedido += `*Cantidad:* ${item.quantity}\n`;
                mensajePedido += `*Precio:* S/${(item.price * item.quantity).toFixed(2)}\n\n`;
            });

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            mensajePedido += `*TOTAL DEL PEDIDO: S/${total.toFixed(2)}*\n\n`;
            mensajePedido += "Por favor, confírmame los métodos de pago y los detalles para la entrega. ¡Gracias!";

            const mensajeCodificado = encodeURIComponent(mensajePedido);
            const tuNumeroDeWhatsapp = '51987382581';
            const urlWhatsapp = `https://wa.me/${tuNumeroDeWhatsapp}?text=${mensajeCodificado}`;

            console.log("URL de WhatsApp generada:", urlWhatsapp);
            
            window.open(urlWhatsapp, '_blank').focus();
            console.log("Intento de abrir nueva pestaña de WhatsApp.");

            setTimeout(() => {
                console.log("Limpiando el carrito.");
                cart = [];
                renderCart();
                toggleCart();
            }, 3000); 

        });
    }
    // =================================================================
// === LÓGICA PARA EL FORMULARIO DE CONTACTO CON FORMSPREE (AJAX) ===
// =================================================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status'); // El script intenta encontrar el elemento aquí

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const form = e.target;
        const data = new FormData(form);
        
        // --- MEJORA: Comprueba si el elemento de estado existe ---
        if (formStatus) {
            formStatus.innerHTML = 'Enviando...';
            formStatus.className = '';
        }
        
        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // --- MEJORA: Comprueba de nuevo antes de usar ---
                if (formStatus) {
                    formStatus.innerHTML = "¡Gracias! Tu mensaje ha sido enviado correctamente.";
                    formStatus.classList.add('success');
                }
                form.reset(); 
            } else {
                response.json().then(data => {
                    let errorMessage = "Oops! Hubo un problema al enviar tu formulario.";
                    if (Object.hasOwn(data, 'errors')) {
                        errorMessage = data["errors"].map(error => error["message"]).join(", ");
                    }
                    // --- MEJORA: Comprueba de nuevo antes de usar ---
                    if (formStatus) {
                        formStatus.innerHTML = errorMessage;
                        formStatus.classList.add('error');
                    }
                })
            }
        }).catch(error => {
            // --- MEJORA: Comprueba de nuevo antes de usar ---
            if (formStatus) {
                formStatus.innerHTML = "Oops! Hubo un problema con la conexión.";
                formStatus.classList.add('error');
            }
        });
    });
}
    // El código que tenías al final ha sido eliminado de aquí.

    // Inicializar el renderizado del carrito al cargar la página
    renderCart();
}); // <-- FIN DEL document.addEventListener
