package com.example.cartagetape.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TapeRequest {

    @NotBlank
    private String sequenceNumber;

    @NotBlank
    private String location;

    @NotBlank
    private String size;

    private String remarks;
}