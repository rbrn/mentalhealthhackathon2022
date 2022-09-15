package db.com.mentalhealth.domain.enumeration;

/**
 * The RntType enumeration.
 */
public enum RntType {
    WORRY("Worry"),
    RUMINATION("Rumination");

    private final String value;

    RntType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
