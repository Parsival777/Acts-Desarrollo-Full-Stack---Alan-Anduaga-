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
    console.log('Conectado a MySQL exitosamente');
});


const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token requerido');
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token inválido o expirado');
        req.user = user;
        next();
    });
};


app.post('/api/registro', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Faltan datos');
    try {
        const hash = await bcrypt.hash(password, 10);
        db.query('INSERT INTO usuarios (username, password) VALUES (?, ?)', [username, hash], (err) => {
            if (err) return next(err);
            res.status(201).send('Usuario registrado');
        });
    } catch (e) { next(e); }
});

app.post('/api/login', (req, res, next) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], async (err, result) => {
        if (err) return next(err);
        if (result.length === 0) return res.status(400).send('Usuario no encontrado');
        
        const valid = await bcrypt.compare(password, result[0].password);
        if (!valid) return res.status(400).send('Contraseña incorrecta');
        
        const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});




app.get('/api/reparaciones', verificarToken, (req, res, next) => {
    res.set('Cache-Control', 'no-store'); 
    db.query('SELECT * FROM reparaciones WHERE usuario_id = ?', [req.user.id], (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
});


app.post('/api/reparaciones', verificarToken, (req, res, next) => {
    const { vehiculo, descripcion } = req.body;
    db.query('INSERT INTO reparaciones (vehiculo, descripcion, usuario_id) VALUES (?, ?, ?)', 
    [vehiculo, descripcion, req.user.id], (err) => {
        if (err) return next(err);
        res.status(201).send('Reparación agregada');
    });
});


app.put('/api/reparaciones/:id', verificarToken, (req, res, next) => {
    const { descripcion } = req.body;
    db.query('UPDATE reparaciones SET descripcion = ? WHERE id = ? AND usuario_id = ?', 
    [descripcion, req.params.id, req.user.id], (err) => {
        if (err) return next(err);
        res.send('Reparación actualizada');
    });
});


app.delete('/api/reparaciones/:id', verificarToken, (req, res, next) => {
    db.query('DELETE FROM reparaciones WHERE id = ? AND usuario_id = ?', 
    [req.params.id, req.user.id], (err) => {
        if (err) return next(err);
        res.send('Reparación eliminada');
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
