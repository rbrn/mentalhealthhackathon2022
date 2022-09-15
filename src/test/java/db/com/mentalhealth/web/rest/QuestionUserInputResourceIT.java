package db.com.mentalhealth.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import db.com.mentalhealth.IntegrationTest;
import db.com.mentalhealth.domain.QuestionUserInput;
import db.com.mentalhealth.repository.QuestionUserInputRepository;
import db.com.mentalhealth.service.QuestionUserInputService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link QuestionUserInputResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class QuestionUserInputResourceIT {

    private static final String DEFAULT_USER_ID = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_RESPONSE = "AAAAAAAAAA";
    private static final String UPDATED_RESPONSE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/question-user-inputs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QuestionUserInputRepository questionUserInputRepository;

    @Mock
    private QuestionUserInputRepository questionUserInputRepositoryMock;

    @Mock
    private QuestionUserInputService questionUserInputServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQuestionUserInputMockMvc;

    private QuestionUserInput questionUserInput;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionUserInput createEntity(EntityManager em) {
        QuestionUserInput questionUserInput = new QuestionUserInput().userId(DEFAULT_USER_ID).response(DEFAULT_RESPONSE);
        return questionUserInput;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionUserInput createUpdatedEntity(EntityManager em) {
        QuestionUserInput questionUserInput = new QuestionUserInput().userId(UPDATED_USER_ID).response(UPDATED_RESPONSE);
        return questionUserInput;
    }

    @BeforeEach
    public void initTest() {
        questionUserInput = createEntity(em);
    }

    @Test
    @Transactional
    void createQuestionUserInput() throws Exception {
        int databaseSizeBeforeCreate = questionUserInputRepository.findAll().size();
        // Create the QuestionUserInput
        restQuestionUserInputMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isCreated());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionUserInput testQuestionUserInput = questionUserInputList.get(questionUserInputList.size() - 1);
        assertThat(testQuestionUserInput.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testQuestionUserInput.getResponse()).isEqualTo(DEFAULT_RESPONSE);
    }

    @Test
    @Transactional
    void createQuestionUserInputWithExistingId() throws Exception {
        // Create the QuestionUserInput with an existing ID
        questionUserInput.setId(1L);

        int databaseSizeBeforeCreate = questionUserInputRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionUserInputMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllQuestionUserInputs() throws Exception {
        // Initialize the database
        questionUserInputRepository.saveAndFlush(questionUserInput);

        // Get all the questionUserInputList
        restQuestionUserInputMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionUserInput.getId().intValue())))
            .andExpect(jsonPath("$.[*].userId").value(hasItem(DEFAULT_USER_ID)))
            .andExpect(jsonPath("$.[*].response").value(hasItem(DEFAULT_RESPONSE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllQuestionUserInputsWithEagerRelationshipsIsEnabled() throws Exception {
        when(questionUserInputServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restQuestionUserInputMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(questionUserInputServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllQuestionUserInputsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(questionUserInputServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restQuestionUserInputMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(questionUserInputServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getQuestionUserInput() throws Exception {
        // Initialize the database
        questionUserInputRepository.saveAndFlush(questionUserInput);

        // Get the questionUserInput
        restQuestionUserInputMockMvc
            .perform(get(ENTITY_API_URL_ID, questionUserInput.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(questionUserInput.getId().intValue()))
            .andExpect(jsonPath("$.userId").value(DEFAULT_USER_ID))
            .andExpect(jsonPath("$.response").value(DEFAULT_RESPONSE));
    }

    @Test
    @Transactional
    void getNonExistingQuestionUserInput() throws Exception {
        // Get the questionUserInput
        restQuestionUserInputMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewQuestionUserInput() throws Exception {
        // Initialize the database
        questionUserInputRepository.saveAndFlush(questionUserInput);

        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();

        // Update the questionUserInput
        QuestionUserInput updatedQuestionUserInput = questionUserInputRepository.findById(questionUserInput.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionUserInput are not directly saved in db
        em.detach(updatedQuestionUserInput);
        updatedQuestionUserInput.userId(UPDATED_USER_ID).response(UPDATED_RESPONSE);

        restQuestionUserInputMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedQuestionUserInput.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedQuestionUserInput))
            )
            .andExpect(status().isOk());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
        QuestionUserInput testQuestionUserInput = questionUserInputList.get(questionUserInputList.size() - 1);
        assertThat(testQuestionUserInput.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testQuestionUserInput.getResponse()).isEqualTo(UPDATED_RESPONSE);
    }

    @Test
    @Transactional
    void putNonExistingQuestionUserInput() throws Exception {
        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();
        questionUserInput.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionUserInputMockMvc
            .perform(
                put(ENTITY_API_URL_ID, questionUserInput.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQuestionUserInput() throws Exception {
        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();
        questionUserInput.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionUserInputMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQuestionUserInput() throws Exception {
        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();
        questionUserInput.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionUserInputMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQuestionUserInputWithPatch() throws Exception {
        // Initialize the database
        questionUserInputRepository.saveAndFlush(questionUserInput);

        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();

        // Update the questionUserInput using partial update
        QuestionUserInput partialUpdatedQuestionUserInput = new QuestionUserInput();
        partialUpdatedQuestionUserInput.setId(questionUserInput.getId());

        restQuestionUserInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuestionUserInput.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuestionUserInput))
            )
            .andExpect(status().isOk());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
        QuestionUserInput testQuestionUserInput = questionUserInputList.get(questionUserInputList.size() - 1);
        assertThat(testQuestionUserInput.getUserId()).isEqualTo(DEFAULT_USER_ID);
        assertThat(testQuestionUserInput.getResponse()).isEqualTo(DEFAULT_RESPONSE);
    }

    @Test
    @Transactional
    void fullUpdateQuestionUserInputWithPatch() throws Exception {
        // Initialize the database
        questionUserInputRepository.saveAndFlush(questionUserInput);

        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();

        // Update the questionUserInput using partial update
        QuestionUserInput partialUpdatedQuestionUserInput = new QuestionUserInput();
        partialUpdatedQuestionUserInput.setId(questionUserInput.getId());

        partialUpdatedQuestionUserInput.userId(UPDATED_USER_ID).response(UPDATED_RESPONSE);

        restQuestionUserInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuestionUserInput.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuestionUserInput))
            )
            .andExpect(status().isOk());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
        QuestionUserInput testQuestionUserInput = questionUserInputList.get(questionUserInputList.size() - 1);
        assertThat(testQuestionUserInput.getUserId()).isEqualTo(UPDATED_USER_ID);
        assertThat(testQuestionUserInput.getResponse()).isEqualTo(UPDATED_RESPONSE);
    }

    @Test
    @Transactional
    void patchNonExistingQuestionUserInput() throws Exception {
        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();
        questionUserInput.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionUserInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, questionUserInput.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQuestionUserInput() throws Exception {
        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();
        questionUserInput.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionUserInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isBadRequest());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQuestionUserInput() throws Exception {
        int databaseSizeBeforeUpdate = questionUserInputRepository.findAll().size();
        questionUserInput.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuestionUserInputMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(questionUserInput))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the QuestionUserInput in the database
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQuestionUserInput() throws Exception {
        // Initialize the database
        questionUserInputRepository.saveAndFlush(questionUserInput);

        int databaseSizeBeforeDelete = questionUserInputRepository.findAll().size();

        // Delete the questionUserInput
        restQuestionUserInputMockMvc
            .perform(delete(ENTITY_API_URL_ID, questionUserInput.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<QuestionUserInput> questionUserInputList = questionUserInputRepository.findAll();
        assertThat(questionUserInputList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
