package db.com.mentalhealth.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import db.com.mentalhealth.IntegrationTest;
import db.com.mentalhealth.domain.ScenarioStatusEvent;
import db.com.mentalhealth.domain.enumeration.ScenarioStatus;
import db.com.mentalhealth.repository.ScenarioStatusEventRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ScenarioStatusEventResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ScenarioStatusEventResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final ScenarioStatus DEFAULT_EVENT_TYPE = ScenarioStatus.START;
    private static final ScenarioStatus UPDATED_EVENT_TYPE = ScenarioStatus.END;

    private static final String ENTITY_API_URL = "/api/scenario-status-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ScenarioStatusEventRepository scenarioStatusEventRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScenarioStatusEventMockMvc;

    private ScenarioStatusEvent scenarioStatusEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScenarioStatusEvent createEntity(EntityManager em) {
        ScenarioStatusEvent scenarioStatusEvent = new ScenarioStatusEvent().userId(DEFAULT_USER_ID).eventType(DEFAULT_EVENT_TYPE);
        return scenarioStatusEvent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScenarioStatusEvent createUpdatedEntity(EntityManager em) {
        ScenarioStatusEvent scenarioStatusEvent = new ScenarioStatusEvent().userId(UPDATED_USER_ID).eventType(UPDATED_EVENT_TYPE);
        return scenarioStatusEvent;
    }

    @BeforeEach
    public void initTest() {
        scenarioStatusEvent = createEntity(em);
    }

    @Test
    @Transactional
    void createScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeCreate = scenarioStatusEventRepository.findAll().size();
        // Create the ScenarioStatusEvent
        restScenarioStatusEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isCreated());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeCreate + 1);
        ScenarioStatusEvent testScenarioStatusEvent = scenarioStatusEventList.get(scenarioStatusEventList.size() - 1);
        assertThat(testScenarioStatusEvent.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testScenarioStatusEvent.getEventType()).isEqualTo(DEFAULT_EVENT_TYPE);
    }

    @Test
    @Transactional
    void createScenarioStatusEventWithExistingId() throws Exception {
        // Create the ScenarioStatusEvent with an existing ID
        scenarioStatusEvent.setId(1L);

        int databaseSizeBeforeCreate = scenarioStatusEventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScenarioStatusEventMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllScenarioStatusEvents() throws Exception {
        // Initialize the database
        scenarioStatusEventRepository.saveAndFlush(scenarioStatusEvent);

        // Get all the scenarioStatusEventList
        restScenarioStatusEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scenarioStatusEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].eventType").value(hasItem(DEFAULT_EVENT_TYPE.toString())));
    }

    @Test
    @Transactional
    void getScenarioStatusEvent() throws Exception {
        // Initialize the database
        scenarioStatusEventRepository.saveAndFlush(scenarioStatusEvent);

        // Get the scenarioStatusEvent
        restScenarioStatusEventMockMvc
            .perform(get(ENTITY_API_URL_ID, scenarioStatusEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(scenarioStatusEvent.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.eventType").value(DEFAULT_EVENT_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingScenarioStatusEvent() throws Exception {
        // Get the scenarioStatusEvent
        restScenarioStatusEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewScenarioStatusEvent() throws Exception {
        // Initialize the database
        scenarioStatusEventRepository.saveAndFlush(scenarioStatusEvent);

        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();

        // Update the scenarioStatusEvent
        ScenarioStatusEvent updatedScenarioStatusEvent = scenarioStatusEventRepository.findById(scenarioStatusEvent.getId()).get();
        // Disconnect from session so that the updates on updatedScenarioStatusEvent are not directly saved in db
        em.detach(updatedScenarioStatusEvent);
        updatedScenarioStatusEvent.userId(UPDATED_USER_ID).eventType(UPDATED_EVENT_TYPE);

        restScenarioStatusEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScenarioStatusEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedScenarioStatusEvent))
            )
            .andExpect(status().isOk());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
        ScenarioStatusEvent testScenarioStatusEvent = scenarioStatusEventList.get(scenarioStatusEventList.size() - 1);
        assertThat(testScenarioStatusEvent.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testScenarioStatusEvent.getEventType()).isEqualTo(UPDATED_EVENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();
        scenarioStatusEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScenarioStatusEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, scenarioStatusEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();
        scenarioStatusEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioStatusEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();
        scenarioStatusEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioStatusEventMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScenarioStatusEventWithPatch() throws Exception {
        // Initialize the database
        scenarioStatusEventRepository.saveAndFlush(scenarioStatusEvent);

        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();

        // Update the scenarioStatusEvent using partial update
        ScenarioStatusEvent partialUpdatedScenarioStatusEvent = new ScenarioStatusEvent();
        partialUpdatedScenarioStatusEvent.setId(scenarioStatusEvent.getId());

        restScenarioStatusEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScenarioStatusEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScenarioStatusEvent))
            )
            .andExpect(status().isOk());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
        ScenarioStatusEvent testScenarioStatusEvent = scenarioStatusEventList.get(scenarioStatusEventList.size() - 1);
        assertThat(testScenarioStatusEvent.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testScenarioStatusEvent.getEventType()).isEqualTo(DEFAULT_EVENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateScenarioStatusEventWithPatch() throws Exception {
        // Initialize the database
        scenarioStatusEventRepository.saveAndFlush(scenarioStatusEvent);

        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();

        // Update the scenarioStatusEvent using partial update
        ScenarioStatusEvent partialUpdatedScenarioStatusEvent = new ScenarioStatusEvent();
        partialUpdatedScenarioStatusEvent.setId(scenarioStatusEvent.getId());

        partialUpdatedScenarioStatusEvent.userId(UPDATED_USER_ID).eventType(UPDATED_EVENT_TYPE);

        restScenarioStatusEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScenarioStatusEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScenarioStatusEvent))
            )
            .andExpect(status().isOk());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
        ScenarioStatusEvent testScenarioStatusEvent = scenarioStatusEventList.get(scenarioStatusEventList.size() - 1);
        assertThat(testScenarioStatusEvent.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testScenarioStatusEvent.getEventType()).isEqualTo(UPDATED_EVENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();
        scenarioStatusEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScenarioStatusEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, scenarioStatusEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();
        scenarioStatusEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioStatusEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScenarioStatusEvent() throws Exception {
        int databaseSizeBeforeUpdate = scenarioStatusEventRepository.findAll().size();
        scenarioStatusEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioStatusEventMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scenarioStatusEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScenarioStatusEvent in the database
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScenarioStatusEvent() throws Exception {
        // Initialize the database
        scenarioStatusEventRepository.saveAndFlush(scenarioStatusEvent);

        int databaseSizeBeforeDelete = scenarioStatusEventRepository.findAll().size();

        // Delete the scenarioStatusEvent
        restScenarioStatusEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, scenarioStatusEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ScenarioStatusEvent> scenarioStatusEventList = scenarioStatusEventRepository.findAll();
        assertThat(scenarioStatusEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
