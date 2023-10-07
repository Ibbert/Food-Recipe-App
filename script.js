// Declare varriable for the Divs for index.html
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const mealList = document.getElementById("mealList");
const modalContainer = document.querySelector(".modal-container");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseButton = document.getElementById("recipeCloseButton");

// Event listeners
searchButton.addEventListener("click", async () => {
  const recipe = searchInput.value.trim();
  if (recipe) {
    const meals = await searchMealsByIngredient(recipe);
    displayMeals(meals);
  }
});

mealList.addEventListener("click", async (e) => {
  const card = e.target.closest(".meal-item");
  if (card) {
    const mealId = card.dataset.id;
    const meal = await getMealDetails(mealId);
    if (meal) {
      showMealDetailsPopup(meal);
    }
  }
});

// Function to fetch meals by recipe
async function searchMealsByIngredient(recipe) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${recipe}`
    );
    const data = await response.json();
    return data.meals;
  } catch (error) {
    // Show error in console
    console.error("Error fetching data:", error);
  }
}

// Function to fetch meal details by ID
async function getMealDetails(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

// Function to display meals in the list
function displayMeals(meals) {
  mealList.innerHTML = " ";
  if (meals) {
    meals.forEach((meal) => {
      const mealItem = document.createElement("div");
      mealItem.classList.add("meal-item");
      mealItem.dataset.id = meal.idMeal;
      mealItem.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
      mealList.appendChild(mealItem);
    });
  } else {
    mealList.innerHTML = "<p>No meals found. Try another recipe</p>";
  }
}

// Function to create and display meal details on popup with HTML and CSS
function showMealDetailsPopup(meal) {
  mealDetailsContent.innerHTML = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>How to make:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="recipe-video">
            <a href="${meal.strYoutube}" target="_blank">Video Tutorial</a>
        </div>
    `;
  modalContainer.style.display = "block";
}

// Event listener for popup close button
recipeCloseButton.addEventListener("click", closeRecipeModal);

function closeRecipeModal() {
  modalContainer.style.display = "none";
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

async function performSearch() {
  const recipe = searchInput.value.trim();
  if (recipe) {
    const meals = await searchMealsByIngredient(recipe);
    displayMeals(meals);
  }
}
