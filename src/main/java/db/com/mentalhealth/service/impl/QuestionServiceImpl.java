package db.com.mentalhealth.service.impl;

import db.com.mentalhealth.domain.Question;
import db.com.mentalhealth.repository.QuestionRepository;
import db.com.mentalhealth.service.QuestionService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Question}.
 */
@Service
@Transactional
public class QuestionServiceImpl implements QuestionService {

    private final Logger log = LoggerFactory.getLogger(QuestionServiceImpl.class);

    private final QuestionRepository questionRepository;

    public QuestionServiceImpl(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public Question save(Question question) {
        log.debug("Request to save Question : {}", question);
        return questionRepository.save(question);
    }

    @Override
    public Question update(Question question) {
        log.debug("Request to save Question : {}", question);
        return questionRepository.save(question);
    }

    @Override
    public Optional<Question> partialUpdate(Question question) {
        log.debug("Request to partially update Question : {}", question);

        return questionRepository
            .findById(question.getId())
            .map(existingQuestion -> {
                if (question.getTitle() != null) {
                    existingQuestion.setTitle(question.getTitle());
                }
                if (question.getText() != null) {
                    existingQuestion.setText(question.getText());
                }
                if (question.getCorrectAnswer() != null) {
                    existingQuestion.setCorrectAnswer(question.getCorrectAnswer());
                }
                if (question.getCorrectAnswerFeedback() != null) {
                    existingQuestion.setCorrectAnswerFeedback(question.getCorrectAnswerFeedback());
                }
                if (question.getWrongAnswerFeedback() != null) {
                    existingQuestion.setWrongAnswerFeedback(question.getWrongAnswerFeedback());
                }
                if (question.getCreatedDate() != null) {
                    existingQuestion.setCreatedDate(question.getCreatedDate());
                }

                return existingQuestion;
            })
            .map(questionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Question> findAll(Pageable pageable) {
        log.debug("Request to get all Questions");
        return questionRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Question> findOne(Long id) {
        log.debug("Request to get Question : {}", id);
        return questionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Question : {}", id);
        questionRepository.deleteById(id);
    }
}
