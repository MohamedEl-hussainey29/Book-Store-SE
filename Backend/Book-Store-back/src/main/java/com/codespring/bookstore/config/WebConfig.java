package com.codespring.bookstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Vite removed "/api", so Spring sees "/images/..."
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:/app/uploads/");
    }
}