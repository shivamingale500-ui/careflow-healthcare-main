package com.careflow.controller;

import com.careflow.entity.Department;
import com.careflow.repository.DepartmentRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(
            DepartmentRepository departmentRepository) {

        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public List<Department> getDepartments() {

        return departmentRepository.findAll();
    }
}
