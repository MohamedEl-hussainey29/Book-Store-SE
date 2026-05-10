package com.codespring.bookstore.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;


@Aspect
@Component
@Slf4j
public class LoggingAspect {



    @Pointcut("execution(* com.codespring.bookstore.services.*.*(..))")
    public void allServiceMethods() {}


    @Before("allServiceMethods()")
    public void logBeforeMethod(JoinPoint joinPoint) {
        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args     = joinPoint.getArgs();

        log.info("▶ [BEFORE] {}.{}() called with args: {}",
                className, methodName, Arrays.toString(args));
    }



    @AfterReturning(pointcut = "allServiceMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.info("✅ [AFTER RETURNING] {}.{}() completed successfully. Returned: {}",
                className, methodName, result);
    }



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