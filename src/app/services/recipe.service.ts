import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/search.php?s=${query}`).pipe(
      map(res => res.meals || [])
    );
  }

  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lookup.php?i=${id}`).pipe(
      map(res => res.meals ? res.meals[0] : null)
    );
  }

  getRandomRecipes(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/search.php?s=`).pipe(
      map(res => res.meals || [])
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/categories.php`).pipe(
      map(res => res.categories || [])
    );
  }

  getByCategory(category: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/filter.php?c=${category}`).pipe(
      map(res => res.meals || [])
    );
  }
}