package com.ultrasound.app.service;

public interface ItemService {
    String deleteItemClassification(String classificationId, String title, String name);
    String deleteItemSubMenu(String subMenuId,String title, String name);
}
