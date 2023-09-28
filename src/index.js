document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  let toys = [];

  // Challenge 1: Fetch Andy's Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((data) => {
        toys = data;
        renderToys();
      });
  }

  // Challenge 2: Add Toy Info to the Card
  function renderToys() {
    toyCollection.innerHTML = "";
    toys.forEach((toy) => {
      const card = document.createElement("div");
      card.className = "card";

      const h2 = document.createElement("h2");
      h2.textContent = toy.name;

      const img = document.createElement("img");
      img.src = toy.image;
      img.className = "toy-avatar";

      const p = document.createElement("p");
      p.textContent = `${toy.likes} Likes`;

      const likeBtn = document.createElement("button");
      likeBtn.className = "like-btn";
      likeBtn.textContent = "Like ❤️";
      likeBtn.dataset.id = toy.id;
      likeBtn.addEventListener("click", likeToy);

      card.appendChild(h2);
      card.appendChild(img);
      card.appendChild(p);
      card.appendChild(likeBtn);

      toyCollection.appendChild(card);
    });
  }

  // Challenge 3: Add a New Toy
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((data) => {
        toys.push(data);
        renderToys();
        toyForm.reset();
        toyFormContainer.style.display = "none";
      });
  });

  // Challenge 4: Increase a Toy's Likes
  function likeToy(e) {
    const toyId = e.target.dataset.id;
    const toy = toys.find((t) => t.id == toyId);
    toy.likes++;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: toy.likes }),
    })
      .then((response) => response.json())
      .then(() => {
        renderToys();
      });
  }

  // Show or hide the form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Initial fetch of toys
  fetchToys();
});
