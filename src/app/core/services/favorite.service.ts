import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { MessageResponse } from '../models/user.model';

/**
 * Fala com o NOSSO backend (não com a API externa).
 * É aqui que ficam guardados os favoritos de cada utilizador.
 */
@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private http = inject(HttpClient);
  private apiUrl = '/api/favorites';

  getFavorites(): Observable<{ favorites: Favorite[] }> {
    return this.http.get<{ favorites: Favorite[] }>(this.apiUrl);
  }

  addFavorite(mealId: string, mealName: string, mealThumb: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.apiUrl, {
      meal_id: mealId,
      meal_name: mealName,
      meal_thumb: mealThumb
    });
  }

  removeFavorite(mealId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.apiUrl}/${mealId}`);
  }
}
