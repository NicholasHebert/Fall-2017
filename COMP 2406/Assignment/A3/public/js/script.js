function getRecipes() {

    let ingredients = document.getElementById('ingredients').value
    console.log(ingredients)
    if(ingredients === '') {
        return alert('Please enter ingredients')
    }
    //ingredients.split(" ").join("")
    let recipeDiv = document.getElementById('RecipeList')
    recipeDiv.innerHTML = ''

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText)//parse the JSON string received
            console.log(response)
            for(i in response.recipes){//create the recipes divs individually
                recipeDiv.innerHTML = recipeDiv.innerHTML +
                '<div class="recipe">' +
                '<a href="' + response.recipes[i].source_url + '" target="_blank">' +
                '<img src="' + response.recipes[i].image_url + '"/><br/>' +
                response.recipes[i].title + '</a></div>'
            }
        }
    }
    xhr.open('GET', `/recipes?ingredients=${ingredients}`, true)
    xhr.send()
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("ingredients")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ENTER) {
        document.getElementById("submit").click();
    }
});
