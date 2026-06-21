import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { Favorite } from '../../core/models/favorite.model';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);

  favorites: Favorite[] = [];
  loading = true;
  error = '';

  // Nota: esta página só é alcançada se o utilizador estiver autenticado
  // (ver authGuard em app.routes.ts), por isso não precisamos de
  // repetir aqui a verificação de login.
  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (res) => {
        this.favorites = res.favorites;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar favoritos';
        this.loading = false;
      }
    });
  }

  removeFavorite(mealId: string): void {
    this.favoriteService.removeFavorite(mealId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.meal_id !== mealId);
      },
      error: () => {
        this.error = 'Erro ao remover favorito';
      }
    });
  }
}
