package com.example.cartagetape.controller;

import com.example.cartagetape.dto.TapeRequest;
import com.example.cartagetape.dto.TapeResponse;
import com.example.cartagetape.service.CartageTapeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tapes")
@RequiredArgsConstructor
public class CartageTapeController {

    private final CartageTapeService tapeService;

    @PostMapping
    public ResponseEntity<TapeResponse> createTape(@Valid @RequestBody TapeRequest request) {
        return ResponseEntity.ok(tapeService.createTape(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TapeResponse> updateTape(
            @PathVariable String id,
            @Valid @RequestBody TapeRequest request) {
        return ResponseEntity.ok(tapeService.updateTape(id, request));
    }

    @GetMapping
    public ResponseEntity<Page<TapeResponse>> getAllTapes(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(tapeService.getAllTapes(location, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TapeResponse> getTapeById(@PathVariable String id) {
        return ResponseEntity.ok(tapeService.getTapeById(id));
    }

    @GetMapping("/sequence/{sequenceNumber}")
    public ResponseEntity<TapeResponse> getTapeBySequenceNumber(@PathVariable String sequenceNumber) {
        return ResponseEntity.ok(tapeService.getTapeBySequenceNumber(sequenceNumber));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteTape(@PathVariable String id) {
        tapeService.deleteTape(id);
        return ResponseEntity.noContent().build();
    }
}