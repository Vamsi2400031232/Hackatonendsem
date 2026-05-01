package com.example.backend.controller;

import com.example.backend.entity.Assignment;
import com.example.backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        if (assignment.getStatus() == null || assignment.getStatus().isEmpty()) {
            assignment.setStatus("pending");
        }
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @RequestBody Assignment assignmentDetails) {
        return assignmentRepository.findById(id)
                .map(assignment -> {
                    assignment.setTitle(assignmentDetails.getTitle());
                    assignment.setCourse(assignmentDetails.getCourse());
                    assignment.setDueDate(assignmentDetails.getDueDate());
                    assignment.setPoints(assignmentDetails.getPoints());
                    assignment.setDescription(assignmentDetails.getDescription());
                    // Keep existing status if not provided, or allow updating status?
                    // Typically teachers might want to update status too if needed.
                    if (assignmentDetails.getStatus() != null && !assignmentDetails.getStatus().isEmpty()) {
                        assignment.setStatus(assignmentDetails.getStatus());
                    }
                    Assignment updated = assignmentRepository.save(assignment);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        assignmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
