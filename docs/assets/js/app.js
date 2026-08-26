// Default playback volume for the replay clips (viewers can still adjust
// with the player's own volume slider). 1.0 = 100%.
(function () {
  var DEFAULT_VOLUME = 0.4;
  var videos = document.querySelectorAll(".stage-video");
  for (var i = 0; i < videos.length; i++) {
    videos[i].volume = DEFAULT_VOLUME;
  }
})();

// Arrow-key navigation across the roster grid, character-select style.
(function () {
  var roster = document.getElementById("roster");
  if (!roster) return;
  var tiles = Array.prototype.slice.call(roster.querySelectorAll(".tile"));
  if (!tiles.length) return;

  function columns() {
    var style = getComputedStyle(roster);
    return style.gridTemplateColumns.split(" ").length;
  }

  roster.addEventListener("keydown", function (e) {
    var active = document.activeElement;
    var idx = tiles.indexOf(active);
    if (idx === -1) return;
    var cols = columns();
    var next = -1;
    if (e.key === "ArrowRight") next = idx + 1;
    else if (e.key === "ArrowLeft") next = idx - 1;
    else if (e.key === "ArrowDown") next = idx + cols;
    else if (e.key === "ArrowUp") next = idx - cols;
    if (next >= 0 && next < tiles.length) {
      e.preventDefault();
      tiles[next].focus();
    }
  });
})();
