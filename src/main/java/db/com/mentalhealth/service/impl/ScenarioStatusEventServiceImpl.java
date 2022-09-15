package db.com.mentalhealth.service.impl;

import db.com.mentalhealth.domain.ScenarioStatusEvent;
import db.com.mentalhealth.repository.ScenarioStatusEventRepository;
import db.com.mentalhealth.service.ScenarioStatusEventService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ScenarioStatusEvent}.
 */
@Service
@Transactional
public class ScenarioStatusEventServiceImpl implements ScenarioStatusEventService {

    private final Logger log = LoggerFactory.getLogger(ScenarioStatusEventServiceImpl.class);

    private final ScenarioStatusEventRepository scenarioStatusEventRepository;

    public ScenarioStatusEventServiceImpl(ScenarioStatusEventRepository scenarioStatusEventRepository) {
        this.scenarioStatusEventRepository = scenarioStatusEventRepository;
    }

    @Override
    public ScenarioStatusEvent save(ScenarioStatusEvent scenarioStatusEvent) {
        log.debug("Request to save ScenarioStatusEvent : {}", scenarioStatusEvent);
        return scenarioStatusEventRepository.save(scenarioStatusEvent);
    }

    @Override
    public ScenarioStatusEvent update(ScenarioStatusEvent scenarioStatusEvent) {
        log.debug("Request to save ScenarioStatusEvent : {}", scenarioStatusEvent);
        return scenarioStatusEventRepository.save(scenarioStatusEvent);
    }

    @Override
    public Optional<ScenarioStatusEvent> partialUpdate(ScenarioStatusEvent scenarioStatusEvent) {
        log.debug("Request to partially update ScenarioStatusEvent : {}", scenarioStatusEvent);

        return scenarioStatusEventRepository
            .findById(scenarioStatusEvent.getId())
            .map(existingScenarioStatusEvent -> {
                if (scenarioStatusEvent.getUserId() != null) {
                    existingScenarioStatusEvent.setUserId(scenarioStatusEvent.getUserId());
                }
                if (scenarioStatusEvent.getEventType() != null) {
                    existingScenarioStatusEvent.setEventType(scenarioStatusEvent.getEventType());
                }

                return existingScenarioStatusEvent;
            })
            .map(scenarioStatusEventRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ScenarioStatusEvent> findAll(Pageable pageable) {
        log.debug("Request to get all ScenarioStatusEvents");
        return scenarioStatusEventRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ScenarioStatusEvent> findOne(Long id) {
        log.debug("Request to get ScenarioStatusEvent : {}", id);
        return scenarioStatusEventRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ScenarioStatusEvent : {}", id);
        scenarioStatusEventRepository.deleteById(id);
    }
}
