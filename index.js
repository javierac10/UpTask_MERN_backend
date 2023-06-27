import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import cors from 'cors'

const app = express();
app.use(express.json()) // procesa los JSON desde el body

dotenv.config();

conectarDB();

// Condigurar CORS
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if (whiteList.includes(origin)) {
            // Puede consultar la api
            callback(null, true);
        } else {
            // No está permitido
            callback(new Error('Error de Cors'));
        }
    }
}

app.use(cors(corsOptions));

// Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

app.use('/', (req, res) => {
    res.json({ message:  'ok' });
});

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
    console.log(`Corriendo en puerto ${PORT}`);
})

import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on('connection', socket => {

    socket.on("abrir proyecto", proyecto => {
        socket.join(proyecto)
    })

    socket.on('nueva tarea', tarea => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', tarea => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('actualizar tarea', tarea => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })

    socket.on('cambiar estado', tarea => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('nuevo estado', tarea)
    })
})