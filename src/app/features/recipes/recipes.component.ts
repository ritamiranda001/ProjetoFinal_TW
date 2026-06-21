import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../core/services/recipe.service';
import { Category, Recipe } from '../../core/models/recipe.model';
import { getCategoryIcon } from '../../shared/category-icons';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule, RouterLink],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  private recipeService = inject(RecipeService);

  recipes: Recipe[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory = '';
  loading = false;

  // Exposto ao template para desenhar o ícone de cada categoria/tag
  getCategoryIcon = getCategoryIcon;

  ngOnInit(): void {
    this.loadCategories();
    this.loadDefault();
  }

  loadCategories(): void {
    this.recipeService.getCategories().subscribe(cats => {
      this.categories = cats.slice(0, 10);
    });
  }

  loadDefault(): void {
    this.loading = true;
    this.recipeService.searchRecipes('chicken').subscribe(meals => {
      this.recipes = meals;
      this.loading = false;
    });
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.loading = true;
    this.selectedCategory = '';
    this.recipeService.searchRecipes(this.searchQuery).subscribe(meals => {
      this.recipes = meals;
      this.loading = false;
    });
  }

  onCategory(category: string): void {
    this.selectedCategory = category;
    this.searchQuery = '';
    this.loading = true;
    this.recipeService.getByCategory(category).subscribe(meals => {
      this.recipes = meals;
      this.loading = false;
    });
  }
}
