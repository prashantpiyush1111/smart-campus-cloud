package com.smartcampus.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smartCampusOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Campus Cloud API")
                        .version("1.0.0")
                        .description("REST API documentation for Smart Campus Cloud Management System.")
                        .contact(new Contact().name("Smart Campus Cloud")));
    }
}
