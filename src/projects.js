function createProject(name){
    let tasks = []
    function addTasks (task){
        tasks.push(task);
    }
    return { name, tasks, addTasks };
}

export {createProject  };