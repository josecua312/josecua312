document.addEventListener('DOMContentLoaded', function () {
    // ELEMENTOS MODALES
    const showAuthModalBtn = document.getElementById('show-auth-modal');
    const authModal = document.getElementById('auth-modal');
    const closeAuthModalBtn = document.getElementById('close-auth-modal');
    const showAdminLoginBtn = document.getElementById('show-admin-login-modal');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLoginBtn = document.getElementById('close-admin-login-modal');

    showAuthModalBtn?.addEventListener('click', () => authModal.classList.add('show'));
    closeAuthModalBtn?.addEventListener('click', () => authModal.classList.remove('show'));
    showAdminLoginBtn?.addEventListener('click', () => adminLoginModal.classList.add('show'));
    closeAdminLoginBtn?.addEventListener('click', () => adminLoginModal.classList.remove('show'));

    // CAMBIO ENTRE LOGIN Y REGISTRO
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    showRegister?.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';

        // Asignar el evento de crear cuenta dinámicamente
        const btnCrearCuenta = document.getElementById('btn-crear-cuenta');
        btnCrearCuenta?.removeEventListener('click', crearCuentaHandler);
        btnCrearCuenta?.addEventListener('click', crearCuentaHandler);
    });

    showLogin?.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // LOGIN USUARIO
    const btnIngresar = document.getElementById('btn-ingresar');
    btnIngresar?.addEventListener('click', () => {
        const usuario = document.getElementById('login-usuario').value.trim();
        const contrasena = document.getElementById('login-contrasena').value.trim();

        if (!usuario || !contrasena) {
            alert("Completa todos los campos.");
            return;
        }

        fetch('auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=login&usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasena)}`
        })
        .then(res => res.text())
        .then(data => {
            const [status, user, role, correo] = data.split('|');
            if (status === 'ok') {
                localStorage.setItem('usuarioLogueado', user);
                localStorage.setItem('rolUsuario', role);
                localStorage.setItem('correo', correo || '');
                authModal.classList.remove('show');
                showToast(` ¡Bienvenid@, ${user}!🎉`);
                mostrarPerfilFlotante();
            } else {
                alert(role || 'Error al iniciar sesión');
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error al conectar con el servidor.");
        });
    });

    // FUNCION PARA REGISTRO DE USUARIO
    function crearCuentaHandler() {
        const usuario = document.getElementById('nuevo-usuario').value.trim();
        const correo = document.getElementById('nuevo-correo').value.trim();
        const contrasena = document.getElementById('nuevo-contrasena').value.trim();

        if (!usuario || !correo || !contrasena) {
            alert("Completa todos los campos para registrarte.");
            return;
        }

        fetch('auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=register&nuevo_usuario=${encodeURIComponent(usuario)}&nuevo_correo=${encodeURIComponent(correo)}&nuevo_contrasena=${encodeURIComponent(contrasena)}`
        })
        .then(res => res.text())
        .then(data => {
            const partes = data.split('|');
            if (partes[0] === 'ok') {
                localStorage.setItem('usuarioLogueado', partes[1]);
                localStorage.setItem('correo', correo);
                localStorage.setItem('rolUsuario', 'usuario');
                authModal.classList.remove('show');
                showToast(`🎉 ¡Bienvenid@, ${partes[1]}!`);
                mostrarPerfilFlotante();
            } else {
                alert(partes[1] || 'Error al crear la cuenta.');
            }
        })
        .catch(error => {
            alert("Error al conectar con el servidor.");
            console.error("Error al registrar:", error);
        });
    }

    // LOGIN ADMIN
    const btnAdminIngresar = document.getElementById('btn-admin-ingresar');
    btnAdminIngresar?.addEventListener('click', () => {
        const usuario = document.getElementById('admin-login-usuario').value.trim();
        const contrasena = document.getElementById('admin-login-contrasena').value.trim();

        if (!usuario || !contrasena) {
            alert("Completa todos los campos.");
            return;
        }
        console.log("Usuario ingresado:", usuario);
console.log("Contraseña ingresada:", contrasena);

        fetch('admin_auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasena)}`
        })
        .then(res => res.text())
        .then(data => {
            const [status, user, role] = data.split('|');
            if (status === 'ok') {
                localStorage.setItem('usuarioLogueado', user);
                localStorage.setItem('rolUsuario', role);
                adminLoginModal.classList.remove('show');
                showToast(` Welcome, Admin👑 ${user}`);
                mostrarPerfilFlotante();
            } else {
                alert(role || 'Error en login de administrador');
            }
        })
        .catch(error => {
            console.error(error);
            alert("Error al conectar con el servidor.");
        });
    });

    // FUNCION PARA TOAST
    function showToast(msg) {
        const toast = document.getElementById('toast-message');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // PERFIL FLOTANTE
    const toggleProfile = document.getElementById('toggle-profile');
    const profileDropdown = document.getElementById('profile-dropdown');
    const perfilUsuario = document.getElementById('perfil-usuario');
    const perfilCorreo = document.getElementById('perfil-correo');
    const closeDropdown = document.getElementById('cerrar-dropdown');
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');

    toggleProfile?.addEventListener('click', () => {
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    closeDropdown?.addEventListener('click', () => {
        profileDropdown.style.display = 'none';
    });

    cerrarSesionBtn?.addEventListener('click', () => {
    const usuario = localStorage.getItem('usuarioLogueado') || 'usuario';
    const rol = localStorage.getItem('rolUsuario') || 'usuario';

    // Mensaje personalizado para cada tipo de rol
    const mensaje = rol === 'admin'
        ? `👋 El  Admin ${usuario} cerró sesión.`
        : `👋 El usuario !${usuario}¡ ha cerró sesión.`;

    // Mostrar mensaje toast
    showToast(mensaje);

    // Limpiar sesión y recargar
    localStorage.clear();

    setTimeout(() => {
        location.reload();
    }, 2000); // Tiempo para que se vea el mensaje
});



    // Mostrar perfil si hay sesión guardada
    function mostrarPerfilFlotante() {
        const usuario = localStorage.getItem('usuarioLogueado');
        const rol = localStorage.getItem('rolUsuario');
        const correo = localStorage.getItem('correo');

        if (usuario && rol) {
            const userProfile = document.getElementById('user-profile');
            userProfile.style.display = 'block';
            perfilUsuario.textContent = usuario;
            perfilCorreo.textContent = correo || "No registrado";
        }
    }

    // Ejecutar al cargar
    mostrarPerfilFlotante();
});

// Agregar al carrito y mostrar en el modal con cantidades y total
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsList = document.getElementById('cart-items');
const enviarPedidoBtn = document.getElementById('enviar-pedido');
const vaciarCarritoBtn = document.createElement('button');
vaciarCarritoBtn.id = 'vaciar-carrito';
vaciarCarritoBtn.innerText = 'Limpiar';
vaciarCarritoBtn.style.cssText = 'background:#dc3545; color:#fff; border:none; border-radius:6px; padding:10px 18px; margin-top:10px; font-weight:bold; cursor:pointer;';

const cartTotal = document.createElement('p');
cartTotal.id = 'cart-total';
cartTotal.style.cssText = 'margin: 10px 0; font-weight: bold;';

// Insertar total y limpiar antes de enviar y cerrar
const cartContent = document.querySelector('.cart-content');
cartContent.insertBefore(cartTotal, enviarPedidoBtn);
cartContent.insertBefore(vaciarCarritoBtn, enviarPedidoBtn);

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarCarrito() {
    cartItemsList.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.img}" style="width: 50px; vertical-align: middle;"> 
            <strong>${item.name}</strong> x${item.cantidad} - $${item.price.toLocaleString()} c/u
        `;
        cartItemsList.appendChild(li);
        total += item.price * item.cantidad;
    });

    cartTotal.innerText = `Total: $${total.toLocaleString()}`;

    if (carrito.length === 0) {
        cartItemsList.innerHTML = '<p>El carrito está vacío.</p>';
        cartTotal.innerText = '';
    }
}

function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.name === producto.name);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    showToast('Producto agregado al carrito🛒');
}

function showToast(msg) {
    const toast = document.getElementById('toast-message');
    
    // Reset clases
    toast.className = 'toast-message';

    // Agrega clase verde si es éxito
    if (msg.includes('Pedido enviado')) {
        toast.classList.add('toast-success');
    }

    toast.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}


// Capturar clic en botones de producto
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const img = btn.dataset.img;
        agregarAlCarrito({ name, price, img });
    });
});

// Abrir/cerrar modal
cartBtn.addEventListener('click', () => {
    renderizarCarrito();
    cartModal.classList.add('show');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('show');
});

// Vaciar carrito
vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    showToast(' Carrito limpio ');
});

// Enviar pedido (demo)
enviarPedidoBtn.addEventListener('click', () => {
    if (carrito.length === 0) return alert('El carrito está vacío:');
    showToast(' Pedido enviado con éxito ✅');
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    cartModal.classList.remove('show');
});
