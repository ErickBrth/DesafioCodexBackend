module.exports = {
    sortTaskByPriority: (a, b) => {
        if(a.priority === b.priority) {
            return 0;
        } else if(a.priority === 'alta') {
            return -1;
        } else {
            return 1;
        }
    }
}