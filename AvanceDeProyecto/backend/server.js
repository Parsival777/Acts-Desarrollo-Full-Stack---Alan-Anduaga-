const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, '../frontend')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/registro', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Campos vacíos no permitidos');
    
    const hash = await bcrypt.hash(password, 10);
    db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Usuario registrado');
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Campos vacíos no permitidos');

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], async (err, result) => {
        if (err || result.length === 0) return res.status(400).send('Usuario no encontrado');
        const valid = await bcrypt.compare(password, result[0].password);
        if (!valid) return res.status(400).send('Contraseña incorrecta');
        const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET);
        res.json({ token });
    });
});

app.get('/api/reparaciones', verificarToken, (req, res) => {
    db.query('SELECT * FROM reparaciones WHERE usuario_id = ?', [req.user.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post('/api/reparaciones', verificarToken, (req, res) => {
    const { vehiculo, descripcion } = req.body;
    if (!vehiculo || !descripcion) return res.status(400).send('Datos incompletos');

    db.query('INSERT INTO reparaciones (vehiculo, descripcion, usuario_id) VALUES (?, ?, ?)', 
    [vehiculo, descripcion, req.user.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Reparación agregada');
    });
});

app.delete('/api/reparaciones/:id', verificarToken, (req, res) => {
    db.query('DELETE FROM reparaciones WHERE id = ? AND usuario_id = ?', 
    [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send('Reparación eliminada');
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});