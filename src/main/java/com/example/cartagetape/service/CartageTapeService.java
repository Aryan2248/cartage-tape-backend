package com.example.cartagetape.service;

import com.example.cartagetape.dto.TapeRequest;
import com.example.cartagetape.dto.TapeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CartageTapeService {

    TapeResponse createTape(TapeRequest request);

    TapeResponse updateTape(String id, TapeRequest request);

    TapeResponse getTapeById(String id);

    TapeResponse getTapeBySequenceNumber(String sequenceNumber);

    Page<TapeResponse> getAllTapes(String location, String search, Pageable pageable);

    void deleteTape(String id);
}