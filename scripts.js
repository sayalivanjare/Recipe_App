document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const recipeGrid = document.getElementById("recipe-grid");
    const searchBtn = document.getElementById("search-btn");
    const detailedRecipeSection = document.getElementById("detailed-recipe");
    const featuredImage = document.getElementById("featured-image");
    const featuredTitle = document.getElementById("featured-title");
    const featuredDescription = document.getElementById("featured-description");
    const featuredLink = document.getElementById("featured-link");

    let currentRecipeCount = 10; // Initial recipe count

    // 🌟 Animate Search Placeholder
    const phrases = ["Search for recipes...", "Find delicious meals...", "Type your favorite dish..."];
    let phraseIndex = 0, charIndex = 0;

    function animateSearchPlaceholder() {
        if (!searchInput) return;
        if (charIndex < phrases[phraseIndex].length) {
            searchInput.setAttribute("placeholder", phrases[phraseIndex].substring(0, charIndex + 1));
            charIndex++;
            setTimeout(animateSearchPlaceholder, 100);
        } else {
            setTimeout(eraseSearchPlaceholder, 2000);
        }
    }

    function eraseSearchPlaceholder() {
        if (charIndex > 0) {
            searchInput.setAttribute("placeholder", phrases[phraseIndex].substring(0, charIndex - 1));
            charIndex--;
            setTimeout(eraseSearchPlaceholder, 50);
        } else {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(animateSearchPlaceholder, 500);
        }
    }

    animateSearchPlaceholder();

    // 🎯 Load Featured Recipe (Random Recipe)
    async function loadFeaturedRecipe() {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
            const data = await response.json();

            if (data.meals && data.meals.length > 0) {
                const recipe = data.meals[0];
                featuredImage.src = recipe.strMealThumb || "default.jpg";
                featuredTitle.textContent = recipe.strMeal;
                featuredDescription.innerHTML = recipe.strInstructions.substring(0, 150) + "...";
                featuredLink.href = recipe.strSource || "#";
            }
        } catch (error) {
            console.error("Error loading featured recipe:", error);
        }
    }

    // 🍽 Fetch Recipes by Search
    async function fetchRecipes(query = "") {
        try {
            let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            if (!data.meals) {
                recipeGrid.innerHTML = "<p>No recipes found!</p>";
                return;
            }

            recipeGrid.innerHTML = ""; // Clear previous results

            data.meals.forEach(meal => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("recipe-card");
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button class="view-recipe" data-id="${meal.idMeal}">View More</button>
                `;
                recipeGrid.appendChild(recipeCard);
            });
        } catch (error) {
            console.error("Error fetching recipes:", error);
            recipeGrid.innerHTML = "<p>Failed to load recipes.</p>";
        }
    }

    // 🍽 Fetch Detailed Recipe
    async function fetchRecipeDetails(recipeId) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            const meal = data.meals[0];

            detailedRecipeSection.innerHTML = ""; // Clear previous details

            const recipeDetailCard = document.createElement("div");
            recipeDetailCard.classList.add("detailed-recipe-card");
            recipeDetailCard.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="detailed-image">
                <h3>Ingredients:</h3>
                <ul>
                    ${getIngredientsList(meal)}
                </ul>
                <h3>Instructions:</h3>
                <p>${meal.strInstructions || "No instructions available."}</p>
            `;

            // Add Back Button
            const backButton = document.createElement("button");
            backButton.textContent = "Back to Recipes";
            backButton.classList.add("back-button");
            backButton.addEventListener("click", function () {
                detailedRecipeSection.innerHTML = "";
                recipeGrid.scrollIntoView({ behavior: "smooth" });
            });

            recipeDetailCard.appendChild(backButton);
            detailedRecipeSection.appendChild(recipeDetailCard);
            detailedRecipeSection.scrollIntoView({ behavior: "smooth" });

        } catch (error) {
            console.error("Error fetching recipe details:", error);
        }
    }

    // 📝 Helper Function to Get Ingredients List
    function getIngredientsList(meal) {
        let ingredientsList = "";
        for (let i = 1; i <= 20; i++) {
            let ingredient = meal[`strIngredient${i}`];
            let measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                ingredientsList += `<li>${measure} ${ingredient}</li>`;
            }
        }
        return ingredientsList;
    }

    // 🔍 Search Functionality
    searchBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query) {
            fetchRecipes(query);
        } else {
            alert("Please enter a recipe name.");
        }
    });

    // 🎯 Handle Recipe Clicks for Details
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("view-recipe")) {
            const recipeId = event.target.getAttribute("data-id");
            if (recipeId) fetchRecipeDetails(recipeId);
        }
    });

    // 🚀 Load Initial Recipes & Featured Recipe
    loadFeaturedRecipe();
});
