function makeActive() {
    elem = document.getElementsByClassName("active");
    elem[0].classList.remove("active");
    this.classList.add("active");
}