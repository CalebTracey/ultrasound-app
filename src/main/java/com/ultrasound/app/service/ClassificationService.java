package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;

import java.util.List;
import java.util.Map;

public interface ClassificationService {

    Boolean subMenuExists(String id, String subMenu);
    void insert(Classification classification);
    Classification getClassificationByName(String name);
    Boolean classificationExists(String classification);
    List<Classification> all();
    String save(Classification classification);
    String updateClassificationName(String id, String name);
    String updateSubMenuName(String classificationId, String subMenuId, String name);
}
