package com.empresa.app.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.empresa.app.exception.RequestValidationException;
import com.empresa.app.model.Request;
import com.empresa.app.repository.RequestRepository;

@Service
public class RequestService {

    private final RequestRepository repository;

    public RequestService(RequestRepository repository) {
        this.repository = repository;
    }

    public List<Request> findAllRequests() {
        return new ArrayList<>(repository.findAll().values());
    }

    public Map<String, String> findInstitutionNames() {
        Map<String, String> institutions = new LinkedHashMap<>();
        for (Request request : findAllRequests()) {
            institutions.put(request.getName(), request.getName());
        }
        return institutions;
    }

    public List<Request> findInstitutionsByName(String name) {
        List<Request> matches = new ArrayList<>();
        if (!StringUtils.hasText(name)) {
            return matches;
        }
        for (Request request : findAllRequests()) {
            if (name.equals(request.getName())) {
                matches.add(request);
            }
        }
        return matches;
    }

    public Request findHeadquarter(String name) {
        if (!StringUtils.hasText(name)) {
            return null;
        }
        for (Request request : findAllRequests()) {
            if (name.equals(request.getName()) && request.isHeadquarter()) {
                return request;
            }
        }
        return null;
    }

    public void createRequest(Request request) {
        if (request.isHeadquarter()) {
            Request existingHeadquarter = findHeadquarter(request.getName());
            if (existingHeadquarter != null) {
                throw new RequestValidationException("This headquarter already exists");
            }
        } else {
            if (!StringUtils.hasText(request.getInstitution())) {
                throw new RequestValidationException("Select one institution headquarter");
            }
            List<Request> requests = findInstitutionsByName(request.getName());
            for (Request existing : requests) {
                if (Objects.equals(existing.getCountry(), request.getCountry())
                        && Objects.equals(existing.getCity(), request.getCity())) {
                    throw new RequestValidationException(
                            "Already exists a branch with the same country and city");
                }
            }
        }
        repository.save(buildRequestKey(request), request);
    }

    private String buildRequestKey(Request request) {
        return String.join("-", request.getName(), request.getCountry(), request.getCity());
    }
}
