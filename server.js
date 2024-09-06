const express = require('express');
const inquirer = require('inquirer');
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

const questions = [
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
        choices: ['View all employees', 'View all roles', 'View all departments', 'Add an employee', 'Add a role', 'Add a department', 'Update an employee role'],
    },
    // Add more questions for other information you want to collect
  ];

// Routes
// app.get("/", (req, res) => {
//     res.send("Welcome to the Employee API!");
// });

// // Get all employees
// app.get("/api/employees", (req, res) => {
//     pool.query("SELECT * FROM employees", (error, results) => {
//         if (error) {
//             console.error('Error executing query', error.stack);
//             return res.status(500).json({ error: 'An error occurred while fetching employees.' });
//         }
//         res.status(200).json(results.rows);
//     });
// });

// // Get a single employee
// app.get("/api/employees/:id", (req, res) => {
//     const id = parseInt(req.params.id);

//     pool.query("SELECT * FROM employees WHERE employee_id = $1", [id], (error, results) => {
//         if (error) {
//             console.error('Error executing query', error.stack);
//             return res.status(500).json({ error: 'An error occurred while fetching the employee.' });
//         }
//         if (results.rows.length === 0) {
//             return res.status(404).json({ error: 'Employee not found.' });
//         }
//         res.status(200).json(results.rows[0]);
//     });
// });

// // Add an employee
// app.post("/api/employees", (req, res) => {
//     const { first_name, last_name, job_role_id, manager_id } = req.body;

//     pool.query("INSERT INTO employee (first_name, last_name, job_role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING employee_id", [first_name, last_name, job_role_id, manager_id], (error, results) => {
//         if (error) {
//             console.error('Error executing query', error.stack);
//             return res.status(500).json({ error: 'An error occurred while adding the employee.' });
//         }
//         res.status(201).json({ employee_id: results.rows[0].employee_id });
//     });
// });

// // Update an employee
// app.put("/api/employees/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const { first_name, last_name, job_role_id, manager_id } = req.body;

//     pool.query("UPDATE employee SET first_name = $1, last_name = $2, job_role_id = $3, manager_id = $4 WHERE employee_id = $5", [first_name, last_name, job_role_id, manager_id, id], (error, results) => {
//         if (error) {
//             console.error('Error executing query', error.stack);
//             return res.status(500).json({ error: 'An error occurred while updating the employee.' });
//         }
//         if (results.rowCount === 0) {
//             return res.status(404).json({ error: 'Employee not found.' });
//         }
//         res.status(200).json({ message: `Employee modified with ID: ${id}` });
//     });
// });

// // Delete an employee
// app.delete("/api/employees/:id", (req, res) => {code
//     const id = parseInt(req.params.id);

//     pool.query("DELETE FROM employee WHERE employee_id = $1", [id], (error, results) => {
//         if (error) {
//             console.error('Error executing query', error.stack);
//             return res.status(500).json({ error: 'An error occurred while deleting the employee.' });
//         }
//         if (results.rowCount === 0) {
//             return res.status(404).json({ error: 'Employee not found.' });
//         }
//         res.status(200).json({ message: `Employee deleted with ID: ${id}` });
//     });
// });

// app.get("/api/job_roles", (req, res) => {
//     pool.query("SELECT * FROM job_roles", (error, results) => {
//         if (error) {
//             console.error('Error executing query', error.stack);
//             return res.status(500).json({ error: 'An error occurred while fetching job roles.' });
            
//         }
//         res.status(200).json(results.rows);
//     });
// });

function init() {
    inquirer.prompt(questions)
      .then((answers) => {
        if (answers.choices === 'View all employees') {
            pool.query("SELECT * FROM employees", (error, results) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                }
                console.table(results.rows);
                init();
            })
        }
        else if (answers.choices === 'View all roles') {
            pool.query("SELECT * FROM job_roles", (error, results) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                }
                console.table(results.rows);
                init();
            })
        }
        else if (answers.choices === 'View all departments') {
            pool.query("SELECT * FROM departments", (error, results) => {
                if (error) {
                    console.error('Error executing query', error.stack);
                }
                console.table(results.rows);
                init();
            })
        }
        else if (answers.choices === 'Add an employee') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the employee\'s first name:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the employee\'s last name:'
                },
                {
                    type: 'input',
                    name: 'job_roles_id',
                    message: 'Enter the employee\'s job role ID:'
                },
                {
                    type: 'input',
                    name: 'manager_id',
                    message: 'Enter the employee\'s manager ID:'
                }
            ])
            .then((answers) => {
                const { first_name, last_name, job_roles_id, manager_id } = answers;
                pool.query("INSERT INTO employees (first_name, last_name, job_roles_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING employee_id", [first_name, last_name, job_roles_id, manager_id], (error, results) => {
                    if (error) {
                        console.error('Error executing query', error.stack);
                    }
                    console.log(`Employee added with ID: ${results.rows[0].employee_id}`);
                    init();
                });
            });
        }
        else if (answers.choices === 'Add a role') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the role title:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the role salary:'
                },
                {
                    type: 'input',
                    name: 'department_id',
                    message: 'Enter the role department ID:'
                }
            ])
            .then((answers) => {
                const { title, salary, department_id } = answers;
                pool.query("INSERT INTO job_roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING job_roles_id", [title, salary, department_id], (error, results) => {
                    if (error) {
                        console.error('Error executing query', error.stack);
                    }
                    console.log(`Role added with ID: ${results.rows[0].job_roles_id}`);
                    init();
                });
            });
        }
        else if (answers.choices === 'Add a department') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'department_name',
                    message: 'Enter the department name:'
                }
            ])
            .then((answers) => {
                const { department_name } = answers;
                pool.query("INSERT INTO departments (department_name) VALUES ($1) RETURNING department_id", [department_name], (error, results) => {
                    if (error) {
                        console.error('Error executing query', error.stack);
                    }
                    console.log(`Department added with ID: ${results.rows[0].department_id}`);
                    init();
                });
            });
        }
        else if (answers.choices === 'Update an employee role') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'employee_id',
                    message: 'Enter the employee ID:'
                },
                {
                    type: 'input',
                    name: 'job_roles_id',
                    message: 'Enter the new job role ID:'
                }
            ])
            .then((answers) => {
                const { employee_id, job_roles_id } = answers;
                pool.query("UPDATE employees SET job_roles_id = $1 WHERE employee_id = $2", [job_roles_id, employee_id], (error, results) => {
                    if (error) {
                        console.error('Error executing query', error.stack);
                    }
                    console.log(`Employee role updated with ID: ${employee_id}`);
                    init();
                });
            });
        }
        })
      .catch((err) => {
        console.error(err);
      });
    }

    

// Start the server
init();
