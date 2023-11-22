
/**** STATE ****/

let reviewList = []
let reviewToEditId = null
let user = "Natalie"
let movieId = 3

/**** RENDERING & LISTENING ****/

const reviewsContainer = document.getElementById("reviews-container")
const reviewStarsSelect = document.getElementById("review-stars-select")
const reviewTextarea = document.getElementById("review-textarea")

/**
 * Render a list of reviews
 */
function renderReviewList() {
    // Clear out anything from previous renders
    reviewsContainer.innerHTML = ""

    // If there's no reviews, show an empty message
    if (reviewList.length === 0) {
        reviewsContainer.innerHTML = "No reviews yet"
    }

    // For each review, map it to a div, then append that div to the container
    reviewList.map(renderReview).forEach(div => reviewsContainer.appendChild(div))
}

/**
 * Render one review
 */
function renderReview(review) {
    const reviewDiv = document.createElement("div")
    reviewDiv.className = "bg-light mb-3 p-4"
    reviewDiv.innerHTML = `
        <h5>${review.author}</h5>
        <p>${Array(review.stars).fill(null).map(_ => "⭐").join("")}</p>
        <p>${review.text}</p>
        <button id="edit-button" class="btn btn-sm btn-outline-primary">Edit</button>
        <button id="delete-button" class="btn btn-sm btn-outline-danger">Delete</button>
    `
    // Attach the event listener to the edit button that gets the form ready to edit
    reviewDiv.querySelector("#edit-button").addEventListener("click", () => {
        reviewToEditId = review.id
        renderReviewForm(review)
    })
    // Attach the event listener to the delete button that deletes the review
    reviewDiv.querySelector("#delete-button").addEventListener("click", async () => {
        
        // Delete on the backend first
        await deleteReview(review.id)
        // Delete on the frontend
        const indexToDelete = reviewList.indexOf(review)
        reviewList.splice(indexToDelete, 1)

        renderReviewList()
    })
    return reviewDiv
}

/**
 * Update the review form to match the review data given
 */
function renderReviewForm(reviewData) {
    reviewStarsSelect.value = reviewData.stars
    reviewTextarea.value = reviewData.text
}

/**
 * When the save button is clicked, either save an edit or a create
 */
async function onSaveReviewClick(event) {
    event.preventDefault()
    const reviewData = {
        author: user,
        movieId: movieId,
        text: reviewTextarea.value,
        stars: parseInt(reviewStarsSelect.value)
    }

    if(reviewToEditId !== null) {
        // Update on backend
        reviewData.id = reviewToEditId
        await putReview(reviewData)

        // Update on frontend
        const indexToReplace = reviewList.findIndex(r => r.id === reviewToEditId)
        reviewList[indexToReplace] = reviewData
    } else {
        // Update on backend
        const createdReview = await postReview(reviewData)

        // Update on frontend
        reviewList.push(createdReview)
    }

    renderReviewList()
    reviewToEditId = null
    // Clear the form
    renderReviewForm({ stars: 1, text: "" })
}

/**** FETCHING ****/

async function fetchAllReviews() {
    const response = await fetch("http://localhost:3005/reviews")
    return response.json()
}

async function postReview(newReviewData) {
    const response = await fetch("http://localhost:3005/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReviewData)
    })
    return response.json()
}

async function putReview(updatedReview) {
    await fetch("http://localhost:3005/reviews/" + updatedReview.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview)
    })
}

async function deleteReview(idToDelete) {
    await fetch("http://localhost:3005/reviews/" + idToDelete, {
        method: "DELETE"
    })
}

/**** START UP ****/

async function startUp() {
    renderReviewList()
    reviewList = await fetchAllReviews()
    renderReviewList()
}

startUp()