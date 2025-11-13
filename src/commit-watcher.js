// TODO: remove before release
export function watchLatestCommit() {
  if (isLocalEnvironment()) {
    return;
  }

  const url = "commit.json";
  let current;

  function watch() {
    fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(json => {
        if (json === undefined) {
          return;
        }
        current = current ?? json.sha;
        if (current === json.sha) {
          return;
        }

        Modal.message.show(
          "Your game will be saved and the page will refresh to add this new content: " +
          `"${json.message}" by ${json.author}`,
          {
            callback: updateRefresh,
            closeButton: true
          },
          3
        );
      });
  }

  setInterval(watch, 60000);
}
