import Story from "./Story";

(win => {
  if (typeof win !== "undefined") {
    win.document.addEventListener("DOMContentLoaded", function(event) {
      win.globalEval = eval;
      win.story = new Story(win);
      if (win.document.querySelector("#show_directives").checked) {
        win.document.body.classList.add("show-directives");
      }
      win.story.start();
    });

    win.document
      .querySelector("#show_directives")
      .addEventListener("change", e => {
        if (e.target.checked) {
          win.document.body.classList.add("show-directives");
        } else {
          win.document.body.classList.remove("show-directives");
        }
      });
  }
})(window || undefined);
