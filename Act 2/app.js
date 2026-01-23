// CLASE TAREA 
class Tarea {
    constructor(nombre, id = Date.now()) {
        this.id = id;
        this.nombre = nombre;
        this.completada = false;
    }

    // Método para cambiar el estado de completada
    toggleCompletada() {
        this.completada = !this.completada;
    }

    // Método para editar el nombre de la tarea
    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

// CLASE GESTOR DE TAREAS 
class GestorDeTareas {
    constructor() {
        this.tareas = [];
        this.cargarTareasDesdeLocalStorage();
    }

    // Agregar una nueva tarea
    agregarTarea(nombre) {
        const nuevaTarea = new Tarea(nombre);
        this.tareas.push(nuevaTarea);
        this.guardarEnLocalStorage();
        return nuevaTarea;
    }

    // Eliminar una tarea por ID
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== id);
        this.guardarEnLocalStorage();
    }

    // Editar una tarea por ID
    editarTarea(id, nuevoNombre) {
        const tarea = this.tareas.find(tarea => tarea.id === id);
        if (tarea) {
            tarea.editar(nuevoNombre);
            this.guardarEnLocalStorage();
        }
    }

    // Cambiar estado de completada
    toggleCompletada(id) {
        const tarea = this.tareas.find(tarea => tarea.id === id);
        if (tarea) {
            tarea.toggleCompletada();
            this.guardarEnLocalStorage();
        }
    }

    // Obtener todas las tareas
    obtenerTodasLasTareas() {
        return this.tareas;
    }

    // Guardar tareas en LocalStorage
    guardarEnLocalStorage() {
        localStorage.setItem('tareasPowerCafe', JSON.stringify(this.tareas));
    }

    // Cargar tareas desde LocalStorage
    cargarTareasDesdeLocalStorage() {
        const tareasGuardadas = localStorage.getItem('tareasPowerCafe');
        if (tareasGuardadas) {
            const tareasData = JSON.parse(tareasGuardadas);
            // Recrear objetos Tarea desde los datos guardados
            this.tareas = tareasData.map(data => {
                const tarea = new Tarea(data.nombre, data.id);
                tarea.completada = data.completada;
                return tarea;
            });
        }
    }
}

//Manipulación del DOM


class InterfazUsuario {
    constructor() {
        this.gestor = new GestorDeTareas();
        this.inputTarea = document.getElementById('input-tarea');
        this.btnAgregar = document.getElementById('btn-agregar');
        this.listaTareas = document.getElementById('lista-tareas');
        this.mensajeError = document.getElementById('mensaje-error');
        
        this.inicializarEventos();
        this.renderizarTareas();
    }

    // Inicializar eventos de la página
    inicializarEventos() {
        // Evento click en botón agregar
        this.btnAgregar.addEventListener('click', () => this.agregarTarea());
        
        // Evento Enter en el input
        this.inputTarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.agregarTarea();
            }
        });
    }

    // Agregar una nueva tarea
    agregarTarea() {
        const nombreTarea = this.inputTarea.value.trim();
        
        // Validar que no esté vacío
        if (nombreTarea === '') {
            this.mostrarError('Por favor, escribe una tarea antes de agregar');
            return;
        }

        // Agregar la tarea
        this.gestor.agregarTarea(nombreTarea);
        
        // Limpiar input y ocultar error
        this.inputTarea.value = '';
        this.ocultarError();
        
        // Renderizar las tareas
        this.renderizarTareas();
    }

    // Eliminar una tarea
    eliminarTarea(id) {
        if (confirm('¿Estás seguro de eliminar esta tarea?')) {
            this.gestor.eliminarTarea(id);
            this.renderizarTareas();
        }
    }

    // Editar una tarea
    editarTarea(id) {
        const tarea = this.gestor.tareas.find(t => t.id === id);
        if (!tarea) return;

        const nuevoNombre = prompt('Editar tarea:', tarea.nombre);
        
        if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
            this.gestor.editarTarea(id, nuevoNombre.trim());
            this.renderizarTareas();
        } else if (nuevoNombre !== null && nuevoNombre.trim() === '') {
            this.mostrarError('El nombre de la tarea no puede estar vacío');
        }
    }

    // Cambiar estado de completada
    toggleCompletada(id) {
        this.gestor.toggleCompletada(id);
        this.renderizarTareas();
    }

    // Renderizar todas las tareas en el DOM
    renderizarTareas() {
        // Limpiar lista
        this.listaTareas.innerHTML = '';

        const tareas = this.gestor.obtenerTodasLasTareas();

        // Si no hay tareas, mostrar mensaje
        if (tareas.length === 0) {
            this.listaTareas.innerHTML = `
                <li style="text-align: center; padding: 20px; color: #888;">
                    No hay tareas. ¡Agrega tu primera tarea!
                </li>
            `;
            return;
        }

        // Renderizar cada tarea usando forEach
        tareas.forEach(tarea => {
            const li = this.crearElementoTarea(tarea);
            this.listaTareas.appendChild(li);
        });
    }

    // Crear elemento HTML para una tarea (usando template literals)
    crearElementoTarea(tarea) {
        const li = document.createElement('li');
        li.className = `tarea-item ${tarea.completada ? 'completada' : ''}`;
        
        // Usar template literal para crear el HTML
        li.innerHTML = `
            <span class="tarea-texto">${tarea.nombre}</span>
            <div class="tarea-botones">
                <button class="btn-completar" data-id="${tarea.id}">
                    ${tarea.completada ? '✓ Completada' : 'Completar'}
                </button>
                <button class="btn-editar" data-id="${tarea.id}">Editar</button>
                <button class="btn-eliminar" data-id="${tarea.id}">Eliminar</button>
            </div>
        `;

        // Agregar eventos a los botones usando funciones flecha
        const btnCompletar = li.querySelector('.btn-completar');
        const btnEditar = li.querySelector('.btn-editar');
        const btnEliminar = li.querySelector('.btn-eliminar');

        btnCompletar.addEventListener('click', () => this.toggleCompletada(tarea.id));
        btnEditar.addEventListener('click', () => this.editarTarea(tarea.id));
        btnEliminar.addEventListener('click', () => this.eliminarTarea(tarea.id));

        return li;
    }

    // Mostrar mensaje de error
    mostrarError(mensaje) {
        this.mensajeError.textContent = mensaje;
        this.mensajeError.classList.add('mostrar');
        
        // Ocultar después de 3 segundos
        setTimeout(() => this.ocultarError(), 3000);
    }

    // Ocultar mensaje de error
    ocultarError() {
        this.mensajeError.classList.remove('mostrar');
    }
}


// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    new InterfazUsuario();
});