SELECT * FROM employees;

SELECT departments.department_name AS department, 
job_roles.title, 
job_roles.salary,
FROM job_roles
JOIN departments
ON job_roles.department_id = departments.department_id;

SELECT employees.first_name AS employee, employees.last_name, job_roles.title
FROM employees
JOIN job_roles
ON employee.job_roles_id = job_roles.job_roles_id;