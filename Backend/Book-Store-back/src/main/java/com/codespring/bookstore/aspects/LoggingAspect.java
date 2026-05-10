package com.codespring.bookstore.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * ══════════════════════════════════════════════════════════
 *  LOGGING ASPECT  (Cross-cutting Concern → from lecture)
 * ══════════════════════════════════════════════════════════
 *
 * Lecture slide 12 — Cross-cutting Concerns:
 *   "Logging, Validation, Security, Transactions... applied
 *    across CourseService, StudentService, MiscService"
 *
 * Here it applies across ALL services in the bookstore:
 *   BookService, CartService, OrderService, UserService,
 *   CategoryService, FavouriteService
 *
 * Advice types used (lecture slide 21):
 *   @Before         → runs BEFORE the method executes
 *   @AfterReturning → runs AFTER method returns successfully
 *   @AfterThrowing  → runs AFTER method throws an exception
 */
@Aspect           // ← marks this class as an Aspect (lecture slide 18)
@Component        // ← makes Spring manage it as a bean
@Slf4j            // ← Lombok logger
public class LoggingAspect {

    // ── POINTCUT (lecture slide 23) ───────────────────────────────────────────
    //
    // "execution(* com.global.book.service..*(..))
    //   *         → any return type
    //   services  → the services package
    //   *.*       → any class, any method
    //   (..)      → any number of parameters"
    //
    // This POINTCUT targets every method in every service class.
    // This is what the lecture calls "multicasting the same aspect
    // into many places" — one expression, covers all 6 services.

    @Pointcut("execution(* com.codespring.bookstore.services.*.*(..))")
    public void allServiceMethods() {}
    // ↑ JoinPoint = "a specific point in the application such as
    //   method execution" (lecture slide 19)

    // ── BEFORE ADVICE (lecture slide 21) ─────────────────────────────────────
    //
    // "Before Advice: runs before the execution of join point methods"
    //
    // Applied to: every method in every service
    // Purpose:    log which method is being called and with what arguments

    @Before("allServiceMethods()")
    public void logBeforeMethod(JoinPoint joinPoint) {
        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args     = joinPoint.getArgs();

        log.info("▶ [BEFORE] {}.{}() called with args: {}",
                className, methodName, Arrays.toString(args));
    }

    // ── AFTER RETURNING ADVICE (lecture slide 21) ─────────────────────────────
    //
    // "After Returning Advice: executes only if the join point method
    //  executes normally (no exception)"
    //
    // Applied to: every method in every service
    // Purpose:    log that the method completed successfully + what it returned

    @AfterReturning(pointcut = "allServiceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.info("✅ [AFTER RETURNING] {}.{}() completed successfully. Returned: {}",
                className, methodName, result);
    }

    // ── AFTER THROWING ADVICE (lecture slide 21) ──────────────────────────────
    //
    // "After Throwing Advice: gets executed only when join point method
    //  throws an exception"
    //
    // Applied to: every method in every service
    // Purpose:    log exactly which method failed and what the error was

    @AfterThrowing(pointcut = "allServiceMethods()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Exception exception) {
        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.error("❌ [AFTER THROWING] {}.{}() threw exception: {} → {}",
                className, methodName,
                exception.getClass().getSimpleName(),
                exception.getMessage());
    }
}