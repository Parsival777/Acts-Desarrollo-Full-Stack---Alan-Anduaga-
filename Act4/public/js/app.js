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

const titulosPilotoInput = document.getElementById('titulosPiloto');
const estadoPilotoInput = document.getElementById('estadoPiloto');

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
                mostrarMensaje('¡Acceso concedido! Entrando al Paddock...', '#10B981');
                setTimeout(() => mostrarDashboard(), 1000);
            } else {
                mostrarMensaje('¡Credenciales registradas! Ahora inicia sesión.', '#3B82F6');
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
    mostrarMensaje('Sesión finalizada.', 'var(--text-muted)');
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
        numero: parseInt(numeroPilotoInput.value),
        titulos: parseInt(titulosPilotoInput.value),
        estado: estadoPilotoInput.value
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
            titulosPilotoInput.value = '';
            estadoPilotoInput.value = 'Activo';
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
    if (!confirm('¿Retirar piloto de la parrilla?')) return;
    
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
        pilotosList.innerHTML = '<tr><td colspan="6" style="text-align:center;">Parrilla vacía.</td></tr>';
        return;
    }

    pilotos.forEach(piloto => {
        const tr = document.createElement('tr');
        
        
        const estadoColor = piloto.estado === 'Activo' ? '#10B981' : '#D50000';
        
        tr.innerHTML = `
            <td style="font-weight: 600;">${piloto.nombre}</td>
            <td style="color: var(--text-muted);">${piloto.escuderia}</td>
            <td><span style="background: var(--light-bg); padding: 4px 8px; border-radius: 4px; font-weight:600;">${piloto.numero}</span></td>
            <td>🏆 ${piloto.titulos || 0}</td>
            <td style="color: ${estadoColor}; font-weight: 600; font-size: 0.85rem;">${piloto.estado || 'Activo'}</td>
            <td>
                <button onclick="eliminarPiloto('${piloto._id}')" class="btn btn-secondary" style="padding: 6px 10px; margin: 0; font-size: 12px; border-color: var(--border-color); color: var(--primary-red);">Retirar</button>
            </td>
        `;
        pilotosList.appendChild(tr);
    });
}

function logoutForzado() {
    alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
    document.getElementById('logoutBtn').click();
}
