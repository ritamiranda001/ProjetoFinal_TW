import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { Ingredient, Recipe } from '../../core/models/recipe.model';
import { getCategoryIcon } from '../../shared/category-icons';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private favoriteService = inject(FavoriteService);
  authService = inject(AuthService);

  getCategoryIcon = getCategoryIcon;

  recipe: Recipe | null = null;
  ingredients: Ingredient[] = [];
  loading = true;
  notFound = false;
  isFavorite = false;
  favoriteLoading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        if (!recipe) {
          this.notFound = true;
          this.loading = false;
          return;
        }
        this.recipe = recipe;
        this.ingredients = this.extractIngredients(recipe);
        this.loading = false;

        if (this.authService.isLoggedIn()) {
          this.checkIfFavorite(id);
        }
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      }
    });
  }

  // TheMealDB devolve os ingredientes espalhados em campos
  // strIngredient1..20 / strMeasure1..20 em vez de um array.
  // Aqui transformamos isso numa lista simples de usar no template.
  private extractIngredients(recipe: Recipe): Ingredient[] {
    const list: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const name = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (name && name.trim()) {
        list.push({ name: name.trim(), measure: (measure || '').trim() });
      }
    }
    return list;
  }

  private checkIfFavorite(mealId: string): void {
    this.favoriteService.getFavorites().subscribe({
      next: (res) => {
        this.isFavorite = res.favorites.some(f => f.meal_id === mealId);
      }
    });
  }

  toggleFavorite(): void {
    if (!this.recipe || this.favoriteLoading) return;
    this.favoriteLoading = true;

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(this.recipe.idMeal).subscribe({
        next: () => {
          this.isFavorite = false;
          this.favoriteLoading = false;
        },
        error: () => {
          this.favoriteLoading = false;
        }
      });
    } else {
      this.favoriteService
        .addFavorite(this.recipe.idMeal, this.recipe.strMeal, this.recipe.strMealThumb)
        .subscribe({
          next: () => {
            this.isFavorite = true;
            this.favoriteLoading = false;
          },
          error: () => {
            this.favoriteLoading = false;
          }
        });
    }
  }
}
