package db.com.mentalhealth.domain.enumeration;

/**
 * The ScenarioStatus enumeration.
 */
public enum ScenarioStatus {
    START("Start"),
    END("End");

    private final String value;

    ScenarioStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
