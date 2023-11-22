
const moviesContainer = document.getElementById("movies-container")

async function onFetchMoviesClick() {
    const response = await fetch("http://localhost:3005/movies")
    const movieList = await response.json()

    moviesContainer.innerHTML = movieList.map(
        movie => `<div class="bg-light rounded mt-5">
            <h3>${movie.title}</h3>
            <p>${movie.genreId}</p>
        </div>`
    ).join("")
}

// We're just having update and delete work off the last created item
// for simplicity in this demo, in a real app we wouldn't do this
let lastCreatedItem = null

async function onCreateMovieClick() {
    // In a real app this test movie would probably have data
    // filled out by the user in some kind of create form
    const testMovie = { title: "Test", genreId: 1 }
    const response = await fetch("http://localhost:3005/movies", {
        method: "POST", // create
        headers: { "Content-Type": "application/json" }, // I recommend copy-pasting this
        body: JSON.stringify(testMovie) // Turns JS data into JSON data
    })
    // We need to parse out the newly created item from the response body
    // because that newly created item will have the id given to it by the backend
    const newlyCreatedItem = await response.json()
    lastCreatedItem = newlyCreatedItem
}

async function onUpdateMovieClick() {
    // This is just a little error checking for our demo
    if(lastCreatedItem === null) {
        console.log("No item created yet to update")
        return
    }
    // In this app we don't need the response and we don't need to wait
    // for the request to finish, but in a different app we might
    // Make sure the URL has the id of the item to update on the end  
    fetch("http://localhost:3005/movies/" + lastCreatedItem.id, {
        method: "PUT", // update
        headers: { "Content-Type": "application/json" },
        // In a real app this updated data would probably be
        // from the user filling out some kind of update form
        // or specifying some kind of update they want to make
        body: JSON.stringify({ title: "Test Updated", genreId: 2 })
    })
}

async function onDeleteMovieClick() {
    // This is just a little error checking for our demo
    if(lastCreatedItem === null) {
        console.log("No item created yet to delete")
        return
    }
    // In this app we don't need the response and we don't need to wait
    // for the request to finish, but in a different app we might
    // Make sure the URL has the id of the item to delete on the end
    fetch("http://localhost:3005/movies/" + lastCreatedItem.id, {
        method: "DELETE", // delete
    })
}

/***** GENRES *****/

const genresContainer = document.getElementById("genres-container")
const genreIdTextbox = document.getElementById("genre-id-textbox")

async function onFetchGenresClick() {
    const response = await fetch("http://localhost:3005/genres")
    const genreList = await response.json()

    genresContainer.innerHTML = genreList.map(
        genre => `<div class="bg-light rounded mt-5">
            <h3>${genre.title}</h3>
            <p>id: ${genre.id}</p>
        </div>`
    ).join("")
}

async function onCreateGenreClick() {
    const newGenre = { title: "New Genre" }
    
    // TODO: Create the new genre on the backend
}

async function onUpdateGenreClick() {
    const idToUpdate = genreIdTextbox.value
    const updatedGenreData = { title: "Updated Genre" }
    
    // TODO: Update the genre with the idToUpdate to have the updatedGenreData

    genreIdTextbox.value = ""
}

async function onDeleteGenreClick() {
    const idToDelete = genreIdTextbox.value
    
    // TODO: Delete the genre with the idToDelete

    genreIdTextbox.value = ""
}