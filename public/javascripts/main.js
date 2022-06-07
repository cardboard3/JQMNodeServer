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
    // I had an ID, the text that was like "ID++" caused an internal server error. I removed it and it works fine now 
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

            theList.appendChild(myLi);
    });

    var liList = document.getElementsByClassName("oneRecipe");
    let newRecipeArray = Array.from(liList);

    newRecipeArray.forEach(function (element,i) {     
        element.addEventListener('click', function () {     
            
            var parm = this.getAttribute("data-parm"); 
            localStorage.setItem('parm', parm);
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
