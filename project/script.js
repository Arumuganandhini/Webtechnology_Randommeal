const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const errorMessage = document.getElementById('error-message');

// Event Listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);

// Fetch Meals Based on Ingredient
function getMealList() {
  let searchInputTxt = document.getElementById('search-input').value.trim();
  mealList.innerHTML = "<p>Loading...</p>";

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    })
    .then(data => {
      let html = "";
      if (data.meals) {
        data.meals.forEach(meal => {
          html += `
            <div class="meal-item" data-id="${meal.idMeal}">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <h3>${meal.strMeal}</h3>
              <a href="#" class="recipe-btn">Get Recipe</a>
            </div>
          `;
        });
        mealList.classList.remove('notFound');
      } else {
        html = "<p>Sorry, we didn't find any meal!</p>";
        mealList.classList.add('notFound');
      }
      mealList.innerHTML = html;
    })
    .catch(error => {
      errorMessage.textContent = "Error fetching data. Please try again.";
      mealList.innerHTML = "";
    });
}

// Instead of showing a modal, redirect to a new page with the meal ID
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('recipe-btn')) {
    let mealItem = e.target.parentElement;
    let mealId = mealItem.dataset.id;
    window.location.href = `recipe.html?id=${mealId}`;
  }
}





/*
========================================
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const errorMessage = document.getElementById('error-message');

// Event Listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Fetch Meals Based on Ingredient
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    mealList.innerHTML = "<p>Loading...</p>"; // Show loading indicator

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        })
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <img src="${meal.strMealThumb}" alt="food">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "<p>Sorry, we didn't find any meal!</p>";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;
        })
        .catch(error => {
            errorMessage.textContent = "Error fetching data. Please try again.";
            mealList.innerHTML = "";
        });
}

// Fetch Meal Recipe by ID
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

*/
















// Display Recipe in Modal
function mealRecipeModal(meal) {
    meal = meal[0];
    let html = `
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><strong>Tags:</strong> ${meal.strTags ? meal.strTags : "No tags available"}</p>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <img src="${meal.strMealThumb}" alt="">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
/*
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const errorMessage = document.getElementById('error-message');

// Event Listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Fetch All Meals and Filter Locally
async function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim().toLowerCase();
    mealList.innerHTML = "<p>Loading...</p>"; // Show loading indicator

    try {
        let response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        if (!response.ok) throw new Error("Failed to fetch data");
        
        let data = await response.json();
        let meals = data.meals || [];

        // Filter meals that contain the ingredient in any form
        let filteredMeals = meals.filter(meal => mealContainsIngredient(meal, searchInputTxt));

        let html = "";
        if (filteredMeals.length > 0) {
            filteredMeals.forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <img src="${meal.strMealThumb}" alt="food">
                        <h3>${meal.strMeal}</h3>
                        <a href="#" class="recipe-btn">Get Recipe</a>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else {
            html = "<p>Sorry, we didn't find any meal!</p>";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    } catch (error) {
        errorMessage.textContent = "Error fetching data. Please try again.";
        mealList.innerHTML = "";
    }
}

// Check if Meal Contains Ingredient
function mealContainsIngredient(meal, ingredient) {
    for (let i = 1; i <= 20; i++) {
        let mealIngredient = meal[`strIngredient${i}`];
        if (mealIngredient && mealIngredient.toLowerCase().includes(ingredient)) {
            return true;
        }
    }
    return false;
}

// Fetch Meal Recipe by ID
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

// Display Recipe in Modal
function mealRecipeModal(meal) {
    meal = meal[0];
    let html = `
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><strong>Tags:</strong> ${meal.strTags ? meal.strTags : "No tags available"}</p>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <img src="${meal.strMealThumb}" alt="">
        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}
*/
