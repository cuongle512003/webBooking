package com.group.prj.service;

import java.util.List;

import com.group.prj.model.User;

public interface IUserService {

    User registerUser(User user);

    List<User> getUsers();

    void deleteUser(String email);

    User getUser(String name);

}
