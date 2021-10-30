package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.payload.response.MessageResponse;

import java.util.List;

public interface ClassificationService {

//    Boolean subMenuExists(String id, String subMenu);
    void insert(Classification classification);
    Boolean classificationExists(String classification);
    List<Classification> all();
    Classification getById(String id);
    Classification getByName(String name);
    String save(Classification classification);
    MessageResponse editName(Classification classification, String name);
//    MessageResponse delete(String id);
    MessageResponse deleteById(String id);
    MessageResponse deleteSubMenu(String classificationId, String subMenuId);
    MessageResponse editItemName(String id, String currentName, String name, String link);
    void deleteTableEntities();
}
