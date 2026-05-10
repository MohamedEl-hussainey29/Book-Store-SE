package com.codespring.bookstore.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Aspect
@Component
@Slf4j
public class AuditAspect {


    @Pointcut("execution(* com.codespring.bookstore.services.BookService.createBook(..))" +
            " || execution(* com.codespring.bookstore.services.BookService.updateBook(..))" +
            " || execution(* com.codespring.bookstore.services.BookService.deleteBook(..))")
    public void bookAdminOperations() {}


    @Pointcut("execution(* com.codespring.bookstore.services.CategoryService.createCategory(..))" +
            " || execution(* com.codespring.bookstore.services.CategoryService.updateCategory(..))" +
            " || execution(* com.codespring.bookstore.services.CategoryService.deleteCategory(..))")
    public void categoryAdminOperations() {}

    @Pointcut("execution(* com.codespring.bookstore.services.OrderService.updateOrderStatus(..))")
    public void orderAdminOperations() {}

    @Pointcut("execution(* com.codespring.bookstore.services.UserService.createAdmin(..))" +
            " || execution(* com.codespring.bookstore.services.UserService.deleteUser(..))")
    public void userAdminOperations() {}



    @After("bookAdminOperations() || categoryAdminOperations() " +
            "|| orderAdminOperations() || userAdminOperations()")
    public void auditAdminAction(JoinPoint joinPoint) {

        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        String timestamp  = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        log.info("🔒 [AUDIT - SECURITY] Admin action performed | " +
                        "Method: {}.{}() | Time: {}",
                className, methodName, timestamp);
    }
}