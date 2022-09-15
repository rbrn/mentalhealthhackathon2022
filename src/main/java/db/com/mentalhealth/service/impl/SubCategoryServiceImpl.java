package db.com.mentalhealth.service.impl;

import db.com.mentalhealth.domain.SubCategory;
import db.com.mentalhealth.repository.SubCategoryRepository;
import db.com.mentalhealth.service.SubCategoryService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SubCategory}.
 */
@Service
@Transactional
public class SubCategoryServiceImpl implements SubCategoryService {

    private final Logger log = LoggerFactory.getLogger(SubCategoryServiceImpl.class);

    private final SubCategoryRepository subCategoryRepository;

    public SubCategoryServiceImpl(SubCategoryRepository subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    @Override
    public SubCategory save(SubCategory subCategory) {
        log.debug("Request to save SubCategory : {}", subCategory);
        return subCategoryRepository.save(subCategory);
    }

    @Override
    public SubCategory update(SubCategory subCategory) {
        log.debug("Request to save SubCategory : {}", subCategory);
        return subCategoryRepository.save(subCategory);
    }

    @Override
    public Optional<SubCategory> partialUpdate(SubCategory subCategory) {
        log.debug("Request to partially update SubCategory : {}", subCategory);

        return subCategoryRepository
            .findById(subCategory.getId())
            .map(existingSubCategory -> {
                if (subCategory.getName() != null) {
                    existingSubCategory.setName(subCategory.getName());
                }

                return existingSubCategory;
            })
            .map(subCategoryRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubCategory> findAll(Pageable pageable) {
        log.debug("Request to get all SubCategories");
        return subCategoryRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SubCategory> findOne(Long id) {
        log.debug("Request to get SubCategory : {}", id);
        return subCategoryRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SubCategory : {}", id);
        subCategoryRepository.deleteById(id);
    }
}
