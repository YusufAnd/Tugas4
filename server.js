const express = require('express');
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// buka database
const db = new DatabaseSync('tugas.db');

// buat tabel kalau belum ada
db.exec('CREATE TABLE IF NOT EXISTS tugas (id INTEGER PRIMARY KEY AUTOINCREMENT, judul TEXT, matkul TEXT, deadline TEXT)');

// tampilkan semua tugas
app.get('/tugas', function (req, res) {
  const hasil = db.prepare('SELECT * FROM tugas').all();
  res.json(hasil);
});

// tambah tugas
app.post('/tugas', function (req, res) {
  db.prepare('INSERT INTO tugas (judul, matkul, deadline) VALUES (?, ?, ?)')
    .run(req.body.judul, req.body.matkul, req.body.deadline);
  res.json({ pesan: 'Tugas ditambah' });
});

// ubah tugas
app.put('/tugas/:id', function (req, res) {
  db.prepare('UPDATE tugas SET judul = ?, matkul = ?, deadline = ? WHERE id = ?')
    .run(req.body.judul, req.body.matkul, req.body.deadline, req.params.id);
  res.json({ pesan: 'Tugas diubah' });
});

// hapus tugas
app.delete('/tugas/:id', function (req, res) {
  db.prepare('DELETE FROM tugas WHERE id = ?').run(req.params.id);
  res.json({ pesan: 'Tugas dihapus' });
});

app.listen(3000, function () {
  console.log('Server jalan di http://localhost:3000');
});
