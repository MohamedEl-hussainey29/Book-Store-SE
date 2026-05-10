package com.codespring.bookstore.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;


@Aspect
@Component
@Slf4j
public class PerformanceAspect {



    @Pointcut("execution(* com.codespring.bookstore.services.*.*(..))")
    public void allServiceMethods() {}



    @Around("allServiceMethods()")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {

        String className  = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        long startTime = System.currentTimeMillis();


        Object returnValue = joinPoint.proceed();

        long duration = System.currentTimeMillis() - startTime;

        if (duration > 500) {
            log.warn("⚠ [PERFORMANCE] {}.{}() took {} ms — SLOW!",
                    className, methodName, duration);
        } else {
            log.info("⏱ [PERFORMANCE] {}.{}() took {} ms",
                    className, methodName, duration);
        }

        return returnValue;
    }
}