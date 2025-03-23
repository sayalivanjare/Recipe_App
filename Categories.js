document.addEventListener("DOMContentLoaded", function () {
    const recipeGrid = document.getElementById("recipe-grid");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

    async function fetchCategoryRecipes(category) {
        try {
            const response = await fetch(`${API_URL}${category}`);
            const data = await response.json();

            if (!data.meals) {
                recipeGrid.innerHTML = "<p>No recipes found!</p>";
                return;
            }

            recipeGrid.innerHTML = ""; // Clear previous recipes

            data.meals.forEach(meal => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                `;
                recipeGrid.appendChild(recipeCard);
            });

        } catch (error) {
            console.error("Error fetching recipes:", error);
            recipeGrid.innerHTML = "<p>Failed to load recipes.</p>";
        }
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");
            fetchCategoryRecipes(category);
        });
    });
});
