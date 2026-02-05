const API_URL = 'http://localhost:3000/api';

async function registrar() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    
    if (!username || !password) {
        alert("Por favor llena ambos campos");
        return;
    }

    const res = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        document.getElementById('mensaje').innerText = 'Usuario creado, ahora inicia sesión.';
    } else {
        const text = await res.text();
        document.getElementById('mensaje').innerText = text;
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert("Por favor llena ambos campos");
        return;
    }

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
        document.getElementById('mensaje').innerText = 'Error de credenciales';
    }
}

async function cargarReparaciones() {
    const token = localStorage.getItem('token'); 
    
    if (!token) return;

    const res = await fetch(`${API_URL}/reparaciones`, {
        method: 'GET',
        headers: { 
            'Authorization': token 
        }
    });

    if (res.ok) {
        const data = await res.json();
        const lista = document.getElementById('listaReparaciones');
        lista.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span><b>${item.vehiculo}</b>: ${item.descripcion}</span>
                <button class="delete-btn" onclick="eliminar(${item.id})">X</button>
            `;
            lista.appendChild(li);
        });
    } else {
        console.log("Error al cargar reparaciones, posiblemente token vencido");
    }
}

async function agregarReparacion() {
    const vehiculo = document.getElementById('vehiculo').value;
    const descripcion = document.getElementById('descripcion').value;
    const token = localStorage.getItem('token');

    if (!vehiculo || !descripcion) {
        alert("Llena los datos del vehículo");
        return;
    }

    await fetch(`${API_URL}/reparaciones`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': token 
        },
        body: JSON.stringify({ vehiculo, descripcion })
    });
    
    // Limpiar campos después de agregar
    document.getElementById('vehiculo').value = '';
    document.getElementById('descripcion').value = '';
    
    cargarReparaciones();
}

async function eliminar(id) {
    const token = localStorage.getItem('token');
    if(confirm("¿Seguro que quieres borrar esta orden?")) {
        await fetch(`${API_URL}/reparaciones/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        cargarReparaciones();
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}


if (window.location.pathname.includes('dashboard.html')) {
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
    } else {
        cargarReparaciones();
    }
}