DROP DATABASE IF EXISTS department_db;
CREATE DATABASE department_db;

\c department_db;

CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(30) NOT NULL
);

CREATE TABLE job_roles (
    job_roles_id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    job_roles_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (job_roles_id)
    REFERENCES job_roles(job_roles_id)
    ON DELETE SET NULL
);
