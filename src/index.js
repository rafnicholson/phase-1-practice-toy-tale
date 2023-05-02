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

  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    createNewToy(event.target);
    toyForm.reset();
  })

  fetchToys();
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach((toy) => {
        createToyCard(toy);
      });
    });
}

function createToyCard(toy) {
  const toyCollection = document.getElementById('toy-collection');
  const card = document.createElement('div');
  card.classList.add('card');

  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;

  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.classList.add('toy-avatar');

  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} Likes`;

  const likeButton = document.createElement('button');
  likeButton.classList.add('like-btn');
  likeButton.setAttribute('id', toy.id);
  likeButton.textContent = "Like ❤️";
  likeButton.addEventListener('click', () => {
    increaseLikes(toy);
  })

  card.appendChild(toyName);
  card.appendChild(toyImage);
  card.appendChild(toyLikes);
  card.appendChild(likeButton);

  toyCollection.appendChild(card);
}

function createNewToy(form) {
  const toyName  = form.name.value;
  const toyImage = form.image.value;

  const toyData = {
    name: toyName,
    image: toyImage,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body:  JSON.stringify(toyData)
  })
    .then((res) => res.json())
    .then((newToy) => {
      createToyCard(newToy);
    });
}

function increaseLikes(toy) {
  const newNumberOfLikes = ++toy.likes;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body:  JSON.stringify({
      likes: newNumberOfLikes,
    }),
  })
    .then((res) => res.json())
    .then((updatedToy) => {
      const toyCard = document.getElementById(updatedToy.id).parentNode;
      const likesElement = toyCard.querySelector('p');
      likesElement.textContent = `${updatedToy.likes} Likes`;
    });
}