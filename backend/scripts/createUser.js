const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '3.135.203.67',
  user: 'root',
  password: 'Shivaansh14@',
  database: 'Job_Application_Tracker'
});

async function createUser() {
  const username = 'test';
  const password = 'testtest';
  
  // Generate hashed password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // First, find the user id if exists
  db.query('SELECT id FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Error finding user:', error);
      db.end();
      return;
    }

    if (results.length > 0) {
      const userId = results[0].id;
      // Delete related jobs first
      db.query('DELETE FROM jobs WHERE user_id = ?', [userId], (error) => {
        if (error) {
          console.error('Error deleting jobs:', error);
          db.end();
          return;
        }

        // Then delete the user
        db.query('DELETE FROM users WHERE id = ?', [userId], (error) => {
          if (error) {
            console.error('Error deleting user:', error);
            db.end();
            return;
          }

          // Finally create new user
          insertNewUser();
        });
      });
    } else {
      // No existing user, create new one directly
      insertNewUser();
    }
  });

  function insertNewUser() {
    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (error, results) => {
        if (error) {
          console.error('Error creating user:', error);
        } else {
          console.log('User created successfully:', {
            id: results.insertId,
            username: username
          });
        }
        db.end();
      }
    );
  }
}

createUser().catch(console.error); 