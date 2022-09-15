package db.com.mentalhealth.domain.enumeration;

/**
 * The Theme enumeration.
 */
public enum Theme {
    DOMESTIC("Domestic"),
    NON_DOMESTIC("Non-domestic");

    private final String value;

    Theme(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
