package com.empresa.app.repository;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.empresa.app.model.Request;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class FileRequestRepository implements RequestRepository {

    private static final TypeReference<LinkedHashMap<String, Request>> TYPE_REFERENCE =
            new TypeReference<LinkedHashMap<String, Request>>() {
            };

    private final ObjectMapper objectMapper;
    private final Path storagePath;
    private final Object monitor = new Object();

    public FileRequestRepository(ObjectMapper objectMapper,
            @Value("${app.data-file:./data/requests.json}") String dataFileLocation) {
        this.objectMapper = objectMapper;
        this.storagePath = Paths.get(dataFileLocation).toAbsolutePath().normalize();
        initializeStorage();
    }

    @Override
    public Map<String, Request> findAll() {
        synchronized (monitor) {
            return new LinkedHashMap<>(readAll());
        }
    }

    @Override
    public void save(String key, Request request) {
        synchronized (monitor) {
            Map<String, Request> data = readAll();
            data.put(key, request);
            writeAll(data);
        }
    }

    @Override
    public void delete(String key) {
        synchronized (monitor) {
            Map<String, Request> data = readAll();
            if (data.remove(key) != null) {
                writeAll(data);
            }
        }
    }

    private void initializeStorage() {
        try {
            Path parent = storagePath.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }
            if (Files.notExists(storagePath)) {
                writeAll(new LinkedHashMap<>());
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Unable to initialize storage file", e);
        }
    }

    private Map<String, Request> readAll() {
        try {
            if (Files.notExists(storagePath) || Files.size(storagePath) == 0) {
                return new LinkedHashMap<>();
            }
            try (InputStream inputStream = Files.newInputStream(storagePath)) {
                return objectMapper.readValue(inputStream, TYPE_REFERENCE);
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Unable to read requests", e);
        }
    }

    private void writeAll(Map<String, Request> data) {
        try (OutputStream outputStream = Files.newOutputStream(storagePath)) {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputStream, data);
        } catch (IOException e) {
            throw new UncheckedIOException("Unable to write requests", e);
        }
    }
}
