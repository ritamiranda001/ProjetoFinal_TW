export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  // TheMealDB devolve até 20 pares ingrediente/medida com chaves dinâmicas
  // (strIngredient1..20, strMeasure1..20), por isso a assinatura de índice.
  [key: string]: string | undefined;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Ingredient {
  name: string;
  measure: string;
}
