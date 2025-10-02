const input = document.getElementById("input");
const add = document.getElementById("add");
const tasklist = document.querySelector(".tasklist");

add.addEventListener("click", () => {
  const inputValue = input.value.trim();
  console.log(inputValue);

  if (inputValue) {
    const li = document.createElement("li");
    li.textContent = inputValue;

    tasklist.appendChild(li);
    input.value = "";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.textContent = "x";

    li.appendChild(deleteBtn);
    deleteBtn.addEventListener("click", () => {
      li.remove();
    });

    input.value = "";
  }
});
