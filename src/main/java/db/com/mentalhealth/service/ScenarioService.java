package db.com.mentalhealth.service;

import db.com.mentalhealth.domain.Scenario;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Scenario}.
 */
public interface ScenarioService {
    /**
     * Save a scenario.
     *
     * @param scenario the entity to save.
     * @return the persisted entity.
     */
    Scenario save(Scenario scenario);

    /**
     * Updates a scenario.
     *
     * @param scenario the entity to update.
     * @return the persisted entity.
     */
    Scenario update(Scenario scenario);

    /**
     * Partially updates a scenario.
     *
     * @param scenario the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Scenario> partialUpdate(Scenario scenario);

    /**
     * Get all the scenarios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Scenario> findAll(Pageable pageable);

    /**
     * Get all the scenarios with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Scenario> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" scenario.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Scenario> findOne(Long id);

    /**
     * Delete the "id" scenario.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
