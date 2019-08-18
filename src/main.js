import Story from "./twine/Story";

(win => {
  if (typeof win !== "undefined") {
    win.document.addEventListener("DOMContentLoaded", function(event) {
      window.story = new Story(win);
      window.story.start();
    });
  }
})(window || undefined);
