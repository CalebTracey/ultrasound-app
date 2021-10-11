package com.ultrasound.app.service;

import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.SubMenu;

import java.util.List;

public interface SubMenuService {

    SubMenu save(SubMenu subMenu);
    SubMenu getById(String id);
    String insert(SubMenu subMenu);
    String deleteById(String id);
    String deleteByIdClassification(String classificationId, String subMenuId);
    String editName(Classification classification, SubMenu subMenu, String id, String name);
    String editItemName(String id, String currentName, String name, String link);
    void deleteTableEntities();
    Boolean isItemPresent(String link);

}
