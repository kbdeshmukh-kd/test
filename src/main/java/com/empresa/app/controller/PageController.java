package com.empresa.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/request"})
    public String requestForm() {
        return "request";
    }

    @GetMapping("/listrequest")
    public String listRequests() {
        return "listrequest";
    }
}
