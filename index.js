const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let tareas = [
  { id: 1, titulo: 'Lanzar instancia EC2', completada: true },
  { id: 2, titulo: 'Configurar Nginx',     completada: true },
  { id: 3, titulo: 'Desplegar Node.js',    completada: false },
  { id: 4, titulo: 'Configurar PM2',       completada: false },
];

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API corriendo en Docker',
    runtime: process.version,
    uptime: `${Math.floor(process.uptime())} segundos`,
    timestamp: new Date().toISOString()
  });
});

app.get('/tareas', (req, res) => {
  res.json(tareas);
});

app.get('/tareas/:id', (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(tarea);
});

app.post('/tareas', (req, res) => {
  if (!req.body.titulo) {
    return res.status(400).json({ error: 'El campo titulo es requerido' });
  }
  const nueva = {
    id: tareas.length + 1,
    titulo: req.body.titulo,
    completada: false
  };
  tareas.push(nueva);
  res.status(201).json(nueva);
});

app.patch('/tareas/:id', (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
  tarea.completada = true;
  res.json(tarea);
});

app.delete('/tareas/:id', (req, res) => {
  const index = tareas.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Tarea no encontrada' });
  tareas.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Inicio: ${new Date().toISOString()}`);
});