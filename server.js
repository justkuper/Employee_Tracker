const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to the database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'department_db', // Ensure this matches your actual database name
  password: 'lespool42',
  port: 5432
});

// Check database connection
pool.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Employee API!");
});

// Get all employees
app.get("/api/employees", (req, res) => {
    pool.query("SELECT * FROM employees", (error, results) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: 'An error occurred while fetching employees.' });
        }
        res.status(200).json(results.rows);
    });
});

// Get a single employee
app.get("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query("SELECT * FROM employees WHERE employee_id = $1", [id], (error, results) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: 'An error occurred while fetching the employee.' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        res.status(200).json(results.rows[0]);
    });
});

// Add an employee
app.post("/api/employees", (req, res) => {
    const { first_name, last_name, job_role_id, manager_id } = req.body;

    pool.query("INSERT INTO employee (first_name, last_name, job_role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING employee_id", [first_name, last_name, job_role_id, manager_id], (error, results) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: 'An error occurred while adding the employee.' });
        }
        res.status(201).json({ employee_id: results.rows[0].employee_id });
    });
});

// Update an employee
app.put("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { first_name, last_name, job_role_id, manager_id } = req.body;

    pool.query("UPDATE employee SET first_name = $1, last_name = $2, job_role_id = $3, manager_id = $4 WHERE employee_id = $5", [first_name, last_name, job_role_id, manager_id, id], (error, results) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: 'An error occurred while updating the employee.' });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        res.status(200).json({ message: `Employee modified with ID: ${id}` });
    });
});

// Delete an employee
app.delete("/api/employees/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query("DELETE FROM employee WHERE employee_id = $1", [id], (error, results) => {
        if (error) {
            console.error('Error executing query', error.stack);
            return res.status(500).json({ error: 'An error occurred while deleting the employee.' });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        res.status(200).json({ message: `Employee deleted with ID: ${id}` });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
