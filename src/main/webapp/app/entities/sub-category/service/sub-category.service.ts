import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubCategory, getSubCategoryIdentifier } from '../sub-category.model';

export type EntityResponseType = HttpResponse<ISubCategory>;
export type EntityArrayResponseType = HttpResponse<ISubCategory[]>;

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sub-categories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(subCategory: ISubCategory): Observable<EntityResponseType> {
    return this.http.post<ISubCategory>(this.resourceUrl, subCategory, { observe: 'response' });
  }

  update(subCategory: ISubCategory): Observable<EntityResponseType> {
    return this.http.put<ISubCategory>(`${this.resourceUrl}/${getSubCategoryIdentifier(subCategory) as number}`, subCategory, {
      observe: 'response',
    });
  }

  partialUpdate(subCategory: ISubCategory): Observable<EntityResponseType> {
    return this.http.patch<ISubCategory>(`${this.resourceUrl}/${getSubCategoryIdentifier(subCategory) as number}`, subCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISubCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISubCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSubCategoryToCollectionIfMissing(
    subCategoryCollection: ISubCategory[],
    ...subCategoriesToCheck: (ISubCategory | null | undefined)[]
  ): ISubCategory[] {
    const subCategories: ISubCategory[] = subCategoriesToCheck.filter(isPresent);
    if (subCategories.length > 0) {
      const subCategoryCollectionIdentifiers = subCategoryCollection.map(subCategoryItem => getSubCategoryIdentifier(subCategoryItem)!);
      const subCategoriesToAdd = subCategories.filter(subCategoryItem => {
        const subCategoryIdentifier = getSubCategoryIdentifier(subCategoryItem);
        if (subCategoryIdentifier == null || subCategoryCollectionIdentifiers.includes(subCategoryIdentifier)) {
          return false;
        }
        subCategoryCollectionIdentifiers.push(subCategoryIdentifier);
        return true;
      });
      return [...subCategoriesToAdd, ...subCategoryCollection];
    }
    return subCategoryCollection;
  }
}
