function listenForClick() {
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn")) {
          input = document.querySelector('#input')
          browser.runtime.sendMessage({'value': input.value})
          window.close();
        }
      });
}
listenForClick();