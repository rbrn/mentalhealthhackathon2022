package db.com.mentalhealth.service;

import db.com.mentalhealth.domain.SubCategory;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SubCategory}.
 */
public interface SubCategoryService {
    /**
     * Save a subCategory.
     *
     * @param subCategory the entity to save.
     * @return the persisted entity.
     */
    SubCategory save(SubCategory subCategory);

    /**
     * Updates a subCategory.
     *
     * @param subCategory the entity to update.
     * @return the persisted entity.
     */
    SubCategory update(SubCategory subCategory);

    /**
     * Partially updates a subCategory.
     *
     * @param subCategory the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SubCategory> partialUpdate(SubCategory subCategory);

    /**
     * Get all the subCategories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SubCategory> findAll(Pageable pageable);

    /**
     * Get the "id" subCategory.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SubCategory> findOne(Long id);

    /**
     * Delete the "id" subCategory.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
