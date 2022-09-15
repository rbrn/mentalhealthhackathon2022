package db.com.mentalhealth.web.rest;

import db.com.mentalhealth.domain.ScenarioStatusEvent;
import db.com.mentalhealth.repository.ScenarioStatusEventRepository;
import db.com.mentalhealth.service.ScenarioStatusEventService;
import db.com.mentalhealth.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link db.com.mentalhealth.domain.ScenarioStatusEvent}.
 */
@RestController
@RequestMapping("/api")
public class ScenarioStatusEventResource {

    private final Logger log = LoggerFactory.getLogger(ScenarioStatusEventResource.class);

    private static final String ENTITY_NAME = "scenarioStatusEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScenarioStatusEventService scenarioStatusEventService;

    private final ScenarioStatusEventRepository scenarioStatusEventRepository;

    public ScenarioStatusEventResource(
        ScenarioStatusEventService scenarioStatusEventService,
        ScenarioStatusEventRepository scenarioStatusEventRepository
    ) {
        this.scenarioStatusEventService = scenarioStatusEventService;
        this.scenarioStatusEventRepository = scenarioStatusEventRepository;
    }

    /**
     * {@code POST  /scenario-status-events} : Create a new scenarioStatusEvent.
     *
     * @param scenarioStatusEvent the scenarioStatusEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new scenarioStatusEvent, or with status {@code 400 (Bad Request)} if the scenarioStatusEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/scenario-status-events")
    public ResponseEntity<ScenarioStatusEvent> createScenarioStatusEvent(@RequestBody ScenarioStatusEvent scenarioStatusEvent)
        throws URISyntaxException {
        log.debug("REST request to save ScenarioStatusEvent : {}", scenarioStatusEvent);
        if (scenarioStatusEvent.getId() != null) {
            throw new BadRequestAlertException("A new scenarioStatusEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ScenarioStatusEvent result = scenarioStatusEventService.save(scenarioStatusEvent);
        return ResponseEntity
            .created(new URI("/api/scenario-status-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /scenario-status-events/:id} : Updates an existing scenarioStatusEvent.
     *
     * @param id the id of the scenarioStatusEvent to save.
     * @param scenarioStatusEvent the scenarioStatusEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated scenarioStatusEvent,
     * or with status {@code 400 (Bad Request)} if the scenarioStatusEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the scenarioStatusEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/scenario-status-events/{id}")
    public ResponseEntity<ScenarioStatusEvent> updateScenarioStatusEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ScenarioStatusEvent scenarioStatusEvent
    ) throws URISyntaxException {
        log.debug("REST request to update ScenarioStatusEvent : {}, {}", id, scenarioStatusEvent);
        if (scenarioStatusEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, scenarioStatusEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scenarioStatusEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ScenarioStatusEvent result = scenarioStatusEventService.update(scenarioStatusEvent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, scenarioStatusEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /scenario-status-events/:id} : Partial updates given fields of an existing scenarioStatusEvent, field will ignore if it is null
     *
     * @param id the id of the scenarioStatusEvent to save.
     * @param scenarioStatusEvent the scenarioStatusEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated scenarioStatusEvent,
     * or with status {@code 400 (Bad Request)} if the scenarioStatusEvent is not valid,
     * or with status {@code 404 (Not Found)} if the scenarioStatusEvent is not found,
     * or with status {@code 500 (Internal Server Error)} if the scenarioStatusEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/scenario-status-events/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ScenarioStatusEvent> partialUpdateScenarioStatusEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ScenarioStatusEvent scenarioStatusEvent
    ) throws URISyntaxException {
        log.debug("REST request to partial update ScenarioStatusEvent partially : {}, {}", id, scenarioStatusEvent);
        if (scenarioStatusEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, scenarioStatusEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scenarioStatusEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ScenarioStatusEvent> result = scenarioStatusEventService.partialUpdate(scenarioStatusEvent);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, scenarioStatusEvent.getId().toString())
        );
    }

    /**
     * {@code GET  /scenario-status-events} : get all the scenarioStatusEvents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of scenarioStatusEvents in body.
     */
    @GetMapping("/scenario-status-events")
    public ResponseEntity<List<ScenarioStatusEvent>> getAllScenarioStatusEvents(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of ScenarioStatusEvents");
        Page<ScenarioStatusEvent> page = scenarioStatusEventService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /scenario-status-events/:id} : get the "id" scenarioStatusEvent.
     *
     * @param id the id of the scenarioStatusEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the scenarioStatusEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/scenario-status-events/{id}")
    public ResponseEntity<ScenarioStatusEvent> getScenarioStatusEvent(@PathVariable Long id) {
        log.debug("REST request to get ScenarioStatusEvent : {}", id);
        Optional<ScenarioStatusEvent> scenarioStatusEvent = scenarioStatusEventService.findOne(id);
        return ResponseUtil.wrapOrNotFound(scenarioStatusEvent);
    }

    /**
     * {@code DELETE  /scenario-status-events/:id} : delete the "id" scenarioStatusEvent.
     *
     * @param id the id of the scenarioStatusEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/scenario-status-events/{id}")
    public ResponseEntity<Void> deleteScenarioStatusEvent(@PathVariable Long id) {
        log.debug("REST request to delete ScenarioStatusEvent : {}", id);
        scenarioStatusEventService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
