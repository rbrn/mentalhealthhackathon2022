export interface ISubCategory {
  id?: number;
  name?: string | null;
}

export class SubCategory implements ISubCategory {
  constructor(public id?: number, public name?: string | null) {}
}

export function getSubCategoryIdentifier(subCategory: ISubCategory): number | undefined {
  return subCategory.id;
}
