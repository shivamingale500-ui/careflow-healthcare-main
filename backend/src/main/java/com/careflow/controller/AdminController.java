package com.careflow.controller;

import com.careflow.entity.Appointment;
import com.careflow.entity.AppointmentStatus;
import com.careflow.entity.Department;
import com.careflow.entity.Doctor;
import com.careflow.entity.Patient;
import com.careflow.repository.AppointmentRepository;
import com.careflow.repository.DepartmentRepository;
import com.careflow.repository.DoctorRepository;
import com.careflow.repository.PatientRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminController(
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository,
            AppointmentRepository appointmentRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // ==========================================
    // GET ALL PATIENTS
    // ==========================================

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {

        return ResponseEntity.ok(
                patientRepository.findAll()
        );
    }

    // ==========================================
    // GET ALL DOCTORS
    // ==========================================

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {

        return ResponseEntity.ok(
                doctorRepository.findAll()
        );
    }

    // ==========================================
    // GET ALL DEPARTMENTS
    // ==========================================

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentRepository.findAll()
        );
    }

    // ==========================================
    // ADD DEPARTMENT
    // ==========================================

    @PostMapping("/departments")
    public ResponseEntity<Department> addDepartment(
            @RequestBody Department department) {

        Department savedDepartment =
                departmentRepository.save(department);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDepartment);
    }

    // ==========================================
    // GET ALL APPOINTMENTS
    // ==========================================

    @GetMapping("/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        return ResponseEntity.ok(
                appointmentRepository.findAll()
        );
    }

    // ==========================================
    // APPOINTMENT STATISTICS
    // ==========================================

    @GetMapping("/appointments/statistics")
    public ResponseEntity<Map<String, Long>> getAppointmentStatistics() {

        List<Appointment> appointments =
                appointmentRepository.findAll();

        long total = appointments.size();

        long booked = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.BOOKED)
                .count();

        long confirmed = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CONFIRMED)
                .count();

        long inProgress = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.IN_PROGRESS)
                .count();

        long completed = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        long cancelled = appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CANCELLED)
                .count();

        Map<String, Long> statistics = new HashMap<>();

        statistics.put("total", total);
        statistics.put("booked", booked);
        statistics.put("confirmed", confirmed);
        statistics.put("inProgress", inProgress);
        statistics.put("completed", completed);
        statistics.put("cancelled", cancelled);

        return ResponseEntity.ok(statistics);
    }
}
