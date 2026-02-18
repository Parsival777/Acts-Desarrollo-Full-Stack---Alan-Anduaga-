const express = require('express');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const CLAVE_SECRETA = 'mi_clave_secreta_123';

app.use(express.json());

const usuarios = [];


async function obtenerJugadores() {
    try {
        const data = await fs.readFile('jugadores.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


async function guardarJugadores(jugadores) {
    await fs.writeFile('jugadores.json', JSON.stringify(jugadores, null, 2));
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




app.get('/jugadores', autenticarToken, async (req, res, next) => {
    try {
        const jugadores = await obtenerJugadores();
        res.json(jugadores);
    } catch (error) {
        next(error);
    }
});


app.post('/jugadores', autenticarToken, async (req, res, next) => {
    try {
        const jugadores = await obtenerJugadores();
        const nuevoJugador = {
            id: Date.now().toString(),
            nombre: req.body.nombre,         
            seleccion: req.body.seleccion    
        };
        jugadores.push(nuevoJugador);
        await guardarJugadores(jugadores);
        res.status(201).send('Jugador registrado exitosamente');
    } catch (error) {
        next(error);
    }
});


app.put('/jugadores/:id', autenticarToken, async (req, res, next) => {
    try {
        const jugadores = await obtenerJugadores();
        const index = jugadores.findIndex(j => j.id === req.params.id);

        if (index === -1) return res.status(404).send('Jugador no encontrado');

        jugadores[index] = { ...jugadores[index], ...req.body, id: req.params.id };
        await guardarJugadores(jugadores);
        res.send('Registro del jugador actualizado exitosamente');
    } catch (error) {
        next(error);
    }
});


app.delete('/jugadores/:id', autenticarToken, async (req, res, next) => {
    try {
        const jugadores = await obtenerJugadores();
        const nuevosJugadores = jugadores.filter(j => j.id !== req.params.id);

        if (jugadores.length === nuevosJugadores.length) return res.status(404).send('Jugador no encontrado');

        await guardarJugadores(nuevosJugadores);
        res.send('Jugador eliminado del registro exitosamente');
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
