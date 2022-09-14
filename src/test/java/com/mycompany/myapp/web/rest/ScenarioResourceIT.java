package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Scenario;
import com.mycompany.myapp.domain.enumeration.Category;
import com.mycompany.myapp.domain.enumeration.Subcategory;
import com.mycompany.myapp.repository.ScenarioRepository;
import com.mycompany.myapp.service.ScenarioService;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link ScenarioResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ScenarioResourceIT {

    private static final String DEFAULT_ORDER = "AAAAAAAAAA";
    private static final String UPDATED_ORDER = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_IDENTIFIER = "AAAAAAAAAA";
    private static final String UPDATED_IDENTIFIER = "BBBBBBBBBB";

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_AUDIO_FILE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_AUDIO_FILE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_RNTYPE = "AAAAAAAAAA";
    private static final String UPDATED_RNTYPE = "BBBBBBBBBB";

    private static final String DEFAULT_THEME = "AAAAAAAAAA";
    private static final String UPDATED_THEME = "BBBBBBBBBB";

    private static final Category DEFAULT_CATHEGORY = Category.CAT1;
    private static final Category UPDATED_CATHEGORY = Category.CAT2;

    private static final Subcategory DEFAULT_SUBCAT = Subcategory.SUBC1;
    private static final Subcategory UPDATED_SUBCAT = Subcategory.SUBC2;

    private static final String DEFAULT_SCENARIO_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_SCENARIO_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_TRIAL_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TRIAL_TYPE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_REPEATABLE = false;
    private static final Boolean UPDATED_REPEATABLE = true;

    private static final Boolean DEFAULT_POSITIVITY = false;
    private static final Boolean UPDATED_POSITIVITY = true;

    private static final Boolean DEFAULT_VIVIDNESS = false;
    private static final Boolean UPDATED_VIVIDNESS = true;

    private static final ZonedDateTime DEFAULT_CREATED_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/scenarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Mock
    private ScenarioRepository scenarioRepositoryMock;

    @Mock
    private ScenarioService scenarioServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScenarioMockMvc;

    private Scenario scenario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Scenario createEntity(EntityManager em) {
        Scenario scenario = new Scenario()
            .order(DEFAULT_ORDER)
            .name(DEFAULT_NAME)
            .identifier(DEFAULT_IDENTIFIER)
            .text(DEFAULT_TEXT)
            .audioFileName(DEFAULT_AUDIO_FILE_NAME)
            .rntype(DEFAULT_RNTYPE)
            .theme(DEFAULT_THEME)
            .cathegory(DEFAULT_CATHEGORY)
            .subcat(DEFAULT_SUBCAT)
            .scenarioNumber(DEFAULT_SCENARIO_NUMBER)
            .trialType(DEFAULT_TRIAL_TYPE)
            .repeatable(DEFAULT_REPEATABLE)
            .positivity(DEFAULT_POSITIVITY)
            .vividness(DEFAULT_VIVIDNESS)
            .createdDate(DEFAULT_CREATED_DATE);
        return scenario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Scenario createUpdatedEntity(EntityManager em) {
        Scenario scenario = new Scenario()
            .order(UPDATED_ORDER)
            .name(UPDATED_NAME)
            .identifier(UPDATED_IDENTIFIER)
            .text(UPDATED_TEXT)
            .audioFileName(UPDATED_AUDIO_FILE_NAME)
            .rntype(UPDATED_RNTYPE)
            .theme(UPDATED_THEME)
            .cathegory(UPDATED_CATHEGORY)
            .subcat(UPDATED_SUBCAT)
            .scenarioNumber(UPDATED_SCENARIO_NUMBER)
            .trialType(UPDATED_TRIAL_TYPE)
            .repeatable(UPDATED_REPEATABLE)
            .positivity(UPDATED_POSITIVITY)
            .vividness(UPDATED_VIVIDNESS)
            .createdDate(UPDATED_CREATED_DATE);
        return scenario;
    }

    @BeforeEach
    public void initTest() {
        scenario = createEntity(em);
    }

    @Test
    @Transactional
    void createScenario() throws Exception {
        int databaseSizeBeforeCreate = scenarioRepository.findAll().size();
        // Create the Scenario
        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isCreated());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeCreate + 1);
        Scenario testScenario = scenarioList.get(scenarioList.size() - 1);
        assertThat(testScenario.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testScenario.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testScenario.getIdentifier()).isEqualTo(DEFAULT_IDENTIFIER);
        assertThat(testScenario.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testScenario.getAudioFileName()).isEqualTo(DEFAULT_AUDIO_FILE_NAME);
        assertThat(testScenario.getRntype()).isEqualTo(DEFAULT_RNTYPE);
        assertThat(testScenario.getTheme()).isEqualTo(DEFAULT_THEME);
        assertThat(testScenario.getCathegory()).isEqualTo(DEFAULT_CATHEGORY);
        assertThat(testScenario.getSubcat()).isEqualTo(DEFAULT_SUBCAT);
        assertThat(testScenario.getScenarioNumber()).isEqualTo(DEFAULT_SCENARIO_NUMBER);
        assertThat(testScenario.getTrialType()).isEqualTo(DEFAULT_TRIAL_TYPE);
        assertThat(testScenario.getRepeatable()).isEqualTo(DEFAULT_REPEATABLE);
        assertThat(testScenario.getPositivity()).isEqualTo(DEFAULT_POSITIVITY);
        assertThat(testScenario.getVividness()).isEqualTo(DEFAULT_VIVIDNESS);
        assertThat(testScenario.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void createScenarioWithExistingId() throws Exception {
        // Create the Scenario with an existing ID
        scenario.setId(1L);

        int databaseSizeBeforeCreate = scenarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isBadRequest());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = scenarioRepository.findAll().size();
        // set the field null
        scenario.setOrder(null);

        // Create the Scenario, which fails.

        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isBadRequest());

        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = scenarioRepository.findAll().size();
        // set the field null
        scenario.setName(null);

        // Create the Scenario, which fails.

        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isBadRequest());

        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIdentifierIsRequired() throws Exception {
        int databaseSizeBeforeTest = scenarioRepository.findAll().size();
        // set the field null
        scenario.setIdentifier(null);

        // Create the Scenario, which fails.

        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isBadRequest());

        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = scenarioRepository.findAll().size();
        // set the field null
        scenario.setText(null);

        // Create the Scenario, which fails.

        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isBadRequest());

        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAudioFileNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = scenarioRepository.findAll().size();
        // set the field null
        scenario.setAudioFileName(null);

        // Create the Scenario, which fails.

        restScenarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isBadRequest());

        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllScenarios() throws Exception {
        // Initialize the database
        scenarioRepository.saveAndFlush(scenario);

        // Get all the scenarioList
        restScenarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scenario.getId().intValue())))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].identifier").value(hasItem(DEFAULT_IDENTIFIER)))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].audioFileName").value(hasItem(DEFAULT_AUDIO_FILE_NAME)))
            .andExpect(jsonPath("$.[*].rntype").value(hasItem(DEFAULT_RNTYPE)))
            .andExpect(jsonPath("$.[*].theme").value(hasItem(DEFAULT_THEME)))
            .andExpect(jsonPath("$.[*].cathegory").value(hasItem(DEFAULT_CATHEGORY.toString())))
            .andExpect(jsonPath("$.[*].subcat").value(hasItem(DEFAULT_SUBCAT.toString())))
            .andExpect(jsonPath("$.[*].scenarioNumber").value(hasItem(DEFAULT_SCENARIO_NUMBER)))
            .andExpect(jsonPath("$.[*].trialType").value(hasItem(DEFAULT_TRIAL_TYPE)))
            .andExpect(jsonPath("$.[*].repeatable").value(hasItem(DEFAULT_REPEATABLE.booleanValue())))
            .andExpect(jsonPath("$.[*].positivity").value(hasItem(DEFAULT_POSITIVITY.booleanValue())))
            .andExpect(jsonPath("$.[*].vividness").value(hasItem(DEFAULT_VIVIDNESS.booleanValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(sameInstant(DEFAULT_CREATED_DATE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllScenariosWithEagerRelationshipsIsEnabled() throws Exception {
        when(scenarioServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restScenarioMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(scenarioServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllScenariosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(scenarioServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restScenarioMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(scenarioServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getScenario() throws Exception {
        // Initialize the database
        scenarioRepository.saveAndFlush(scenario);

        // Get the scenario
        restScenarioMockMvc
            .perform(get(ENTITY_API_URL_ID, scenario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(scenario.getId().intValue()))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.identifier").value(DEFAULT_IDENTIFIER))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.audioFileName").value(DEFAULT_AUDIO_FILE_NAME))
            .andExpect(jsonPath("$.rntype").value(DEFAULT_RNTYPE))
            .andExpect(jsonPath("$.theme").value(DEFAULT_THEME))
            .andExpect(jsonPath("$.cathegory").value(DEFAULT_CATHEGORY.toString()))
            .andExpect(jsonPath("$.subcat").value(DEFAULT_SUBCAT.toString()))
            .andExpect(jsonPath("$.scenarioNumber").value(DEFAULT_SCENARIO_NUMBER))
            .andExpect(jsonPath("$.trialType").value(DEFAULT_TRIAL_TYPE))
            .andExpect(jsonPath("$.repeatable").value(DEFAULT_REPEATABLE.booleanValue()))
            .andExpect(jsonPath("$.positivity").value(DEFAULT_POSITIVITY.booleanValue()))
            .andExpect(jsonPath("$.vividness").value(DEFAULT_VIVIDNESS.booleanValue()))
            .andExpect(jsonPath("$.createdDate").value(sameInstant(DEFAULT_CREATED_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingScenario() throws Exception {
        // Get the scenario
        restScenarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewScenario() throws Exception {
        // Initialize the database
        scenarioRepository.saveAndFlush(scenario);

        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();

        // Update the scenario
        Scenario updatedScenario = scenarioRepository.findById(scenario.getId()).get();
        // Disconnect from session so that the updates on updatedScenario are not directly saved in db
        em.detach(updatedScenario);
        updatedScenario
            .order(UPDATED_ORDER)
            .name(UPDATED_NAME)
            .identifier(UPDATED_IDENTIFIER)
            .text(UPDATED_TEXT)
            .audioFileName(UPDATED_AUDIO_FILE_NAME)
            .rntype(UPDATED_RNTYPE)
            .theme(UPDATED_THEME)
            .cathegory(UPDATED_CATHEGORY)
            .subcat(UPDATED_SUBCAT)
            .scenarioNumber(UPDATED_SCENARIO_NUMBER)
            .trialType(UPDATED_TRIAL_TYPE)
            .repeatable(UPDATED_REPEATABLE)
            .positivity(UPDATED_POSITIVITY)
            .vividness(UPDATED_VIVIDNESS)
            .createdDate(UPDATED_CREATED_DATE);

        restScenarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScenario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedScenario))
            )
            .andExpect(status().isOk());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
        Scenario testScenario = scenarioList.get(scenarioList.size() - 1);
        assertThat(testScenario.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testScenario.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testScenario.getIdentifier()).isEqualTo(UPDATED_IDENTIFIER);
        assertThat(testScenario.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testScenario.getAudioFileName()).isEqualTo(UPDATED_AUDIO_FILE_NAME);
        assertThat(testScenario.getRntype()).isEqualTo(UPDATED_RNTYPE);
        assertThat(testScenario.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testScenario.getCathegory()).isEqualTo(UPDATED_CATHEGORY);
        assertThat(testScenario.getSubcat()).isEqualTo(UPDATED_SUBCAT);
        assertThat(testScenario.getScenarioNumber()).isEqualTo(UPDATED_SCENARIO_NUMBER);
        assertThat(testScenario.getTrialType()).isEqualTo(UPDATED_TRIAL_TYPE);
        assertThat(testScenario.getRepeatable()).isEqualTo(UPDATED_REPEATABLE);
        assertThat(testScenario.getPositivity()).isEqualTo(UPDATED_POSITIVITY);
        assertThat(testScenario.getVividness()).isEqualTo(UPDATED_VIVIDNESS);
        assertThat(testScenario.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingScenario() throws Exception {
        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();
        scenario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScenarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, scenario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scenario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScenario() throws Exception {
        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();
        scenario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scenario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScenario() throws Exception {
        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();
        scenario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScenarioWithPatch() throws Exception {
        // Initialize the database
        scenarioRepository.saveAndFlush(scenario);

        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();

        // Update the scenario using partial update
        Scenario partialUpdatedScenario = new Scenario();
        partialUpdatedScenario.setId(scenario.getId());

        partialUpdatedScenario
            .identifier(UPDATED_IDENTIFIER)
            .text(UPDATED_TEXT)
            .audioFileName(UPDATED_AUDIO_FILE_NAME)
            .rntype(UPDATED_RNTYPE)
            .theme(UPDATED_THEME)
            .cathegory(UPDATED_CATHEGORY)
            .subcat(UPDATED_SUBCAT)
            .scenarioNumber(UPDATED_SCENARIO_NUMBER)
            .trialType(UPDATED_TRIAL_TYPE)
            .positivity(UPDATED_POSITIVITY);

        restScenarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScenario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScenario))
            )
            .andExpect(status().isOk());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
        Scenario testScenario = scenarioList.get(scenarioList.size() - 1);
        assertThat(testScenario.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testScenario.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testScenario.getIdentifier()).isEqualTo(UPDATED_IDENTIFIER);
        assertThat(testScenario.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testScenario.getAudioFileName()).isEqualTo(UPDATED_AUDIO_FILE_NAME);
        assertThat(testScenario.getRntype()).isEqualTo(UPDATED_RNTYPE);
        assertThat(testScenario.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testScenario.getCathegory()).isEqualTo(UPDATED_CATHEGORY);
        assertThat(testScenario.getSubcat()).isEqualTo(UPDATED_SUBCAT);
        assertThat(testScenario.getScenarioNumber()).isEqualTo(UPDATED_SCENARIO_NUMBER);
        assertThat(testScenario.getTrialType()).isEqualTo(UPDATED_TRIAL_TYPE);
        assertThat(testScenario.getRepeatable()).isEqualTo(DEFAULT_REPEATABLE);
        assertThat(testScenario.getPositivity()).isEqualTo(UPDATED_POSITIVITY);
        assertThat(testScenario.getVividness()).isEqualTo(DEFAULT_VIVIDNESS);
        assertThat(testScenario.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateScenarioWithPatch() throws Exception {
        // Initialize the database
        scenarioRepository.saveAndFlush(scenario);

        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();

        // Update the scenario using partial update
        Scenario partialUpdatedScenario = new Scenario();
        partialUpdatedScenario.setId(scenario.getId());

        partialUpdatedScenario
            .order(UPDATED_ORDER)
            .name(UPDATED_NAME)
            .identifier(UPDATED_IDENTIFIER)
            .text(UPDATED_TEXT)
            .audioFileName(UPDATED_AUDIO_FILE_NAME)
            .rntype(UPDATED_RNTYPE)
            .theme(UPDATED_THEME)
            .cathegory(UPDATED_CATHEGORY)
            .subcat(UPDATED_SUBCAT)
            .scenarioNumber(UPDATED_SCENARIO_NUMBER)
            .trialType(UPDATED_TRIAL_TYPE)
            .repeatable(UPDATED_REPEATABLE)
            .positivity(UPDATED_POSITIVITY)
            .vividness(UPDATED_VIVIDNESS)
            .createdDate(UPDATED_CREATED_DATE);

        restScenarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScenario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScenario))
            )
            .andExpect(status().isOk());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
        Scenario testScenario = scenarioList.get(scenarioList.size() - 1);
        assertThat(testScenario.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testScenario.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testScenario.getIdentifier()).isEqualTo(UPDATED_IDENTIFIER);
        assertThat(testScenario.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testScenario.getAudioFileName()).isEqualTo(UPDATED_AUDIO_FILE_NAME);
        assertThat(testScenario.getRntype()).isEqualTo(UPDATED_RNTYPE);
        assertThat(testScenario.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testScenario.getCathegory()).isEqualTo(UPDATED_CATHEGORY);
        assertThat(testScenario.getSubcat()).isEqualTo(UPDATED_SUBCAT);
        assertThat(testScenario.getScenarioNumber()).isEqualTo(UPDATED_SCENARIO_NUMBER);
        assertThat(testScenario.getTrialType()).isEqualTo(UPDATED_TRIAL_TYPE);
        assertThat(testScenario.getRepeatable()).isEqualTo(UPDATED_REPEATABLE);
        assertThat(testScenario.getPositivity()).isEqualTo(UPDATED_POSITIVITY);
        assertThat(testScenario.getVividness()).isEqualTo(UPDATED_VIVIDNESS);
        assertThat(testScenario.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingScenario() throws Exception {
        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();
        scenario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScenarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, scenario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scenario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScenario() throws Exception {
        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();
        scenario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scenario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScenario() throws Exception {
        int databaseSizeBeforeUpdate = scenarioRepository.findAll().size();
        scenario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScenarioMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(scenario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Scenario in the database
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScenario() throws Exception {
        // Initialize the database
        scenarioRepository.saveAndFlush(scenario);

        int databaseSizeBeforeDelete = scenarioRepository.findAll().size();

        // Delete the scenario
        restScenarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, scenario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Scenario> scenarioList = scenarioRepository.findAll();
        assertThat(scenarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
