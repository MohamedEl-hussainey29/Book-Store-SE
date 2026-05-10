package com.codespring.bookstore.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * ══════════════════════════════════════════════════════════
 *  AUDIT ASPECT  (Cross-cutting Concern → Security from lecture)
 * ══════════════════════════════════════════════════════════
 *
 * Lecture slide 12 — Cross-cutting Concerns list:
 *   "Security" — applied vertically across all services
 *
 * Lecture slide 13 — AOP diagram:
 *   "Security Aspect" is one of the three example aspects shown
 *   alongside Logging Aspect and Transaction Aspect.
 *
 * Lecture slide 9 — Before AOP diagram:
 *   Security was a crosscutting concern inside Financial,
 *   Timecard, and Scheduling. After AOP → Security becomes
 *   its own separate module.
 *
 * Here: tracks every sensitive admin action (create, update, delete)
 * across BookService and CategoryService — exactly the
 * "Security" concern from the lecture applied to the bookstore.
 *
 * Advice type used (lecture slide 21):
 *   @After → "gets executed after the join point method finishes,
 *              whether normally OR by throwing an exception"
 */
@Aspect
@Component
@Slf4j
public class AuditAspect {

    // ── POINTCUTS (lecture slide 23) ──────────────────────────────────────────
    //
    // "Point cut: expressions matched with joint points to determine
    //  whether advice needs to be executed"
    //
    // These pointcuts target ONLY the write operations (admin actions).
    // Read operations (getAll, getById) are excluded — no audit needed.

    // All write operations in BookService
    @Pointcut("execution(* com.codespring.bookstore.services.BookService.createBook(..))" +
            " || execution(* com.codespring.bookstore.services.BookService.updateBook(..))" +
            " || execution(* com.codespring.bookstore.services.BookService.deleteBook(..))")
    public void bookAdminOperations() {}

    // All write operations in CategoryService
    @Pointcut("execution(* com.codespring.bookstore.services.CategoryService.createCategory(..))" +
            " || execution(* com.codespring.bookstore.services.CategoryService.updateCategory(..))" +
            " || execution(* com.codespring.bookstore.services.CategoryService.deleteCategory(..))")
    public void categoryAdminOperations() {}

    // All order status updates (admin only)
    @Pointcut("execution(* com.codespring.bookstore.services.OrderService.updateOrderStatus(..))")
    public void orderAdminOperations() {}

    // All user management by admin
    @Pointcut("execution(* com.codespring.bookstore.services.UserService.createAdmin(..))" +
            " || execution(* com.codespring.bookstore.services.UserService.deleteUser(..))")
    public void userAdminOperations() {}

    // ── AFTER ADVICE (lecture slide 21) ───────────────────────────────────────
    //
    // "After (finally) Advice: gets executed after the join point method
    //  finishes executing, whether normally or by throwing an exception"
    //
    // Applied to: all admin write operations across all services
    // Purpose:    record every admin action with timestamp
    //             (this is the "Security" cross-cutting concern from lecture)

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