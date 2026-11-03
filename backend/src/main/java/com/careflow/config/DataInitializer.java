package com.careflow.config;

import com.careflow.entity.Department;
import com.careflow.entity.Doctor;
import com.careflow.entity.Role;
import com.careflow.entity.User;
import com.careflow.repository.DepartmentRepository;
import com.careflow.repository.DoctorRepository;
import com.careflow.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeData(
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // =========================
            // DEPARTMENTS
            // =========================

            Department cardiology =
                    departmentRepository.findByName("Cardiology")
                            .orElseGet(() ->
                                    departmentRepository.save(
                                            new Department("Cardiology")
                                    )
                            );

            Department generalMedicine =
                    departmentRepository.findByName("General Medicine")
                            .orElseGet(() ->
                                    departmentRepository.save(
                                            new Department("General Medicine")
                                    )
                            );

            Department dermatology =
                    departmentRepository.findByName("Dermatology")
                            .orElseGet(() ->
                                    departmentRepository.save(
                                            new Department("Dermatology")
                                    )
                            );

            Department orthopedics =
                    departmentRepository.findByName("Orthopedics")
                            .orElseGet(() ->
                                    departmentRepository.save(
                                            new Department("Orthopedics")
                                    )
                            );

            Department neurology =
                    departmentRepository.findByName("Neurology")
                            .orElseGet(() ->
                                    departmentRepository.save(
                                            new Department("Neurology")
                                    )
                            );

            // =========================
            // ADMIN
            // =========================

            if (!userRepository.existsByEmail(
                    "admin@careflow.com")) {

                User admin = new User();

                admin.setFullName("CareFlow Admin");
                admin.setEmail("admin@careflow.com");

                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
            }

            // =========================
            // DOCTOR 1
            // =========================

            if (!userRepository.existsByEmail(
                    "amit@careflow.com")) {

                User user = new User();

                user.setFullName("Dr. Amit Sharma");
                user.setEmail("amit@careflow.com");

                user.setPassword(
                        passwordEncoder.encode("Doctor@123")
                );

                user.setRole(Role.DOCTOR);

                User savedUser =
                        userRepository.save(user);

                Doctor doctor = new Doctor();

                doctor.setUser(savedUser);
                doctor.setSpecialization("Cardiologist");
                doctor.setDepartment(cardiology);

                doctorRepository.save(doctor);
            }

            // =========================
            // DOCTOR 2
            // =========================

            if (!userRepository.existsByEmail(
                    "priya@careflow.com")) {

                User user = new User();

                user.setFullName("Dr. Priya Deshmukh");
                user.setEmail("priya@careflow.com");

                user.setPassword(
                        passwordEncoder.encode("Doctor@123")
                );

                user.setRole(Role.DOCTOR);

                User savedUser =
                        userRepository.save(user);

                Doctor doctor = new Doctor();

                doctor.setUser(savedUser);
                doctor.setSpecialization("General Physician");
                doctor.setDepartment(generalMedicine);

                doctorRepository.save(doctor);
            }

            // =========================
            // DOCTOR 3
            // =========================

            if (!userRepository.existsByEmail(
                    "sneha@careflow.com")) {

                User user = new User();

                user.setFullName("Dr. Sneha Patil");
                user.setEmail("sneha@careflow.com");

                user.setPassword(
                        passwordEncoder.encode("Doctor@123")
                );

                user.setRole(Role.DOCTOR);

                User savedUser =
                        userRepository.save(user);

                Doctor doctor = new Doctor();

                doctor.setUser(savedUser);
                doctor.setSpecialization("Dermatologist");
                doctor.setDepartment(dermatology);

                doctorRepository.save(doctor);
            }

            // =========================
            // DOCTOR 4
            // =========================

            if (!userRepository.existsByEmail(
                    "rahul@careflow.com")) {

                User user = new User();

                user.setFullName("Dr. Rahul Kulkarni");
                user.setEmail("rahul@careflow.com");

                user.setPassword(
                        passwordEncoder.encode("Doctor@123")
                );

                user.setRole(Role.DOCTOR);

                User savedUser =
                        userRepository.save(user);

                Doctor doctor = new Doctor();

                doctor.setUser(savedUser);
                doctor.setSpecialization("Orthopedic Specialist");
                doctor.setDepartment(orthopedics);

                doctorRepository.save(doctor);
            }

            // =========================
            // DOCTOR 5
            // =========================

            if (!userRepository.existsByEmail(
                    "neha@careflow.com")) {

                User user = new User();

                user.setFullName("Dr. Neha Joshi");
                user.setEmail("neha@careflow.com");

                user.setPassword(
                        passwordEncoder.encode("Doctor@123")
                );

                user.setRole(Role.DOCTOR);

                User savedUser =
                        userRepository.save(user);

                Doctor doctor = new Doctor();

                doctor.setUser(savedUser);
                doctor.setSpecialization("Neurologist");
                doctor.setDepartment(neurology);

                doctorRepository.save(doctor);
            }

            System.out.println(
                    "CareFlow demo data initialization completed."
            );
        };
    }
}
