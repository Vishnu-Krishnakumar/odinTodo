function createTodo(title,description,dueDate,priority,pIndex,completed = false,taskIndex){

    return { title,description,dueDate,priority,pIndex,completed,taskIndex }

}

export {createTodo};