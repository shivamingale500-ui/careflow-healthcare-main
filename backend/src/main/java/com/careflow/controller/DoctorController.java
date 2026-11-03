package com.careflow.controller;

import com.careflow.entity.Doctor;
import com.careflow.repository.DoctorRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(
            DoctorRepository doctorRepository) {

        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Doctor> getDoctors() {

        return doctorRepository.findAll();
    }

    @GetMapping("/department/{departmentId}")
    public List<Doctor> getDoctorsByDepartment(
            @PathVariable Long departmentId) {

        return doctorRepository
                .findByDepartmentId(departmentId);
    }
}
