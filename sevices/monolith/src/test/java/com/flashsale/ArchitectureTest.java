package com.flashsale;

import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

class ArchitectureTest {

    @Test
    void repositoriesMustOnlyBeAccessedWithinTheirOwnPackage() {
        var classes = new ClassFileImporter().importPackages("com.flashsale");
        ArchRule rule = classes().that().resideInAPackage("..repository..")
                .should().onlyBeAccessed()
                .byClassesThat().resideInAnyPackage("..repository..", "com.flashsale.config..")
                .allowEmptyShould(true);
        // NOTE: intentionally lenient — service/DTO cross-reads allowed in Task 1.
        // Tighten (services package-private too) when microservices extraction starts.
        rule.check(classes);
    }
}