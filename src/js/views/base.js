

//in base we put things wich will be reausable in different places in the page/application
//object containing all of the elements is selected from DOM:

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput:  document.querySelector('.search__field'),
    searchRes:   document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'), 
    searchResPages :document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'), 
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader',
};

//attaching the loader to the parent will make it reusable - we can attach it to different parents
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};



