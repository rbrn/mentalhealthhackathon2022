package db.com.mentalhealth.domain.enumeration;

/**
 * The TrialType enumeration.
 */
public enum TrialType {
    P_ENUM("P"),
    SG_ENUM("SG");

    private final String value;

    TrialType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
