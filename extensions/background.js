const baseURL = "http://localhost:4000";

async function getPhonenumber(uid) {
  const result = await fetch(
    `${baseURL}/convert/get-phone-from-uid?uid=${uid}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(() => {
      return { error: true };
    });
  return result;
}

chrome.runtime.onMessageExternal.addListener(function (
  message,
  sender,
  sendResponse
) {
  console.log(message);
  switch (message.type) {
    case "getNumber":
      sendResponse(JSON.stringify({ error: true, message: "dauboi" }));
      console.log("handle mmessage");
      //  getPhonenumber(message.data).then((res) => sendResponse(res));
      break;

    default:
      console.log("say whattt ??  !!! ");
      break;
  }
  return;
});

chrome.commands.onCommand.addListener(function (command) {
  console.log({ command });
  if (command === "showBtn") {
    chrome.tabs.query({ active: true }, (tab) => {
      chrome.tabs.executeScript(tab.id, {
        file: "./script.js",
      });
      chrome.tabs.insertCSS (tab.id, {
        file: `./custom.css`,
      });
    });
  }
});
