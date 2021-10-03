package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;

import java.util.List;

public interface ClassificationService {

    Boolean subMenuExists(String id, String subMenu);
    void insert(Classification classification);
    Classification getClassificationByName(String name);
    Boolean classificationExists(String classification);
    List<Classification> all();
    Classification getById(String id);
    String save(Classification classification);
    String editName(Classification classification, String name);
    String delete(String id);
    void deleteSubMenu(String classificationId, String subMenuId);
    String editItemName(String id, String currentName, String name, String link);
}
