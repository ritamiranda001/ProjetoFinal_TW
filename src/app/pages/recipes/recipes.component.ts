import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, FormsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipes: any[] = [];
  categories: any[] = [];
  searchQuery = '';
  selectedCategory = '';
  loading = false;
  searched = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadDefault();
  }

 loadCategories(): void {
  this.recipeService.getCategories().subscribe((cats: any[]) => {
    this.categories = cats.slice(0, 10);
  });
}

loadDefault(): void {
  this.loading = true;
  this.recipeService.searchRecipes('chicken').subscribe((meals: any[]) => {
    this.recipes = meals;
    this.loading = false;
  });
}

onSearch(): void {
  if (!this.searchQuery.trim()) return;
  this.loading = true;
  this.searched = true;
  this.selectedCategory = '';
  this.recipeService.searchRecipes(this.searchQuery).subscribe((meals: any[]) => {
    this.recipes = meals;
    this.loading = false;
  });
}

onCategory(category: string): void {
  this.selectedCategory = category;
  this.searchQuery = '';
  this.loading = true;
  this.recipeService.getByCategory(category).subscribe((meals: any[]) => {
    this.recipes = meals;
    this.loading = false;
  });
}

  goToDetail(id: string): void {
    this.router.navigate(['/recipes', id]);
  }
}