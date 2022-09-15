package db.com.mentalhealth.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import db.com.mentalhealth.domain.enumeration.ScenarioStatus;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ScenarioStatusEvent.
 */
@Entity
@Table(name = "scenario_status_event")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ScenarioStatusEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id")
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    private ScenarioStatus eventType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "subcategory", "question", "sessionStatuses", "session" }, allowSetters = true)
    private Scenario scenario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ScenarioStatusEvent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public ScenarioStatusEvent userId(String userId) {
        this.setUserId(userId);
        return this;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public ScenarioStatus getEventType() {
        return this.eventType;
    }

    public ScenarioStatusEvent eventType(ScenarioStatus eventType) {
        this.setEventType(eventType);
        return this;
    }

    public void setEventType(ScenarioStatus eventType) {
        this.eventType = eventType;
    }

    public Scenario getScenario() {
        return this.scenario;
    }

    public void setScenario(Scenario scenario) {
        this.scenario = scenario;
    }

    public ScenarioStatusEvent scenario(Scenario scenario) {
        this.setScenario(scenario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ScenarioStatusEvent)) {
            return false;
        }
        return id != null && id.equals(((ScenarioStatusEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ScenarioStatusEvent{" +
            "id=" + getId() +
            ", userId='" + getUserId() + "'" +
            ", eventType='" + getEventType() + "'" +
            "}";
    }
}
