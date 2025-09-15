package com.empresa.app.repository;

import java.util.Map;

import com.empresa.app.model.Request;

public interface RequestRepository {

    Map<String, Request> findAll();

    void save(String key, Request request);

    void delete(String key);
}
