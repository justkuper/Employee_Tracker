SELECT * FROM employees;

SELECT departments.department_name AS department, 
job_role.title, 
job_role.salary,
FROM job_role
JOIN departments
ON job_role.department_id = departments.department_id;

SELECT employees.first_name AS employee, employees.last_name, job_role.title
FROM employees
JOIN job_role
ON employee.job_role_id = job_role.job_role_id;