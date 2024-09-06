INSERT INTO departments (department_name) 
VALUES ('Engineering'), 
       ('Sales'), 
       ('Finance'), 
       ('Legal');

INSERT INTO job_roles (title, salary, department_id)
VALUES ('Software Engineer', 100000, 1),
       ('Sales Lead', 80000, 2),
       ('Accountant', 75000, 3),
       ('Lawyer', 120000, 4);

INSERT INTO employees (first_name, last_name, job_roles_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Alice', 'Johnson', 3, 2),
       ('Bob', 'Brown', 4, NULL);