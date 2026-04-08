package com.example.backend.controller;

import com.example.backend.entity.Submission;
import com.example.backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @PostMapping
    public ResponseEntity<?> submitAssignment(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam("studentId") Long studentId,
            @RequestParam("studentName") String studentName,
            @RequestParam(value = "comments", required = false) String comments,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Check if submission already exists
            Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
            Submission submission = existing.orElse(new Submission());

            submission.setAssignmentId(assignmentId);
            submission.setStudentId(studentId);
            submission.setStudentName(studentName);
            submission.setComments(comments);

            if (file != null && !file.isEmpty()) {
                submission.setFileName(file.getOriginalFilename());
                submission.setFileData(file.getBytes());
            }

            Submission saved = submissionRepository.save(submission);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsForAssignment(@PathVariable("assignmentId") Long assignmentId) {
        return ResponseEntity.ok(submissionRepository.findByAssignmentId(assignmentId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsForStudent(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(submissionRepository.findByStudentId(studentId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable("id") Long id) {
        Optional<Submission> submissionOpt = submissionRepository.findById(id);
        if (submissionOpt.isPresent() && submissionOpt.get().getFileData() != null) {
            Submission submission = submissionOpt.get();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + submission.getFileName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(submission.getFileData());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/grade")
    public ResponseEntity<?> gradeSubmission(
            @PathVariable("id") Long id,
            @RequestBody Map<String, Object> payload) {
        Optional<Submission> submissionOpt = submissionRepository.findById(id);
        if (submissionOpt.isPresent()) {
            Submission submission = submissionOpt.get();
            if (payload.containsKey("grade")) {
                Object gradeObj = payload.get("grade");
                if(gradeObj != null) {
                   submission.setGrade(Integer.parseInt(gradeObj.toString()));
                }
            }
            if (payload.containsKey("feedback")) {
                submission.setFeedback((String) payload.get("feedback"));
            }
            Submission saved = submissionRepository.save(submission);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }
}
