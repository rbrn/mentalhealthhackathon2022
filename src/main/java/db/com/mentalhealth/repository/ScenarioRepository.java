package db.com.mentalhealth.repository;

import db.com.mentalhealth.domain.Scenario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Scenario entity.
 */
@Repository
public interface ScenarioRepository extends JpaRepository<Scenario, Long> {
    default Optional<Scenario> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Scenario> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Scenario> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct scenario from Scenario scenario left join fetch scenario.category left join fetch scenario.subcategory left join fetch scenario.question left join fetch scenario.session",
        countQuery = "select count(distinct scenario) from Scenario scenario"
    )
    Page<Scenario> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct scenario from Scenario scenario left join fetch scenario.category left join fetch scenario.subcategory left join fetch scenario.question left join fetch scenario.session"
    )
    List<Scenario> findAllWithToOneRelationships();

    @Query(
        "select scenario from Scenario scenario left join fetch scenario.category left join fetch scenario.subcategory left join fetch scenario.question left join fetch scenario.session where scenario.id =:id"
    )
    Optional<Scenario> findOneWithToOneRelationships(@Param("id") Long id);
}
