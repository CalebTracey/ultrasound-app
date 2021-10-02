package com.ultrasound.app.service;

import com.ultrasound.app.exceptions.SubMenuNotFoundException;
import com.ultrasound.app.model.data.SubMenu;
import com.ultrasound.app.repo.SubMenuRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubMenuServiceImpl implements SubMenuService{

    @Autowired
    private SubMenuRepo subMenuRepo;

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


}
