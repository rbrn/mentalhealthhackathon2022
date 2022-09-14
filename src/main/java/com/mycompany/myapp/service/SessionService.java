package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Session;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Session}.
 */
public interface SessionService {
    /**
     * Save a session.
     *
     * @param session the entity to save.
     * @return the persisted entity.
     */
    Session save(Session session);

    /**
     * Updates a session.
     *
     * @param session the entity to update.
     * @return the persisted entity.
     */
    Session update(Session session);

    /**
     * Partially updates a session.
     *
     * @param session the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Session> partialUpdate(Session session);

    /**
     * Get all the sessions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Session> findAll(Pageable pageable);

    /**
     * Get the "id" session.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Session> findOne(Long id);

    /**
     * Delete the "id" session.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
