package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.SubMenuNotFoundException;
import com.ultrasound.app.model.data.Classification;
import com.ultrasound.app.model.data.ListItem;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.repo.SubMenuRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class SubMenuServiceImpl implements SubMenuService{

    @Autowired
    private SubMenuRepo subMenuRepo;

    @Autowired
    private ClassificationServiceImpl classificationService;

    @Override
    public String save(SubMenu subMenu) {
        return subMenuRepo.save(subMenu).get_id();
    }

    @Override
    public String saveReturnName(SubMenu subMenu) {
        return subMenuRepo.save(subMenu).getName();
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
    public String deleteById(String id) {
        SubMenu subMenu = getById(id);
        String name = subMenu.getName();
        int count = subMenu.getItemList().size();
        log.info("Deleting Submenu {} and {} listItems",name, count);
        subMenuRepo.delete(subMenu);
        return "Deleted submenu " + name + " and " + count + " list items";
    }

    @Override
    public String deleteByIdClassification(String classificationId, String subMenuId) {
        Classification classification = classificationService.getById(classificationId);
        String className = classification.getName();
        String subName = getById(subMenuId).getName();
        classificationService.deleteSubMenu(classificationId, subMenuId);
        deleteById(subMenuId);
        return "Deleted Submenu " + subName + " and removed from classification " + className;
    }


}
