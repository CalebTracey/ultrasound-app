package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;

import java.util.List;

public interface ClassificationService {

    Boolean subMenuExists(String id, String subMenu);
    void insert(Classification classification);
    Classification getClassificationByName(String name);
    Boolean classificationExists(String classification);
    List<Classification> all();
    Classification getById(String id);
    String save(Classification classification);
    String updateClassificationName(String id, String name);
    String updateSubMenuName(String classificationId, String subMenuId, String name);
    String delete(String id);
    void deleteSubMenu(String classificationId, String subMenuId);
}
