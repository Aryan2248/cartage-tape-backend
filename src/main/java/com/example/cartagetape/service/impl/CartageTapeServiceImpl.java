package com.example.cartagetape.service.impl;

import com.example.cartagetape.dto.TapeRequest;
import com.example.cartagetape.dto.TapeResponse;
import com.example.cartagetape.entity.CartageTape;
import com.example.cartagetape.entity.User;
import com.example.cartagetape.exception.DuplicateSequenceException;
import com.example.cartagetape.exception.ResourceNotFoundException;
import com.example.cartagetape.repository.CartageTapeRepository;
import com.example.cartagetape.repository.UserRepository;
import com.example.cartagetape.service.CartageTapeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CartageTapeServiceImpl implements CartageTapeService {

    private final CartageTapeRepository tapeRepository;
    private final UserRepository userRepository;

    @Override
    public TapeResponse createTape(TapeRequest request) {

        if (tapeRepository.existsBySequenceNumber(request.getSequenceNumber())) {
            throw new DuplicateSequenceException(
                    "Tape with sequence number " + request.getSequenceNumber() + " already exists"
            );
        }

        CartageTape tape = CartageTape.builder()
                .sequenceNumber(request.getSequenceNumber())
                .location(request.getLocation())
                .size(request.getSize())
                .remarks(request.getRemarks())
                .createdBy(getCurrentUserName())
                .createdAt(LocalDateTime.now())
                .build();

        tapeRepository.save(tape);

        return mapToResponse(tape);
    }

    @Override
    public TapeResponse updateTape(String id, TapeRequest request) {

        CartageTape tape = tapeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tape not found with id: " + id));

        if (!tape.getSequenceNumber().equals(request.getSequenceNumber())
                && tapeRepository.existsBySequenceNumber(request.getSequenceNumber())) {
            throw new DuplicateSequenceException(
                    "Tape with sequence number " + request.getSequenceNumber() + " already exists"
            );
        }

        tape.setSequenceNumber(request.getSequenceNumber());
        tape.setLocation(request.getLocation());
        tape.setSize(request.getSize());
        tape.setRemarks(request.getRemarks());
        tape.setUpdatedBy(getCurrentUserName());
        tape.setUpdatedAt(LocalDateTime.now());

        tapeRepository.save(tape);

        return mapToResponse(tape);
    }

    @Override
    public TapeResponse getTapeById(String id) {
        CartageTape tape = tapeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tape not found with id: " + id));
        return mapToResponse(tape);
    }

    @Override
    public TapeResponse getTapeBySequenceNumber(String sequenceNumber) {
        CartageTape tape = tapeRepository.findBySequenceNumber(sequenceNumber)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Tape not found with sequence number: " + sequenceNumber));
        return mapToResponse(tape);
    }

    @Override
    public Page<TapeResponse> getAllTapes(String location, String search, Pageable pageable) {

        Page<CartageTape> tapes;

        if (search != null && !search.isBlank()) {
            tapes = tapeRepository.searchByKeyword(search, pageable);
        } else if (location != null && !location.isBlank()) {
            tapes = tapeRepository.findByLocationContainingIgnoreCase(location, pageable);
        } else {
            tapes = tapeRepository.findAll(pageable);
        }

        return tapes.map(this::mapToResponse);
    }

    @Override
    public void deleteTape(String id) {
        CartageTape tape = tapeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tape not found with id: " + id));
        tapeRepository.delete(tape);
    }

    private String getCurrentUserName() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return user.getName();
    }

    private TapeResponse mapToResponse(CartageTape tape) {
        return TapeResponse.builder()
                .id(tape.getId())
                .sequenceNumber(tape.getSequenceNumber())
                .location(tape.getLocation())
                .size(tape.getSize())
                .remarks(tape.getRemarks())
                .createdBy(tape.getCreatedBy())
                .createdAt(tape.getCreatedAt())
                .updatedBy(tape.getUpdatedBy())
                .updatedAt(tape.getUpdatedAt())
                .build();
    }
}