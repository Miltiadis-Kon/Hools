function addElement() {
  const div = document.createElement("div");
  div.innerHTML = "<button> click </button>";
  document.body.appendChild(div);
}

document.body.onload = addElement;
