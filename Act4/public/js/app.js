const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');

const authForm = document.getElementById('authForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const messageDiv = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');

const pilotoForm = document.getElementById('pilotoForm');
const nombrePilotoInput = document.getElementById('nombrePiloto');
const escuderiaPilotoInput = document.getElementById('escuderiaPiloto');
const numeroPilotoInput = document.getElementById('numeroPiloto');
const pilotosList = document.getElementById('pilotosList');

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        mostrarDashboard();
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarAuth('/api/auth/login');
});

registerBtn.addEventListener('click', async () => {
    if(!usernameInput.value || !passwordInput.value) {
        mostrarMensaje('Llena ambos campos para registrarte.', 'red');
        return;
    }
    await procesarAuth('/api/auth/register');
});

async function procesarAuth(url) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: usernameInput.value, 
                password: passwordInput.value 
            })
        });

        const data = await response.json();

        if (response.ok) {
            if (url.includes('login')) {
                localStorage.setItem('token', data.token);
                mostrarMensaje('¡Acceso concedido! Entrando al Paddock...', '#28a745');
                setTimeout(() => mostrarDashboard(), 1000);
            } else {
                mostrarMensaje('¡Credenciales registradas! Ahora inicia sesión.', '#007bff');
            }
        } else {
            mostrarMensaje(data.error || 'Acceso denegado', 'red');
        }
    } catch (error) {
        mostrarMensaje('Error de conexión con los servidores', 'red');
    }
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    usernameInput.value = '';
    passwordInput.value = '';
    mostrarMensaje('Sesión finalizada. Hasta la próxima carrera.', 'white');
});

function mostrarMensaje(texto, color) {
    messageDiv.style.color = color;
    messageDiv.innerText = texto;
}

function mostrarDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    obtenerPilotos();
}

pilotoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const nuevoPiloto = {
        nombre: nombrePilotoInput.value,
        escuderia: escuderiaPilotoInput.value,
        numero: parseInt(numeroPilotoInput.value)
    };

    try {
        const response = await fetch('/api/pilotos', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(nuevoPiloto)
        });

        if (response.ok) {
            nombrePilotoInput.value = '';
            escuderiaPilotoInput.value = '';
            numeroPilotoInput.value = '';
            obtenerPilotos();
        } else {
            if(response.status === 401) return logoutForzado();
            alert('Error al registrar piloto.');
        }
    } catch (error) {
        console.error(error);
    }
});

async function obtenerPilotos() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('/api/pilotos', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const pilotos = await response.json();
            renderizarTabla(pilotos);
        } else if (response.status === 401) {
            logoutForzado();
        }
    } catch (error) {
        console.error(error);
    }
}

async function eliminarPiloto(id) {
    if (!confirm('¿Estás seguro de retirar a este piloto de la parrilla?')) return;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`/api/pilotos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            obtenerPilotos();
        } else {
            if(response.status === 401) return logoutForzado();
            alert('Error al eliminar piloto.');
        }
    } catch (error) {
        console.error(error);
    }
}

function renderizarTabla(pilotos) {
    pilotosList.innerHTML = '';
    
    if (pilotos.length === 0) {
        pilotosList.innerHTML = '<tr><td colspan="4" style="text-align:center;">Parrilla vacía. ¡Agrega un piloto!</td></tr>';
        return;
    }

    pilotos.forEach(piloto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold;">${piloto.nombre}</td>
            <td style="color: #aaa;">${piloto.escuderia}</td>
            <td><span style="background: var(--f1-red); padding: 2px 8px; border-radius: 4px; font-weight:bold;">${piloto.numero}</span></td>
            <td>
                <button onclick="eliminarPiloto('${piloto._id}')" class="btn btn-secondary" style="padding: 5px 10px; margin: 0; font-size: 12px; border-color: red; color: red;">Retirar</button>
            </td>
        `;
        pilotosList.appendChild(tr);
    });
}

function logoutForzado() {
    alert('Tu pase VIP ha expirado. Por favor, inicia sesión nuevamente.');
    document.getElementById('logoutBtn').click();
}
