package com.aivle0102.book.controller;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.service.LoginService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<?> LoginForm_Page(@RequestBody UserInfo user, HttpSession session) throws Exception {

        UserInfo loginUser = loginService.getUser(user);
        session.setAttribute("user", loginUser.getUserId());

        return ResponseEntity.ok("로그인 성공");
    }

}
