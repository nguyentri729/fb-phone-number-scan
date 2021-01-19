alert("Đã bật tiện ích tìm số điện thoại")
async function getUidFromURL(profileURL) {
  const response = await fetch(profileURL, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: "https://www.facebook.com",
    referrerPolicy: "strict-origin-when-cross-origin",
    method: "GET",
    mode: "cors",
    credentials: "include",
  }).then((res) => res.text());

  const regex = /"userID":"([\d]*)"/gm;
  let m;
  regex.lastIndex++;
  m = regex.exec(response);
  return m[1];
}

async function findPhoneNumber(uid) {
  console.log("hihihi", uid);
  const phone = await fetch(
    "http://localhost:4000/getPhoneFromUid?uid=" + uid,
    {
      headers: {
        Authorization: "Bearer " + "sadfasdfasdf",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => res.json())
    .catch((err) => err);
  return phone;
}
async function findNumber(profileURL) {
  const uid = await getUidFromURL(profileURL);
  const phoneNumbers = await findPhoneNumber(uid);
  console.log({ phoneNumbers });
}
function createBtnFindPhone(uid) {
  const btnFindPhonenumber = document.createElement("button");
  btnFindPhonenumber.className = "btn-find-phone";
  btnFindPhonenumber.innerText = "☎ Tìm số";
  btnFindPhonenumber.setAttribute("uid", uid);
  btnFindPhonenumber.onclick = function () {
    findNumber(uid);
  };
  return btnFindPhonenumber;
}

function addFindButtonToComment(node) {
  const nodeComment = node.querySelector(`div[role="article"]`);
  const nodeLinks = node.querySelectorAll('a[role="link"]');
  if (
    nodeLinks.length > 1 &&
    !nodeComment.querySelector(`button.btn-find-phone`)
  ) {
    const btnFindPhone = createBtnFindPhone(nodeLinks[1].href);
    nodeComment.appendChild(btnFindPhone);
  }
}
let targetNode = document.querySelector('div[role="feed"]');
let config = { subtree: true, childList: true, attributes: true };
let callback = function (mutationsList, observer) {
  try {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        switch (node.nodeName) {
          case "DIV":
            const dataPagelet = node.getAttributeNode("data-pagelet");
            const linkUser = node.querySelector("a");
            const nodeParentButton = linkUser.parentNode.parentNode.parentNode;
            if (
              dataPagelet &&
              !nodeParentButton.querySelector(`button.btn-find-phone`)
            ) {
              const btnFindPhone = createBtnFindPhone(linkUser.href);
              nodeParentButton.appendChild(btnFindPhone);
            }

            break;
          case "LI":
            addFindButtonToComment(node);

            break;
          case "UL":
            addFindButtonToComment(node.querySelectorAll("li"));
            break;
          default:
            console.log(node);
        }

        const nodeComments = mutation.target.querySelectorAll("li");
        nodeComments.forEach((nodeComment) => {
          addFindButtonToComment(nodeComment);
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

let observerFeedChange = new MutationObserver(callback);

observerFeedChange.observe(targetNode, config);

// let observerPageChange = new MutationObserver(callback);

// observerPageChange.observe(document.querySelector(`div[data-pagelet="page"]`), config);
