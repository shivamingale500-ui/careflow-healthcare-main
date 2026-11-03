# CareFlow Healthcare

A full-stack Healthcare Appointment Management System built with **React, Spring Boot, MySQL and JWT Authentication**.

## Project Structure

text
careflow-healthcare/
├── backend/       # Spring Boot REST API
├── frontend/      # React + Vite application
└── .gitignore

## Technology Stack

### Backend

* Java 21
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Maven

### Frontend

* React
* Vite
* JavaScript
* npm

### Database

* MySQL 8.0

---

# Prerequisites

Install the following on your system:

* Git
* Java 21
* Maven
* Node.js + npm
* MySQL 8.0
* VS Code / IntelliJ IDEA
* Chrome / Edge

Verify:

bash
git --version
java -version
mvn -version
node -v
npm -v
mysql --version


---------------------

# 1. Clone the Project

bash
git clone https://github.com/YOUR-GITHUB-USERNAME/careflow-healthcare.git
cd careflow-healthcare


---

# 2. Setup MySQL

Start MySQL and create the database:

sql
CREATE DATABASE careflow;


Create the application user:

sql
CREATE USER 'careflow_user'@'localhost' IDENTIFIED BY 'CareFlow@123';

GRANT ALL PRIVILEGES ON careflow.* TO 'careflow_user'@'localhost';

FLUSH PRIVILEGES;


---

# 3. Run Backend

Open Terminal 1:

bash
cd careflow-healthcare/backend


Build:

bash
mvn clean package


Run:

bash
mvn spring-boot:run


Backend will run on:

text
http://localhost:8080


Test:

text
http://localhost:8080/api/health


Expected:

json
{
  "application": "CareFlow",
  "status": "UP"
}


---

# 4. Run Frontend

Open Terminal 2:

bash
cd careflow-healthcare/frontend


Install dependencies:

bash
npm install


Start the application:

bash
npm run dev


Open:

text
http://localhost:5173


---

# 5. Application Flow

text
React Frontend
      |
      v
Spring Boot REST API
      |
      v
JWT Authentication
      |
      v
MySQL Database


## User Roles

### Patient

* Register/Login
* View doctors
* Book appointment
* View appointments
* Cancel appointment

### Doctor

* Login
* View appointments
* Update appointment status

### Admin

* Login
* Manage patients
* Manage doctors
* Manage departments
* Manage appointments
* View statistics

---

# 6. Important Notes

* MySQL must be running before starting the backend.
* Backend must be running before using the frontend.
* Do not commit `node_modules`, `target`, `.env`, AWS credentials or private keys.
* For local development, the frontend should connect to the backend at `http://localhost:8080`.

---

# 7. DevOps Phase

After the application works locally, the project can be used for the AWS Cloud & DevOps implementation.


GitHub
   ↓
Jenkins
   ↓
Maven
   ↓
Docker
   ↓
Amazon ECR
   ↓
Amazon EKS
   ↓
Kubernetes
   ↓
Prometheus + Grafana


---

## CareFlow Healthcare

**Full-Stack Healthcare Appointment Management System**

Built with React + Spring Boot + MySQL.
