import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadFavorites();
  }

  loadFavorites(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.http.get<any>('http://localhost:3000/favorites', { headers }).subscribe({
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

  removeFavorite(meal_id: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.http.delete(`http://localhost:3000/favorites/${meal_id}`, { headers }).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.meal_id !== meal_id);
      },
      error: () => {
        this.error = 'Erro ao remover favorito';
      }
    });
  }
}