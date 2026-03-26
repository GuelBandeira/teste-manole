import sqlite3 from 'sqlite3';

const sql3 = sqlite3.verbose();

const DB = new sql3.Database('./database.db', sql3.OPEN_CREATE | sql3.OPEN_READWRITE, (err) => {
   if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message);
   } else {
      console.log('Conectado ao banco de dados');
   }
});


// const dropTasksTable = `DROP TABLE IF EXISTS tasks;`;

// DB.run(dropTasksTable, [], (err) => {
//    if (err) {
//       console.error('Erro ao excluir tabela tasks:', err.message);
//    } else {
//       console.log('Tabela tasks excluída com sucesso');
//    }
// });



const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

const createTasksTable = `
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status INTEGER NOT NULL DEFAULT 0 CHECK (status IN (0, 1, 2)),
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);`;

DB.run(createUsersTable, [], (err) => {
   if (err) {
      console.error('Erro ao criar tabela users:', err.message);
   } else {
      console.log('Tabela users criada ou já existe');
   }
});

DB.run(createTasksTable, [], (err) => {
   if (err) {
      console.error('Erro ao criar tabela tasks:', err.message);
   } else {
      console.log('Tabela tasks criada ou já existe');
   }
});


export default DB; 