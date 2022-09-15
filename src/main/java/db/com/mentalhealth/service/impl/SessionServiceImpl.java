package db.com.mentalhealth.service.impl;

import db.com.mentalhealth.domain.Session;
import db.com.mentalhealth.repository.SessionRepository;
import db.com.mentalhealth.service.SessionService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Session}.
 */
@Service
@Transactional
public class SessionServiceImpl implements SessionService {

    private final Logger log = LoggerFactory.getLogger(SessionServiceImpl.class);

    private final SessionRepository sessionRepository;

    public SessionServiceImpl(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public Session save(Session session) {
        log.debug("Request to save Session : {}", session);
        return sessionRepository.save(session);
    }

    @Override
    public Session update(Session session) {
        log.debug("Request to save Session : {}", session);
        return sessionRepository.save(session);
    }

    @Override
    public Optional<Session> partialUpdate(Session session) {
        log.debug("Request to partially update Session : {}", session);

        return sessionRepository
            .findById(session.getId())
            .map(existingSession -> {
                if (session.getOrder() != null) {
                    existingSession.setOrder(session.getOrder());
                }
                if (session.getPercentageResolved() != null) {
                    existingSession.setPercentageResolved(session.getPercentageResolved());
                }
                if (session.getName() != null) {
                    existingSession.setName(session.getName());
                }
                if (session.getSessionNumber() != null) {
                    existingSession.setSessionNumber(session.getSessionNumber());
                }
                if (session.getCreatedDate() != null) {
                    existingSession.setCreatedDate(session.getCreatedDate());
                }

                return existingSession;
            })
            .map(sessionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Session> findAll(Pageable pageable) {
        log.debug("Request to get all Sessions");
        return sessionRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Session> findOne(Long id) {
        log.debug("Request to get Session : {}", id);
        return sessionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Session : {}", id);
        sessionRepository.deleteById(id);
    }
}
