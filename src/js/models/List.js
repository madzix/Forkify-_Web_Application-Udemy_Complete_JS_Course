import uniqid from 'uniqid';

export default class List{
    constructor() {
        this.items = []
    }
    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit, 
            ingredient
        }
        this.items.push(item);
        return item;
    }
    deleteItem(id){
        //splice [2,4,8] splice(1,1) , return 4, array[2,4]
        //slice [2,4,8] splice(1,2) , return 4, array[2,4,8]
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }
    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;

    }

};