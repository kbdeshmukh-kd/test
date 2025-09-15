package com.empresa.app.controller;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.empresa.app.model.Request;
import com.empresa.app.service.RequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class RequestApiController {

    private final RequestService requestService;

    public RequestApiController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/requests")
    public Map<String, Object> listRequests() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("listRequest", requestService.findAllRequests());
        return response;
    }

    @GetMapping("/requests/names")
    public Map<String, Map<String, String>> listRequestNames() {
        Map<String, Map<String, String>> response = new LinkedHashMap<>();
        response.put("mapInstitutions", requestService.findInstitutionNames());
        return response;
    }

    @GetMapping("/countries")
    public Map<String, Map<String, String>> listCountries() {
        Map<String, Map<String, String>> response = new LinkedHashMap<>();
        response.put("mapCountries", getListOfCountries(Locale.getDefault()));
        return response;
    }

    @PostMapping("/requests")
    public ResponseEntity<Void> createRequest(@Valid @RequestBody Request request) {
        requestService.createRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private Map<String, String> getListOfCountries(Locale locale) {
        String[] locales = Locale.getISOCountries();
        Map<String, String> countries = new LinkedHashMap<>();
        for (String countryCode : locales) {
            Locale obj = new Locale("", countryCode);
            countries.put(obj.getCountry(), obj.getDisplayCountry(locale));
        }
        return countries;
    }
}
