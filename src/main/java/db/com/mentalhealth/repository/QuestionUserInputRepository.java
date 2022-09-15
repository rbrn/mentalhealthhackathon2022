package db.com.mentalhealth.repository;

import db.com.mentalhealth.domain.QuestionUserInput;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the QuestionUserInput entity.
 */
@Repository
public interface QuestionUserInputRepository extends JpaRepository<QuestionUserInput, Long> {
    default Optional<QuestionUserInput> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<QuestionUserInput> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<QuestionUserInput> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct questionUserInput from QuestionUserInput questionUserInput left join fetch questionUserInput.scenario",
        countQuery = "select count(distinct questionUserInput) from QuestionUserInput questionUserInput"
    )
    Page<QuestionUserInput> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct questionUserInput from QuestionUserInput questionUserInput left join fetch questionUserInput.scenario")
    List<QuestionUserInput> findAllWithToOneRelationships();

    @Query(
        "select questionUserInput from QuestionUserInput questionUserInput left join fetch questionUserInput.scenario where questionUserInput.id =:id"
    )
    Optional<QuestionUserInput> findOneWithToOneRelationships(@Param("id") Long id);
}
