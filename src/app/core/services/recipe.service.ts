import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Category, Recipe } from '../models/recipe.model';

interface MealDbListResponse {
  meals: Recipe[] | null;
}

interface MealDbCategoriesResponse {
  categories: Category[];
}

/**
 * Consome diretamente a API externa TheMealDB.
 * Esta é a "API externa" exigida pelo enunciado — o frontend fala
 * diretamente com ela para pesquisa/listagem/detalhe de receitas.
 */
@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<MealDbListResponse>(`${this.apiUrl}/search.php?s=${query}`).pipe(
      map(res => res.meals || [])
    );
  }

  getRecipeById(id: string): Observable<Recipe | null> {
    return this.http.get<MealDbListResponse>(`${this.apiUrl}/lookup.php?i=${id}`).pipe(
      map(res => (res.meals ? res.meals[0] : null))
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<MealDbCategoriesResponse>(`${this.apiUrl}/categories.php`).pipe(
      map(res => res.categories || [])
    );
  }

  getByCategory(category: string): Observable<Recipe[]> {
    return this.http.get<MealDbListResponse>(`${this.apiUrl}/filter.php?c=${category}`).pipe(
      map(res => res.meals || [])
    );
  }
}
