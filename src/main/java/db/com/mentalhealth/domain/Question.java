package db.com.mentalhealth.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "text", nullable = false)
    private String text;

    @NotNull
    @Column(name = "correct_answer", nullable = false)
    private Boolean correctAnswer;

    @NotNull
    @Column(name = "correct_answer_feedback", nullable = false)
    private Boolean correctAnswerFeedback;

    @NotNull
    @Column(name = "wrong_answer_feedback", nullable = false)
    private Boolean wrongAnswerFeedback;

    @Column(name = "created_date")
    private ZonedDateTime createdDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "category", "subcategory", "session" }, allowSetters = true)
    private Scenario scenario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Question id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return this.text;
    }

    public Question text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getCorrectAnswer() {
        return this.correctAnswer;
    }

    public Question correctAnswer(Boolean correctAnswer) {
        this.setCorrectAnswer(correctAnswer);
        return this;
    }

    public void setCorrectAnswer(Boolean correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Boolean getCorrectAnswerFeedback() {
        return this.correctAnswerFeedback;
    }

    public Question correctAnswerFeedback(Boolean correctAnswerFeedback) {
        this.setCorrectAnswerFeedback(correctAnswerFeedback);
        return this;
    }

    public void setCorrectAnswerFeedback(Boolean correctAnswerFeedback) {
        this.correctAnswerFeedback = correctAnswerFeedback;
    }

    public Boolean getWrongAnswerFeedback() {
        return this.wrongAnswerFeedback;
    }

    public Question wrongAnswerFeedback(Boolean wrongAnswerFeedback) {
        this.setWrongAnswerFeedback(wrongAnswerFeedback);
        return this;
    }

    public void setWrongAnswerFeedback(Boolean wrongAnswerFeedback) {
        this.wrongAnswerFeedback = wrongAnswerFeedback;
    }

    public ZonedDateTime getCreatedDate() {
        return this.createdDate;
    }

    public Question createdDate(ZonedDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Scenario getScenario() {
        return this.scenario;
    }

    public void setScenario(Scenario scenario) {
        this.scenario = scenario;
    }

    public Question scenario(Scenario scenario) {
        this.setScenario(scenario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Question)) {
            return false;
        }
        return id != null && id.equals(((Question) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Question{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", correctAnswer='" + getCorrectAnswer() + "'" +
            ", correctAnswerFeedback='" + getCorrectAnswerFeedback() + "'" +
            ", wrongAnswerFeedback='" + getWrongAnswerFeedback() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
