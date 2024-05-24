const DrawerInitiator = {
  init({ button, drawer, content }) {
    button.addEventListener("click", (e) => {
      drawer.style.display =
        drawer.style.display === "block" ? "none" : "block";
      if (button.querySelector("i").classList.contains("fa-bars")) {
        button.querySelector("i").classList.replace("fa-bars", "fa-xmark");
      } else {
        button.querySelector("i").classList.replace("fa-xmark", "fa-bars");
      }
      e.stopPropagation();
    });

    content.addEventListener("click", (e) => {
      if (drawer.style.display === "block") {
        drawer.style.display = "none";
        if (button.querySelector("i").classList.contains("fa-xmark")) {
          button.querySelector("i").classList.replace("fa-xmark", "fa-bars");
        }
      }
    });
  },
};

export default DrawerInitiator;
