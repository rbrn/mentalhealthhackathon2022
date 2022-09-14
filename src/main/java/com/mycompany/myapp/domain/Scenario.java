package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Category;
import com.mycompany.myapp.domain.enumeration.Subcategory;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Scenario.
 */
@Entity
@Table(name = "scenario")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Scenario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "jhi_order", nullable = false)
    private String order;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "identifier", nullable = false)
    private String identifier;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @NotNull
    @Column(name = "audio_file_name", nullable = false)
    private String audioFileName;

    @Column(name = "rntype")
    private String rntype;

    @Column(name = "theme")
    private String theme;

    @Enumerated(EnumType.STRING)
    @Column(name = "cathegory")
    private Category cathegory;

    @Enumerated(EnumType.STRING)
    @Column(name = "subcat")
    private Subcategory subcat;

    @Column(name = "scenario_number")
    private String scenarioNumber;

    @Column(name = "trial_type")
    private String trialType;

    @Column(name = "repeatable")
    private Boolean repeatable;

    @Column(name = "positivity")
    private Boolean positivity;

    @Column(name = "vividness")
    private Boolean vividness;

    @Column(name = "created_date")
    private ZonedDateTime createdDate;

    @ManyToOne
    private Session session;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Scenario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrder() {
        return this.order;
    }

    public Scenario order(String order) {
        this.setOrder(order);
        return this;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public String getName() {
        return this.name;
    }

    public Scenario name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentifier() {
        return this.identifier;
    }

    public Scenario identifier(String identifier) {
        this.setIdentifier(identifier);
        return this;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getText() {
        return this.text;
    }

    public Scenario text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAudioFileName() {
        return this.audioFileName;
    }

    public Scenario audioFileName(String audioFileName) {
        this.setAudioFileName(audioFileName);
        return this;
    }

    public void setAudioFileName(String audioFileName) {
        this.audioFileName = audioFileName;
    }

    public String getRntype() {
        return this.rntype;
    }

    public Scenario rntype(String rntype) {
        this.setRntype(rntype);
        return this;
    }

    public void setRntype(String rntype) {
        this.rntype = rntype;
    }

    public String getTheme() {
        return this.theme;
    }

    public Scenario theme(String theme) {
        this.setTheme(theme);
        return this;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public Category getCathegory() {
        return this.cathegory;
    }

    public Scenario cathegory(Category cathegory) {
        this.setCathegory(cathegory);
        return this;
    }

    public void setCathegory(Category cathegory) {
        this.cathegory = cathegory;
    }

    public Subcategory getSubcat() {
        return this.subcat;
    }

    public Scenario subcat(Subcategory subcat) {
        this.setSubcat(subcat);
        return this;
    }

    public void setSubcat(Subcategory subcat) {
        this.subcat = subcat;
    }

    public String getScenarioNumber() {
        return this.scenarioNumber;
    }

    public Scenario scenarioNumber(String scenarioNumber) {
        this.setScenarioNumber(scenarioNumber);
        return this;
    }

    public void setScenarioNumber(String scenarioNumber) {
        this.scenarioNumber = scenarioNumber;
    }

    public String getTrialType() {
        return this.trialType;
    }

    public Scenario trialType(String trialType) {
        this.setTrialType(trialType);
        return this;
    }

    public void setTrialType(String trialType) {
        this.trialType = trialType;
    }

    public Boolean getRepeatable() {
        return this.repeatable;
    }

    public Scenario repeatable(Boolean repeatable) {
        this.setRepeatable(repeatable);
        return this;
    }

    public void setRepeatable(Boolean repeatable) {
        this.repeatable = repeatable;
    }

    public Boolean getPositivity() {
        return this.positivity;
    }

    public Scenario positivity(Boolean positivity) {
        this.setPositivity(positivity);
        return this;
    }

    public void setPositivity(Boolean positivity) {
        this.positivity = positivity;
    }

    public Boolean getVividness() {
        return this.vividness;
    }

    public Scenario vividness(Boolean vividness) {
        this.setVividness(vividness);
        return this;
    }

    public void setVividness(Boolean vividness) {
        this.vividness = vividness;
    }

    public ZonedDateTime getCreatedDate() {
        return this.createdDate;
    }

    public Scenario createdDate(ZonedDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Session getSession() {
        return this.session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Scenario session(Session session) {
        this.setSession(session);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Scenario)) {
            return false;
        }
        return id != null && id.equals(((Scenario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Scenario{" +
            "id=" + getId() +
            ", order='" + getOrder() + "'" +
            ", name='" + getName() + "'" +
            ", identifier='" + getIdentifier() + "'" +
            ", text='" + getText() + "'" +
            ", audioFileName='" + getAudioFileName() + "'" +
            ", rntype='" + getRntype() + "'" +
            ", theme='" + getTheme() + "'" +
            ", cathegory='" + getCathegory() + "'" +
            ", subcat='" + getSubcat() + "'" +
            ", scenarioNumber='" + getScenarioNumber() + "'" +
            ", trialType='" + getTrialType() + "'" +
            ", repeatable='" + getRepeatable() + "'" +
            ", positivity='" + getPositivity() + "'" +
            ", vividness='" + getVividness() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
