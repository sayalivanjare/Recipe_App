document.addEventListener("DOMContentLoaded", function () {
    const cuisineSection = document.getElementById("cuisine-section");
    const cuisineSelect = document.getElementById("cuisine-select");
    const recipeGrid = document.getElementById("recipe-grid");

    async function fetchCuisineRecipes(cuisine) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
            const data = await response.json();
            recipeGrid.innerHTML = ""; 

            if (data.meals) {
                data.meals.forEach(meal => {
                    const mealCard = document.createElement("div");
                    mealCard.classList.add("recipe-card");
                    mealCard.innerHTML = `
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        <h3>${meal.strMeal}</h3>
                         <button class="view-recipe" onclick="window.open('https://www.themealdb.com/meal/${meal.idMeal}', '_blank')">👀 View Recipe</button>

                    `;
                    recipeGrid.appendChild(mealCard);
                });
            } else {
                recipeGrid.innerHTML = "<p>No recipes found!</p>";
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
            recipeGrid.innerHTML = "<p>Failed to load recipes.</p>";
        }
    }

    cuisineSelect.addEventListener("change", function () {
        const selectedCuisine = cuisineSelect.value;
        if (selectedCuisine) {
            fetchCuisineRecipes(selectedCuisine);
        }
    });
});
