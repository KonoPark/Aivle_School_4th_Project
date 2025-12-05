package com.aivle0102.book.controller;

import com.aivle0102.book.domain.UserInfo;
import com.aivle0102.book.dto.UserSignUpRequest;
import com.aivle0102.book.service.LoginService;
import com.aivle0102.book.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")   // → /user/xxx 로 묶어서 사용
@RequiredArgsConstructor
public class AuthController {

    private final LoginService loginService;   // 로그인 서비스
    private final UserService userService;     // 우리가 만든 회원가입 서비스

    // =========================
    // 1) 로그인
    // =========================
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserInfo user,
                                                     HttpSession session) {

        Map<String, Object> body = new HashMap<>();

        try {

            UserInfo loginUser = loginService.getUser(user);

            // 세션에 userId 저장
            session.setAttribute("user", loginUser.getUserId());

            Map<String, Object> data = new HashMap<>();
            data.put("userId", loginUser.getUserId());
            data.put("email", loginUser.getEmail());

            body.put("status", "success");
            body.put("message", "로그인 성공");
            body.put("data", data);

            return ResponseEntity.ok(body);

        } catch (Exception e) {
            body.put("status", "error");
            body.put("message", "로그인 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }
    }

    // 간단 로그아웃 (있으면 좋으니까 같이 넣어둠)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session) {
        Map<String, Object> body = new HashMap<>();
        session.invalidate();

        body.put("status", "success");
        body.put("message", "로그아웃 성공");

        return ResponseEntity.ok(body);
    }

    // =========================
    // 2) 회원가입
    // =========================
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody UserSignUpRequest request) {

        Map<String, Object> body = new HashMap<>();

        try {
            // 실제 회원가입 로직
            UserInfo user = userService.signUp(request);

            Map<String, Object> data = new HashMap<>();
            data.put("userId", user.getUserId());
            data.put("email", user.getEmail());

            body.put("status", "success");
            body.put("message", "회원가입 성공");
            body.put("data", data);

            // code: 201
            return ResponseEntity.status(HttpStatus.CREATED).body(body);

        } catch (IllegalStateException e) { // 이미 가입된 이메일 등
            body.put("status", "error");
            body.put("message", e.getMessage());

            // code: 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);

        } catch (Exception e) { // 기타 서버 에러
            body.put("status", "error");
            body.put("message", "서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.");

            // code: 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }
}
