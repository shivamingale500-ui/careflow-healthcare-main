package com.careflow.controller;

import com.careflow.entity.Appointment;
import com.careflow.entity.AppointmentStatus;
import com.careflow.entity.Doctor;
import com.careflow.repository.AppointmentRepository;
import com.careflow.repository.DoctorRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/appointments")
public class DoctorAppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    public DoctorAppointmentController(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<?> getMyAppointments(
            Authentication authentication) {

        String email = authentication.getName();

        Doctor doctor = doctorRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));

        List<Appointment> appointments =
                appointmentRepository.findByDoctorId(doctor.getId());

        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            Authentication authentication) {

        String email = authentication.getName();

        Doctor doctor = doctorRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You cannot update this appointment");
        }

        appointment.setStatus(status);

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity.ok(updatedAppointment);
    }
}
