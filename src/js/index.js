// Global app controller


/* global state of the app
   - Search object - search query and result
   - current recipe object
   - shopping list object
   - liked recipes
  */

// async function getResults(query){
//     //we would use fetch but it is n ot supported by newer browesers, so we are gonna use library axios- which we need to install in the npm
//     //works exactly as fetch, it does ajax calls. the package gives us access to the axios fn
//      try{
//         const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
//         const recipes = res.data.recipes;
//         console.log(recipes);
//      } catch(error) {
//          alert(error)
//      }
// }
// getResults('chicken');

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as SearchView from './views/SearchView'; // we need all the fuinctions which are written in Searchview hence the '*'. The values of these functions are gonna be stored in an object 
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';



const state = {};
// window.state= state;

/**Search controller */

const controlSearch = async () => {
    //1) get query from the view, read input from input field
    const query = SearchView.getInput();
  

     if(query) {
         // 2) new search object and add it to state
         state.search = new Search(query); //create a new search object containing the query

         // 3)prepare UI for results
         SearchView.clearInput();
         SearchView.clearResults(); //cleaning previous results when entering another search query

         renderLoader(elements.searchRes);

    try {
        // 4) search for recipes
        await state.search.getResults();  //get results from API call

        //5) render results on UI
        //removing the loader:
        clearLoader();

        SearchView.renderResults(state.search.result);  //rendering results to the DOM

    } catch (error) {
        alert('Something went wrong with the search...')
        clearLoader();
    }
  }
}


const search = new Search('pizza');

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); //prevents webpage from loading on submitting the form
    controlSearch();
});


//here providing event inside the callback function allows us to see the target eleement on click. 'closest' is referring to the closest ancestor  = EVENT DELEGATION
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    //console.log(btn);
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResults();
        SearchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});

/**Recipe controller */

const controlRecipe = async ()  => {
    //get id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
        //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected search item
        if (state.search) SearchView.hightlightSelected(id);

        //create new recipe object
        state.recipe = new Recipe(id);

        try{ 
            //get recipe data loading in the background, hence await  and parse the ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calcuate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
        
            //render recipe
            clearLoader();
            recipeView.renderRecipe(
                
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch (error){
            console.log(error);
            alert('Error processing recipe');
        }
    }
}
//hash change event
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe );
//how to make the above called only once, so many events once
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/** LIST CONTROLLER */

const controlList = () => {
    //Create a new list if there is none
    if(!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

//handle, delete and update item events

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //delete from state 
        state.list.deleteItem(id);
         
        //delete from UI
        listView.deleteItem(id);
        //handle the count update
    } else if(e.target.matches('.shopping__count-value')) {
        //we need to read the data from the UI and update the state
        //read value of the element that has just been clicked 
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);

    }

});

/** Like CONTROLLER */


const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //User has NOT yet liked the current recipe

    if(!state.likes.isLiked(currentID)) {
         //add the like to the state
         const newLike = state.likes.addLike(
             currentID,
             state.recipe.title,
             state.recipe.author,
             state.recipe.img
         );

         //toggle like button
         likesView.toggleLikeBtn(true);

         //add like to the UI list 
         likesView.renderLike(newLike);
        // console.log(state.likes);

    //user has liked current recipe 
    } else {
        //remove the like from the state
        state.likes.deleteLike(currentID);

         //toggle like button
         likesView.toggleLikeBtn(false);
         

         //remove like from the UI list 
         console.log("DELTE", currentID)
         likesView.deleteLike(currentID);
        //  console.log(state.likes);
    }
    
    likesView.toggleLikemenu(state.likes.getNumLikes());

};


//restore liked recipes on page load 
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    //Restore likes
    state.likes.readStorage();
 
    //Toggle like menu button 
    likesView.toggleLikemenu(state.likes.getNumLikes());

    //render the existing likes 
    state.likes.likes.forEach(like => likesView.renderLike(like));
});




// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    
    if(e.target.matches('.btn-decrease, .btn-decrease *')){ //bntn decrease or any child element - the *
        //decrease button is clicked
        if(state.recipe.servings > 1 ){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){ //btn decrease or any child element - the *
        //increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();

    }
    
});
// window.l = new List();
