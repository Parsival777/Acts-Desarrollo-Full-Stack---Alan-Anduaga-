const API_URL = '/api';


async function registrar() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) return alert("Llena ambos campos");

    const res = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        document.getElementById('mensaje').innerText = '¡Registrado! Ahora inicia sesión.';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        document.getElementById('mensaje').innerText = 'Error: El usuario tal vez ya existe.';
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('mensaje').innerText = 'Usuario o contraseña incorrectos';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}


async function cargarReparaciones() {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'index.html';

    const res = await fetch(`${API_URL}/reparaciones`, {
        method: 'GET',
        headers: { 
            'Authorization': token,
            'Cache-Control': 'no-cache' 
        }
    });

    if (res.ok) {
        const data = await res.json();
        const lista = document.getElementById('listaReparaciones');
        lista.innerHTML = '';
        
        if (data.length === 0) {
            lista.innerHTML = '<li style="text-align:center; color:#777;">No hay órdenes pendientes.</li>';
            return;
        }

        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><b>${item.vehiculo}</b>: ${item.descripcion}</span>
                <div>
                    <button class="edit-btn" onclick="editar(${item.id}, '${item.descripcion}')">✎</button>
                    <button class="delete-btn" onclick="eliminar(${item.id})">X</button>
                </div>
            `;
            lista.appendChild(li);
        });
    } else {
        
        alert("Tu sesión expiró o el usuario no existe. Inicia sesión de nuevo.");
        logout();
    }
}

async function agregarReparacion() {
    const vehiculo = document.getElementById('vehiculo').value;
    const descripcion = document.getElementById('descripcion').value;
    const token = localStorage.getItem('token');

    if (!vehiculo || !descripcion) return alert("Faltan datos del vehículo");

    const res = await fetch(`${API_URL}/reparaciones`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': token 
        },
        body: JSON.stringify({ vehiculo, descripcion })
    });

    if (res.ok) {
        
        document.getElementById('vehiculo').value = '';
        document.getElementById('descripcion').value = '';
        
        cargarReparaciones();
    } else {
        alert("Error al guardar la orden.");
    }
}

async function editar(id, textoActual) {
    const nueva = prompt("Editar descripción:", textoActual);
    if (!nueva || nueva === textoActual) return;

    await fetch(`${API_URL}/reparaciones/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token') 
        },
        body: JSON.stringify({ descripcion: nueva })
    });
    cargarReparaciones();
}

async function eliminar(id) {
    if (!confirm("¿Eliminar esta orden?")) return;
    
    await fetch(`${API_URL}/reparaciones/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': localStorage.getItem('token') }
    });
    cargarReparaciones();
}


if (window.location.pathname.includes('dashboard.html')) {
    cargarReparaciones();
}

