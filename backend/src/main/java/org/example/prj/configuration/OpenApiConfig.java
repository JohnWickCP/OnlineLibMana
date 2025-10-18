package org.example.prj.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "E-Commerce API",
                version = "1.0.0",
                description = "Tài liệu API cho hệ thống bán hàng.",
                contact = @Contact(name = "Developer Team", email = "support@yourcompany.com")
        ),
        security = {
                @SecurityRequirement(name = "bearer-key")
        }
)
@SecurityScheme(
        name = "bearer-key",                   // Tên scheme này dùng trong @SecurityRequirement
        type = SecuritySchemeType.HTTP,        // Loại HTTP Authorization
        scheme = "bearer",                     // Bearer token
        bearerFormat = "JWT",                  // Định dạng JWT
        in = SecuritySchemeIn.HEADER           // Token nằm trong Header
)
public class OpenApiConfig {
}
