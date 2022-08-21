let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

const toyUrl = "http://localhost:3000/toys"
const toyDiv = document.querySelector("#toy-collection")
const form = document.querySelector("body > div.container > form")

//event listeners
form.addEventListener('submit', toySubmit)
document.addEventListener('click', likeListener)


//Function for rendering toys in database

function fetchToys() {
  return (fetch(toyUrl)
    .then((resp) => resp.json())
    .then((data) => toyHandler(data))
    .catch(function() {
      console.log("error")
    })
  );
}

function toyHandler(toys) {
  let toyName = createDivElement(toys)
  renderToyDiv(toyName)
  return likes = document.querySelector("#like-btn")
}


function createDivElement(toys) {
  console.log("i'm in create div")
  return toys.map((toy) => {
    let i = `<div class ="card">
            <h2>${toy.name}</h2>
            <img src="${toy.image}" class ="toy-avatar" />
            <p>${toy.likes} likes!</p>
            <button class ="like-btn" id="${toy.id}">Like ❤️</button>
            </div>`
    return i
  })
}

function renderToyDiv(toyObj) {
  console.log("i'm in render toy div")
  toyDiv.innerHTML = " "
  toyObj.forEach(element => {
    renderDiv(element)
  })
}

function renderDiv(element) {
  console.log("i'm in renderDiv")
  toyDiv.innerHTML += element;
}


//function for adding objects to the database

function toySubmit(e) {
  e.preventDefault()
  console.log("you submitted!")
  let name = e.target.name.value
  let image = e.target.image.value
  const formData = {
    name: `${name}`,
    image: `${image}`,
    likes: 0,
  }

  //Converts it to JSON here

  const configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(formData),
  };

  console.log(configurationObject)
  postRequest(configurationObject)
}

function postRequest(data) {
  fetch(toyUrl, data)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      fetchToys(data)
    })
    .catch(function() {
      console.log("error")
    })
}

//Function for calculating likes

function likeListener(e) {
  if (e.target.className === "like-btn") {
    console.log("you liked!")
    handleLikes(e)
  }
}

function handleLikes(e) {
  const toyParent = e.target.parentElement
  const toyID = e.target.id
  const toyLikes = parseInt(e.target.parentElement.children[2].innerText.split(" ")[0])
  //Remember to check in the console how deep a e.target can go with each step you add
  //parentElement goes up one layer, children can be specified like an array starting from 0
  //innerText grabs the text inside the HTML element
  //split(" ") finds a pattern using whats in the () and makes an array according to that 
  //ie. makes an array where each piece of data is separated by a space
  // console.log(toyID)
  // console.log(toyParent)
  // console.log(toyLikes)

  let likesObj = {
    likes: toyLikes + 1
  }

  const reqObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(likesObj)
  }

  fetch(toyUrl + `/${toyID}`, reqObj)
    .then(function (resp) {
      return resp.json()
    })
    .then(function (data) {
      console.log(data)
      fetchToys()
    })
    .catch(function() {
      console.log("error")
    })

}

//Default function callouts

fetchToys()

