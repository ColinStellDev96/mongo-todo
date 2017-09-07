$(document).ready(function(){

// VUE.js CHECKBOX'S

var mainVm = new Vue({
    el: '#todoList',
    data: {
        todoItems: [],
        newItem: '',
    }, // end of data
    methods: {
        addItem: function(event){
            event.preventDefault();
            console.log('addItem');
            // es6 => binds this to current function which refers to our data.
            $.post('/todo', {todoItem: this.newItem}, (data) => {
                console.log(data);
                mainVm.newItem = '';
                mainVm.todoItems = data;
            });
        },
        markFinished: function (event, todoID){
            event.preventDefault();
            // '/todo/finished' (add this for readability)
            $.post('/finished', {todoID}, (data) => {
                console.log(data);
                mainVm.todoItems = data;
            });
        },
        markIncom: function (event, todoID){
            event.preventDefault();
            $.post('/incom', {todoID}, (data) => {
                console.log(data);
                mainVm.todoItems = data;
            });
        },

        deleteToDo: function(event, toDoId){
            console.log(toDoId);
            event.preventDefault();
                $.post(`/todo/delete/${toDoId}`, (data) => {
                mainVm.todoItems = data;
            });
        }
    }, // end of methods
    created: function(){
        $.get('/todo', (data) => {
        // console.log('here is the data', data);
        // console.log(this);
            mainVm.todoItems = data;
        });
    }, // end of created
}); // end of Vue


}); // end of document
