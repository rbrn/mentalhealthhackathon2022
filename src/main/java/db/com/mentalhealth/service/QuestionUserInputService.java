package db.com.mentalhealth.service;

import db.com.mentalhealth.domain.QuestionUserInput;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link QuestionUserInput}.
 */
public interface QuestionUserInputService {
    /**
     * Save a questionUserInput.
     *
     * @param questionUserInput the entity to save.
     * @return the persisted entity.
     */
    QuestionUserInput save(QuestionUserInput questionUserInput);

    /**
     * Updates a questionUserInput.
     *
     * @param questionUserInput the entity to update.
     * @return the persisted entity.
     */
    QuestionUserInput update(QuestionUserInput questionUserInput);

    /**
     * Partially updates a questionUserInput.
     *
     * @param questionUserInput the entity to update partially.
     * @return the persisted entity.
     */
    Optional<QuestionUserInput> partialUpdate(QuestionUserInput questionUserInput);

    /**
     * Get all the questionUserInputs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<QuestionUserInput> findAll(Pageable pageable);

    /**
     * Get all the questionUserInputs with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<QuestionUserInput> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" questionUserInput.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<QuestionUserInput> findOne(Long id);

    /**
     * Delete the "id" questionUserInput.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
