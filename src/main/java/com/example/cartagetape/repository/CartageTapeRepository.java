package com.example.cartagetape.repository;

import com.example.cartagetape.entity.CartageTape;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface CartageTapeRepository
        extends MongoRepository<CartageTape, String> {

    Optional<CartageTape> findBySequenceNumber(String sequenceNumber);

    boolean existsBySequenceNumber(String sequenceNumber);

    Page<CartageTape> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    @Query("{ '$or': [ " +
            "{ 'sequenceNumber': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'location': { '$regex': ?0, '$options': 'i' } }, " +
            "{ 'remarks': { '$regex': ?0, '$options': 'i' } } ] }")
    Page<CartageTape> searchByKeyword(String keyword, Pageable pageable);
}