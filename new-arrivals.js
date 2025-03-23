document.addEventListener("DOMContentLoaded", async function () {
    const newArrivalsList = document.getElementById("new-arrivals-list");

    // ✅ Updated API URL: fetches meals starting with "C"
    const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?f=c";

    async function fetchNewArrivals() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            console.log("API response data:", data); // Debug log

            const meals = Array.isArray(data.meals) ? data.meals : [];

            if (!meals.length) {
                newArrivalsList.innerHTML = `
                    <p>🚫 No recipes available at the moment.</p>
                `;
                return;
            }

            meals.slice(0, 6).forEach(meal => {
                const recipeCard = document.createElement("div");
                recipeCard.classList.add("new-arrivals-card");
                recipeCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button class="view-recipe" onclick="window.open('https://www.themealdb.com/meal/${meal.idMeal}', '_blank')">👀 View Recipe</button>
                `;
                newArrivalsList.appendChild(recipeCard);
            });
        } catch (error) {
            console.error("Error fetching new arrivals:", error);
            newArrivalsList.innerHTML = `
                <p>⚠️ Failed to load recipes. Please try again later.</p>
            `;
        }
    }

    fetchNewArrivals();
});
