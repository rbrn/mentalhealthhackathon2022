package db.com.mentalhealth.web.rest;

import db.com.mentalhealth.domain.QuestionUserInput;
import db.com.mentalhealth.repository.QuestionUserInputRepository;
import db.com.mentalhealth.service.QuestionUserInputService;
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
 * REST controller for managing {@link db.com.mentalhealth.domain.QuestionUserInput}.
 */
@RestController
@RequestMapping("/api")
public class QuestionUserInputResource {

    private final Logger log = LoggerFactory.getLogger(QuestionUserInputResource.class);

    private static final String ENTITY_NAME = "questionUserInput";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuestionUserInputService questionUserInputService;

    private final QuestionUserInputRepository questionUserInputRepository;

    public QuestionUserInputResource(
        QuestionUserInputService questionUserInputService,
        QuestionUserInputRepository questionUserInputRepository
    ) {
        this.questionUserInputService = questionUserInputService;
        this.questionUserInputRepository = questionUserInputRepository;
    }

    /**
     * {@code POST  /question-user-inputs} : Create a new questionUserInput.
     *
     * @param questionUserInput the questionUserInput to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new questionUserInput, or with status {@code 400 (Bad Request)} if the questionUserInput has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/question-user-inputs")
    public ResponseEntity<QuestionUserInput> createQuestionUserInput(@RequestBody QuestionUserInput questionUserInput)
        throws URISyntaxException {
        log.debug("REST request to save QuestionUserInput : {}", questionUserInput);
        if (questionUserInput.getId() != null) {
            throw new BadRequestAlertException("A new questionUserInput cannot already have an ID", ENTITY_NAME, "idexists");
        }
        QuestionUserInput result = questionUserInputService.save(questionUserInput);
        return ResponseEntity
            .created(new URI("/api/question-user-inputs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /question-user-inputs/:id} : Updates an existing questionUserInput.
     *
     * @param id the id of the questionUserInput to save.
     * @param questionUserInput the questionUserInput to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionUserInput,
     * or with status {@code 400 (Bad Request)} if the questionUserInput is not valid,
     * or with status {@code 500 (Internal Server Error)} if the questionUserInput couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/question-user-inputs/{id}")
    public ResponseEntity<QuestionUserInput> updateQuestionUserInput(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody QuestionUserInput questionUserInput
    ) throws URISyntaxException {
        log.debug("REST request to update QuestionUserInput : {}, {}", id, questionUserInput);
        if (questionUserInput.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, questionUserInput.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionUserInputRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        QuestionUserInput result = questionUserInputService.update(questionUserInput);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionUserInput.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /question-user-inputs/:id} : Partial updates given fields of an existing questionUserInput, field will ignore if it is null
     *
     * @param id the id of the questionUserInput to save.
     * @param questionUserInput the questionUserInput to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated questionUserInput,
     * or with status {@code 400 (Bad Request)} if the questionUserInput is not valid,
     * or with status {@code 404 (Not Found)} if the questionUserInput is not found,
     * or with status {@code 500 (Internal Server Error)} if the questionUserInput couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/question-user-inputs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<QuestionUserInput> partialUpdateQuestionUserInput(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody QuestionUserInput questionUserInput
    ) throws URISyntaxException {
        log.debug("REST request to partial update QuestionUserInput partially : {}, {}", id, questionUserInput);
        if (questionUserInput.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, questionUserInput.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionUserInputRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<QuestionUserInput> result = questionUserInputService.partialUpdate(questionUserInput);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, questionUserInput.getId().toString())
        );
    }

    /**
     * {@code GET  /question-user-inputs} : get all the questionUserInputs.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questionUserInputs in body.
     */
    @GetMapping("/question-user-inputs")
    public ResponseEntity<List<QuestionUserInput>> getAllQuestionUserInputs(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "true") boolean eagerload
    ) {
        log.debug("REST request to get a page of QuestionUserInputs");
        Page<QuestionUserInput> page;
        if (eagerload) {
            page = questionUserInputService.findAllWithEagerRelationships(pageable);
        } else {
            page = questionUserInputService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /question-user-inputs/:id} : get the "id" questionUserInput.
     *
     * @param id the id of the questionUserInput to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the questionUserInput, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/question-user-inputs/{id}")
    public ResponseEntity<QuestionUserInput> getQuestionUserInput(@PathVariable Long id) {
        log.debug("REST request to get QuestionUserInput : {}", id);
        Optional<QuestionUserInput> questionUserInput = questionUserInputService.findOne(id);
        return ResponseUtil.wrapOrNotFound(questionUserInput);
    }

    /**
     * {@code DELETE  /question-user-inputs/:id} : delete the "id" questionUserInput.
     *
     * @param id the id of the questionUserInput to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/question-user-inputs/{id}")
    public ResponseEntity<Void> deleteQuestionUserInput(@PathVariable Long id) {
        log.debug("REST request to delete QuestionUserInput : {}", id);
        questionUserInputService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
