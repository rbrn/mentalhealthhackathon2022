package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.QuestionUserInput;
import com.mycompany.myapp.repository.QuestionUserInputRepository;
import com.mycompany.myapp.service.QuestionUserInputService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link QuestionUserInput}.
 */
@Service
@Transactional
public class QuestionUserInputServiceImpl implements QuestionUserInputService {

    private final Logger log = LoggerFactory.getLogger(QuestionUserInputServiceImpl.class);

    private final QuestionUserInputRepository questionUserInputRepository;

    public QuestionUserInputServiceImpl(QuestionUserInputRepository questionUserInputRepository) {
        this.questionUserInputRepository = questionUserInputRepository;
    }

    @Override
    public QuestionUserInput save(QuestionUserInput questionUserInput) {
        log.debug("Request to save QuestionUserInput : {}", questionUserInput);
        return questionUserInputRepository.save(questionUserInput);
    }

    @Override
    public QuestionUserInput update(QuestionUserInput questionUserInput) {
        log.debug("Request to save QuestionUserInput : {}", questionUserInput);
        return questionUserInputRepository.save(questionUserInput);
    }

    @Override
    public Optional<QuestionUserInput> partialUpdate(QuestionUserInput questionUserInput) {
        log.debug("Request to partially update QuestionUserInput : {}", questionUserInput);

        return questionUserInputRepository
            .findById(questionUserInput.getId())
            .map(existingQuestionUserInput -> {
                if (questionUserInput.getUserId() != null) {
                    existingQuestionUserInput.setUserId(questionUserInput.getUserId());
                }
                if (questionUserInput.getResponse() != null) {
                    existingQuestionUserInput.setResponse(questionUserInput.getResponse());
                }

                return existingQuestionUserInput;
            })
            .map(questionUserInputRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<QuestionUserInput> findAll(Pageable pageable) {
        log.debug("Request to get all QuestionUserInputs");
        return questionUserInputRepository.findAll(pageable);
    }

    public Page<QuestionUserInput> findAllWithEagerRelationships(Pageable pageable) {
        return questionUserInputRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<QuestionUserInput> findOne(Long id) {
        log.debug("Request to get QuestionUserInput : {}", id);
        return questionUserInputRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete QuestionUserInput : {}", id);
        questionUserInputRepository.deleteById(id);
    }
}
