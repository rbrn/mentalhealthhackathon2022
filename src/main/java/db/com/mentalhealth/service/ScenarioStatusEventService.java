package db.com.mentalhealth.service;

import db.com.mentalhealth.domain.ScenarioStatusEvent;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ScenarioStatusEvent}.
 */
public interface ScenarioStatusEventService {
    /**
     * Save a scenarioStatusEvent.
     *
     * @param scenarioStatusEvent the entity to save.
     * @return the persisted entity.
     */
    ScenarioStatusEvent save(ScenarioStatusEvent scenarioStatusEvent);

    /**
     * Updates a scenarioStatusEvent.
     *
     * @param scenarioStatusEvent the entity to update.
     * @return the persisted entity.
     */
    ScenarioStatusEvent update(ScenarioStatusEvent scenarioStatusEvent);

    /**
     * Partially updates a scenarioStatusEvent.
     *
     * @param scenarioStatusEvent the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ScenarioStatusEvent> partialUpdate(ScenarioStatusEvent scenarioStatusEvent);

    /**
     * Get all the scenarioStatusEvents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ScenarioStatusEvent> findAll(Pageable pageable);

    /**
     * Get the "id" scenarioStatusEvent.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ScenarioStatusEvent> findOne(Long id);

    /**
     * Delete the "id" scenarioStatusEvent.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
