let RecipeArray = [];
let totalCal = 0;
let timeSpent = 0;

let RecipeObject = function (pTitle, pCooktime, pType, pCalories, pCreator, pDate) {
    this.Title = pTitle;
    this.Cooktime = pCooktime;
    this.Type = pType;
    this.Calories = pCalories;
    this.Creator = pCreator;
    this.Date = pDate;
    this.ID = Math.random().toString(16).slice(5);

}

// RecipeArray.push(new RecipeObject("Food", "Time", "Breakfast", 5, "Creator", 2022));
// Title - Cooktime - Type - Calories - Creator - Date
// RecipeArray.push(new RecipeObject("Apple Pie", 60, "Dessert", 1200, "John Cena", 2020));
// console.log(RecipeArray);

let selectedType = "not selected";

document.addEventListener("DOMContentLoaded", function () {

createList();

document.getElementById("buttonAdd").addEventListener("click", function () {

    let newRecipe = new RecipeObject(document.getElementById("title").value, document.getElementById("cooktime").value,
    selectedType, document.getElementById("calories").value, document.getElementById("creator").value,  document.getElementById("date").value);
    //RecipeArray.push(new RecipeObject(document.getElementById("title").value, document.getElementById("cooktime").value,
    //    selectedType, document.getElementById("calories").value, document.getElementById("creator").value,  document.getElementById("date").value));


    //push new note to server
    $.ajax({
        url:"/AddRecipe",
        type:"POST",
        data:JSON.stringify(newRecipe),
        contentType: "application/json; charset=utf-8",
            success: function(result){
                console.log(result);
                document.location.href = "index.html#page2"
            }

    })



    //document.location.href = "index.html#ListAll";
//    console.log(RecipeArray);
    // add to stats
    totalCal = 0;
    timeSpent = 0;
    RecipeArray.forEach(function (element, i) { 
        totalCal = totalCal + parseInt(element.Calories);
        timeSpent = timeSpent + parseInt(element.Cooktime);
    });
    document.getElementById("totalCal").value = totalCal;
    document.getElementById("totalRecipes").value = RecipeArray.length;
    document.getElementById("timeSpent").value = timeSpent + " total minutes";
    // end of add to stats
    });


    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("title").value = "";
        document.getElementById("cooktime").value = "";
        document.getElementById("calories").value = "";
        document.getElementById("creator").value = "";
        document.getElementById("date").value = "";
    });
    document.getElementById("select-type").addEventListener("change", function () {
        selectedType = $('#select-type').val();
    });
    document.getElementById("buttonSortTitle").addEventListener("click", function () {
        RecipeArray.sort(dynamicSort("Title"));
        createList();
        document.location.href = "index.html#ListAll";
    });
    document.getElementById("buttonSortType").addEventListener("click", function () {
        RecipeArray.sort(dynamicSort("Type"));
        createList();
        document.location.href = "index.html#ListAll";
    });
    $(document).on("pagebeforeshow", "#ListAll", function (event) {  
        createList();
    });
    $(document).on("pagebeforeshow", "#details", function (event) {   
        let RecipeID = localStorage.getItem('parm');  // get the unique key back from the storage dictionairy
        document.getElementById("thatRecipeID").innerHTML = RecipeID;
        let RecipeTitle = localStorage.getItem('recipeTitle');
        let RecipeCooktime = localStorage.getItem('recipeCooktime');
        let RecipeCalories = localStorage.getItem('recipeCalories');
        let RecipeCreator = localStorage.getItem('recipeCreator');
        let RecipeDate = localStorage.getItem('recipeDate');
        document.getElementById("thatRecipeTitle").innerHTML = RecipeTitle;
        document.getElementById("thatRecipeCooktime").innerHTML = RecipeCooktime;
        document.getElementById("thatRecipeCalories").innerHTML = RecipeCalories;
        document.getElementById("thatRecipeCreator").innerHTML = RecipeCreator;
        document.getElementById("thatRecipeDate").innerHTML = RecipeDate;
    });





});



$(document).on("pagebeforeshow","#page2",function(){
    // displays list data before sorting, sorted default by title
    RecipeArray.sort(dynamicSort("Title"));
    createList();
    document.location.href = "index.html#ListAll"
  });

function createList() {
    // clear prior data
    var theList = document.getElementById("myul");
    theList.innerHTML = "";

    // refresh RecipeArray from the server's serverArray
    $.get("/getAllRecipes", function(data,status){
        RecipeArray =data;

        RecipeArray.forEach(function (element, i) {   
            var myLi = document.createElement('li');
            myLi.classList.add('oneRecipe');
            myLi.innerHTML =  element.ID + ":  " + element.Title + ",  " + element.Type;

            myLi.setAttribute("data-parm", element.ID);
            myLi.setAttribute("data-title", element.Title);
            myLi.setAttribute("data-cooktime", element.Cooktime);
            myLi.setAttribute("data-calories", element.Calories);
            myLi.setAttribute("data-creator", element.Creator);
            myLi.setAttribute("data-date", element.Date);


            theList.appendChild(myLi);
    });

    var liList = document.getElementsByClassName("oneRecipe");
    let newRecipeArray = Array.from(liList);

    newRecipeArray.forEach(function (element,i) {     
        element.addEventListener('click', function () {     
            
            // I did it a primitive way which does not use the array. If I had more values I would do a more complex setup.

            var parm = this.getAttribute("data-parm"); 
            localStorage.setItem('parm', parm);
            let recipeTitle = this.getAttribute("data-title") ;
            localStorage.setItem('recipeTitle', recipeTitle);
            let recipeCooktime = this.getAttribute("data-cooktime") ;
            localStorage.setItem('recipeCooktime', recipeCooktime);
            let recipeCalories = this.getAttribute("data-calories") ;
            localStorage.setItem('recipeCalories', recipeCalories);
            let recipeCreator = this.getAttribute("data-creator") ;
            localStorage.setItem('recipeCreator', recipeCreator);
            let recipeDate = this.getAttribute("data-date") ;
            localStorage.setItem('recipeDate', recipeDate);
        
            document.location.href = "index.html#details";
        });
    });
  
    });

};

function dynamicSort(property) {

 
    return function (a, b) {
            return a[property].localeCompare(b[property]);
    }
}
