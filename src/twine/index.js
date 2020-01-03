import Story from "./Story";

(win => {
  if (typeof win !== "undefined") {
    win.document.addEventListener("DOMContentLoaded", function(event) {
      win.globalEval = eval;
      win.story = new Story(win);
      win.story.start();
      if (win.document.querySelector("#show_directives").checked) {
        win.document.body.classList.add("show-directives");
      }
      if (win.document.querySelector("#proofing").checked) {
        win.document.body.classList.add("proof");
      } else {
        win.document.body.classList.add("run");
      }
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

    win.document.querySelector("#proofing").addEventListener("change", e => {
      if (e.target.checked) {
        win.document.body.classList.add("proof");
        win.document.body.classList.remove("run");
      } else {
        win.document.body.classList.add("run");
        win.document.body.classList.remove("proof");
      }
    });

    document
      .querySelector(
        "tw-passagedata[pid='" +
          document.querySelector("tw-storydata").getAttribute("startnode") +
          "']"
      )
      .classList.add("start");
  }
})(window || undefined);
