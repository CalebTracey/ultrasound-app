package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.ClassificationNotFoundException;
import com.ultrasound.app.exceptions.SubMenuNotFoundException;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.EType;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.payload.response.MessageResponse;
import com.ultrasound.app.repo.SubMenuRepo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Predicate;

@Slf4j
@Service
public class SubMenuServiceImpl implements SubMenuService{

    @Autowired
    private SubMenuRepo subMenuRepo;
    @Autowired
    private ClassificationServiceImpl classificationService;
    @Autowired
    private ItemServiceImpl itemService;

    @Override
    public SubMenu save(SubMenu subMenu) {
        return subMenuRepo.save(subMenu);
    }

    @Override
    public SubMenu getById(String id) {
        return subMenuRepo.findById(id).orElseThrow(() -> new SubMenuNotFoundException(id));
    }

    @Override
    public String insert(SubMenu subMenu) {
        return subMenuRepo.insert(subMenu).get_id();
    }

    @Override
    public boolean existsById(String id) {
        return subMenuRepo.existsById(id);
    }

    @Override
    public MessageResponse deleteById(String id) {
        SubMenu subMenu = getById(id);
        Classification classification = classificationService.getByName(subMenu.getClassification());
        String name = subMenu.getName();
        int count = subMenu.getItemList().size();
        log.info("Deleting Submenu {} and {} listItems",name, count);
        subMenuRepo.delete(subMenu);
        return new MessageResponse("Deleted submenu " + name + " and " + count + " list items");
    }

    @Override
    public MessageResponse createNew(String classificationId, String name) {
        Classification classification = classificationService.getById(classificationId);
        SubMenu newSubMenu = new SubMenu(name, new ArrayList<>(), EType.TYPE_SUB_MENU);
        String newSubMenuId = save(newSubMenu).get_id();
        Map<String, String> classificationSubMenus = new TreeMap<>(classification.getSubMenus());
        classificationSubMenus.put(name, newSubMenuId);
        classification.setSubMenus(classificationSubMenus);
        classificationService.save(classification);

        return new MessageResponse("Added " + name + " to " + classification.getName());
    }

    @Override
    public MessageResponse deleteByIdClassification(String classificationId, String subMenuId) {
        String subName = getById(subMenuId).getName();
        classificationService.deleteSubMenu(classificationId, subMenuId);
        deleteById(subMenuId);
        return new MessageResponse("Deleted " + subName);
    }

    @Override
    public MessageResponse editName(
            @NotNull Classification classification, @NotNull SubMenu subMenu, String id, String name) {
        String origName = subMenu.getName();
        Map<String, String> subMenus = new TreeMap<>(classification.getSubMenus());
        subMenus.put(name, id);
        subMenus.remove(origName);
        classification.setSubMenus(subMenus);
        classificationService.save(classification);

        StringBuilder stringBuilder = new StringBuilder();
        subMenu.setName(name);
        subMenu.getItemList().forEach(listItem -> {
            stringBuilder.setLength(0);
            stringBuilder.append(classification.getName()).append(" ").append(name).append(" ").append(listItem.getName());
            listItem.setTitle(stringBuilder.toString());
        });
        stringBuilder.setLength(0);
        log.info("Changing Submenu name {} to {} in Classification: {}",origName, name, classification.getName());
        subMenuRepo.save(subMenu);
        stringBuilder.append("Changed Submenu name ").append(origName).append(" to ").append(name);
        return new MessageResponse(stringBuilder.toString());
    }

    @Override
    public MessageResponse editItemName(String id, String currentName, String name, String link) {
        SubMenu subMenu = getById(id);
        String subName = subMenu.getName();
        List<ListItem> listItems = subMenu.getItemList();
        List<ListItem> itemList;

        ListItem item = itemService.findByLink(listItems, link, name, "submenu", subName);
        if (listItems.size() > 1) {
            itemList = itemService.removeItemFromList(listItems, link);
        } else {
            itemList = new ArrayList<>();
            itemList.add(item);
        }
        item.setName(name);
        item.setTitle(subMenu.getClassification() + " " + subMenu.getName() + " " + name);
        itemList.add(item);
        subMenu.setItemList(new ArrayList<>(new LinkedHashSet<>(itemList)));
        save(subMenu);
        return new MessageResponse("Saved " + currentName + " as " + name + " in " + subName);
    }

    @Override
    public void deleteTableEntities() {
        subMenuRepo.deleteAll();
    }
}
