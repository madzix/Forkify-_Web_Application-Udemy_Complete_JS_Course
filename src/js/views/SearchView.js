
//UNIT 138 - importing-exporting -named and default
//named export
// export  const add  = (a,b) => a + b; //named export to export multiple things : instead of the dafeult word we declare a variable/function, etc.

// export const multiply = (a,b) => a * b;
// export const ID=23;

import {elements} from './base';

export const getInput = () => elements.searchInput.value; //implicit return even without curly brackets- feature of arrow fns

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML ='';
};

export const hightlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })


    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

/* fn, which will remove words from the search ressults, if they are exceeding 1 line:

'Pasta with toamto and spianch'
acc 0 /acc + cur.length = 5 /NewTitle =['Pasta']
acc 5 /acc + cur.length = 9 /NewTitle =['Pasta with']
acc 9 /acc + cur.length = 15 /NewTitle =['Pasta with tomato']
acc 15/ acc + cur.length = 18 /NewTitle =['Pasta with tomato']
acc 18/ acc + cur.length = 24 /NewTitle =['Pasta with tomato']

*/
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
    }
    //return the result
    return `${newTitle.join(' ')} ...`;  //as return statement above - no need to write 'return'
}


// array displaying all the results of a given search query into an array: 
// fn receiving one recipe. it is a private fn , w do not need to export it
const renderRecipe = recipe => {
    const markup = `
                 <li>
                    <a class="results__link " href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
               `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup );
};

//type: 'prev''/'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
        <span>Page ${type === 'prev' ? page - 1: page + 1} </span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
    </button>
`;




//render buttons according to the page No we are on
const renderButtons = (page, numResults, resPerpage) => {
    const pages =  Math.ceil(numResults / resPerpage); //rounding up in case the reusult is a fraction
    
    let button;
    if(page == 1 && pages > 1) {
        //only button to go to next page 
        button = createButton(page, 'next');
    } else if (page < pages){
        //both buttons
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;

    } else if (page === pages && pages > 1) {
        //only button to go to previous page 
        button = createButton(page, 'prev');
    }
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};

//to print each entry to the ui
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //display the number of results per page
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;
    
    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};