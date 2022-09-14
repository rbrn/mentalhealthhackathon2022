package com.mycompany.myapp.domain.enumeration;

/**
 * The Category enumeration.
 */
public enum Category {
    CAT1("Bug"),
    CAT2("Feature");

    private final String value;

    Category(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
