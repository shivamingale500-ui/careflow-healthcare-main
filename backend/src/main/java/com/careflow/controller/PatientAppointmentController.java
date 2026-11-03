package com.careflow.controller;

import com.careflow.dto.AppointmentRequest;
import com.careflow.entity.Appointment;
import com.careflow.entity.AppointmentStatus;
import com.careflow.entity.Doctor;
import com.careflow.entity.Patient;
import com.careflow.repository.AppointmentRepository;
import com.careflow.repository.DoctorRepository;
import com.careflow.repository.PatientRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/appointments")
public class PatientAppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PatientAppointmentController(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Patient patient = patientRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        boolean slotBooked =
                appointmentRepository
                        .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                                request.getDoctorId(),
                                request.getAppointmentDate(),
                                request.getAppointmentTime(),
                                AppointmentStatus.CANCELLED);

        if (slotBooked) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("This appointment slot is already booked");
        }

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setStatus(AppointmentStatus.BOOKED);

        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedAppointment);
    }

    @GetMapping
    public ResponseEntity<?> getMyAppointments(
            Authentication authentication) {

        String email = authentication.getName();

        Patient patient = patientRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));

        List<Appointment> appointments =
                appointmentRepository.findByPatientId(patient.getId());

        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        Patient patient = patientRepository
                .findByUserEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Patient profile not found"));

        Appointment appointment =
                appointmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found"));

        if (!appointment.getPatient().getId().equals(patient.getId())) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You cannot cancel this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            return ResponseEntity
                    .badRequest()
                    .body("Appointment is already cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        appointmentRepository.save(appointment);

        return ResponseEntity.ok("Appointment cancelled successfully");
    }
}
