export interface ICategory {
  id?: number;
  name?: string | null;
}

export class Category implements ICategory {
  constructor(public id?: number, public name?: string | null) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
