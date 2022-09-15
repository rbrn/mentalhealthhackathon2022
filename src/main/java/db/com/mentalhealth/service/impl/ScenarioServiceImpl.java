package db.com.mentalhealth.service.impl;

import db.com.mentalhealth.domain.Scenario;
import db.com.mentalhealth.repository.ScenarioRepository;
import db.com.mentalhealth.service.ScenarioService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Scenario}.
 */
@Service
@Transactional
public class ScenarioServiceImpl implements ScenarioService {

    private final Logger log = LoggerFactory.getLogger(ScenarioServiceImpl.class);

    private final ScenarioRepository scenarioRepository;

    public ScenarioServiceImpl(ScenarioRepository scenarioRepository) {
        this.scenarioRepository = scenarioRepository;
    }

    @Override
    public Scenario save(Scenario scenario) {
        log.debug("Request to save Scenario : {}", scenario);
        return scenarioRepository.save(scenario);
    }

    @Override
    public Scenario update(Scenario scenario) {
        log.debug("Request to save Scenario : {}", scenario);
        return scenarioRepository.save(scenario);
    }

    @Override
    public Optional<Scenario> partialUpdate(Scenario scenario) {
        log.debug("Request to partially update Scenario : {}", scenario);

        return scenarioRepository
            .findById(scenario.getId())
            .map(existingScenario -> {
                if (scenario.getOrder() != null) {
                    existingScenario.setOrder(scenario.getOrder());
                }
                if (scenario.getName() != null) {
                    existingScenario.setName(scenario.getName());
                }
                if (scenario.getIdentifier() != null) {
                    existingScenario.setIdentifier(scenario.getIdentifier());
                }
                if (scenario.getText() != null) {
                    existingScenario.setText(scenario.getText());
                }
                if (scenario.getAudioFileName() != null) {
                    existingScenario.setAudioFileName(scenario.getAudioFileName());
                }
                if (scenario.getRntype() != null) {
                    existingScenario.setRntype(scenario.getRntype());
                }
                if (scenario.getTheme() != null) {
                    existingScenario.setTheme(scenario.getTheme());
                }
                if (scenario.getScenarioNumber() != null) {
                    existingScenario.setScenarioNumber(scenario.getScenarioNumber());
                }
                if (scenario.getTrialType() != null) {
                    existingScenario.setTrialType(scenario.getTrialType());
                }
                if (scenario.getRepeatable() != null) {
                    existingScenario.setRepeatable(scenario.getRepeatable());
                }
                if (scenario.getPositivity() != null) {
                    existingScenario.setPositivity(scenario.getPositivity());
                }
                if (scenario.getVividness() != null) {
                    existingScenario.setVividness(scenario.getVividness());
                }
                if (scenario.getCreatedDate() != null) {
                    existingScenario.setCreatedDate(scenario.getCreatedDate());
                }

                return existingScenario;
            })
            .map(scenarioRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Scenario> findAll(Pageable pageable) {
        log.debug("Request to get all Scenarios");
        return scenarioRepository.findAll(pageable);
    }

    public Page<Scenario> findAllWithEagerRelationships(Pageable pageable) {
        return scenarioRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Scenario> findOne(Long id) {
        log.debug("Request to get Scenario : {}", id);
        return scenarioRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Scenario : {}", id);
        scenarioRepository.deleteById(id);
    }
}
