var express = require('express');
var router = express.Router();



let serverArray = [];

let RecipeObject = function (pTitle, pCooktime, pType, pCalories, pCreator, pDate) {
    this.Title = pTitle;
    this.Cooktime = pCooktime;
    this.Type = pType;
    this.Calories = pCalories;
    this.Creator = pCreator;
    this.Date = pDate;
    this.ID = Math.random().toString(16).slice(5);

}

serverArray.push(new RecipeObject("testTitle", 5, "Breakfast", 150, "Me", 2022));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Recipe Data */
router.get('/getAllRecipes', function(req, res){
  res.status(200).json(serverArray);
});


// POST recipe data
router.post('/AddRecipe', function(req,res){
  const newRecipe = req.body;
  serverArray.push(newRecipe);
  res.status(200).json(newRecipe);

});

module.exports = router;