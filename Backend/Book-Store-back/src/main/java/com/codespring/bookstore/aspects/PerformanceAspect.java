package com.codespring.bookstore.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * ══════════════════════════════════════════════════════════
 *  PERFORMANCE ASPECT  (Cross-cutting Concern → from lecture)
 * ══════════════════════════════════════════════════════════
 *
 * This is the EXACT pattern shown in the lecture demo (slide 19):
 *
 *   @Around(value = "execution(* com.global.book.service..*(..))")
 *   public Object logTime(ProceedingJoinPoint joinPoint) throws Throwable {
 *       long startTime = System.currentTimeMillis();
 *       ...
 *       Object returnValue = joinPoint.proceed();  ← run the actual method
 *       log.info(... System.currentTimeMillis() - startTime ... "ms");
 *       return returnValue;
 *   }
 *
 * Advice type used (lecture slide 21):
 *   @Around → "surrounds the join point method — most powerful advice.
 *              Can choose whether to execute the join point or not.
 *              Runs code BEFORE and AFTER the actual method."
 */
@Aspect
@Component
@Slf4j
public class PerformanceAspect {

    // ── POINTCUT ──────────────────────────────────────────────────────────────
    // Same package as LoggingAspect — targets all service methods

    @Pointcut("execution(* com.codespring.bookstore.services.*.*(..))")
    public void allServiceMethods() {}

    // ── AROUND ADVICE (lecture slides 19, 21) ─────────────────────────────────
    //
    // "Around Advice: surrounds the join point method.
    //  It is the responsibility of around advice to invoke the join point
    //  method and return values if the method is returning something."
    //
    // How it works:
    //   1. Record start time  (BEFORE the method)
    //   2. joinPoint.proceed() → actually run the real method (JoinPoint)
    //   3. Calculate duration (AFTER the method)
    //   4. Log the result
    //   5. Return the result (required for @Around)

    @Around("allServiceMethods()")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {

        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        // ── BEFORE part ───────────────────────────────────────────────────────
        long startTime = System.currentTimeMillis(); // same as lecture demo

        // ── JOINPOINT execution ───────────────────────────────────────────────
        // "joinPoint.proceed() → run the actual method"  (lecture slide 19)
        Object returnValue = joinPoint.proceed();

        // ── AFTER part ────────────────────────────────────────────────────────
        long duration = System.currentTimeMillis() - startTime;

        // Warn if a method takes more than 500ms (potential performance issue)
        if (duration > 500) {
            log.warn("⚠ [PERFORMANCE] {}.{}() took {} ms — SLOW!",
                    className, methodName, duration);
        } else {
            log.info("⏱ [PERFORMANCE] {}.{}() took {} ms",
                    className, methodName, duration);
        }

        return returnValue; // "return values if the method is returning something"
    }
}