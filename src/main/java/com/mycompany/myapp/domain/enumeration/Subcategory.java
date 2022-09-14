package com.mycompany.myapp.domain.enumeration;

/**
 * The Subcategory enumeration.
 */
public enum Subcategory {
    SUBC1("Bug"),
    SUBC2("Feature");

    private final String value;

    Subcategory(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
