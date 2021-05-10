

// //default export: use it when we only want to export 1 thing from the module:
// export default 'I am an exported string';


//data here is the query and the search result so we will only export here the following class:
import axios from 'axios';
import{} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
//method:
    async getResults(){
        try{
           const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
           this.result = res.data.recipes;
        //    console.log(this.result);
        } catch(error) {
            alert(error)
        }
   }
}


