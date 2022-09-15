package db.com.mentalhealth.repository;

import db.com.mentalhealth.domain.ScenarioStatusEvent;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ScenarioStatusEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScenarioStatusEventRepository extends JpaRepository<ScenarioStatusEvent, Long> {}
