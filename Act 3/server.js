const express = require('express');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const CLAVE_SECRETA = 'mi_clave_secreta_123';

app.use(express.json());

const usuarios = [];

async function obtenerTareas() {
    try {
        const data = await fs.readFile('tareas.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function guardarTareas(tareas) {
    await fs.writeFile('tareas.json', JSON.stringify(tareas, null, 2));
}

app.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).send('Faltan credenciales');

        const hashedPassword = await bcrypt.hash(password, 10);
        usuarios.push({ username, password: hashedPassword });
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        next(error);
    }
});

app.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = usuarios.find(u => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Credenciales inválidas');
        }

        const token = jwt.sign({ username: user.username }, CLAVE_SECRETA, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        next(error);
    }
});

function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Acceso denegado. Token requerido.');

    jwt.verify(token, CLAVE_SECRETA, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user;
        next();
    });
}

app.get('/tareas', autenticarToken, async (req, res, next) => {
    try {
        const tareas = await obtenerTareas();
        res.json(tareas);
    } catch (error) {
        next(error);
    }
});

app.post('/tareas', autenticarToken, async (req, res, next) => {
    try {
        const tareas = await obtenerTareas();
        const nuevaTarea = {
            id: Date.now().toString(),
            titulo: req.body.titulo,
            descripcion: req.body.descripcion
        };
        tareas.push(nuevaTarea);
        await guardarTareas(tareas);
        res.status(201).send('Tarea creada exitosamente');
    } catch (error) {
        next(error);
    }
});

app.put('/tareas/:id', autenticarToken, async (req, res, next) => {
    try {
        const tareas = await obtenerTareas();
        const index = tareas.findIndex(t => t.id === req.params.id);

        if (index === -1) return res.status(404).send('Tarea no encontrada');

        tareas[index] = { ...tareas[index], ...req.body, id: req.params.id };
        await guardarTareas(tareas);
        res.send('Tarea actualizada exitosamente');
    } catch (error) {
        next(error);
    }
});

app.delete('/tareas/:id', autenticarToken, async (req, res, next) => {
    try {
        const tareas = await obtenerTareas();
        const nuevasTareas = tareas.filter(t => t.id !== req.params.id);

        if (tareas.length === nuevasTareas.length) return res.status(404).send('Tarea no encontrada');

        await guardarTareas(nuevasTareas);
        res.send('Tarea eliminada exitosamente');
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});