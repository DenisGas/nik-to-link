const NIK_INPUT = document.getElementById("nik-textarea");
const LINK_OUTPUT = document.getElementById("link-text");
const GET_LINK_BUTTON = document.getElementById("get-link-button");
const COPY_BTN = document.getElementById("link-copy-btn");
const CLEAR_BTN = document.getElementById("clear-btn");

const TextAreaNikContent = localStorage.getItem('TextAreaNik');
if (TextAreaNikContent !== null) {
  NIK_INPUT.value = TextAreaNikContent;
}

GET_LINK_BUTTON.addEventListener("click", (event) => {
  if (NIK_INPUT.value !== "") {
    if (NIK_INPUT.classList.contains("error")) {
      NIK_INPUT.classList.remove("error")
    }
    callGetLinkFunc();
  } else {
    NIK_INPUT.classList.add("error")
  }
});

CLEAR_BTN.addEventListener("click", (event) => {
  NIK_INPUT.value = '';
  LINK_OUTPUT.innerText = '';
  localStorage.setItem('TextAreaNik', '');
  
});


NIK_INPUT.addEventListener("input", (e) => {
  callGetLinkFunc();
});

function showMessage(messageText) {
  const messageContainer = document.getElementById('message-container');
  messageContainer.textContent = messageText;
  messageContainer.classList.add("smooth-appearance");
  setTimeout(function () {
    messageContainer.classList.remove("smooth-appearance");
  }, 1000);
}

const radios = document.getElementsByName("typesLink");
radios.forEach(radio => {
  radio.addEventListener("change", callGetLinkFunc);
});
const checkboxes = document.querySelectorAll(".config-box");
checkboxes.forEach(box => {
  box.addEventListener("change", callGetLinkFunc);
});

function getLinkType() {
  const selected = Array.from(radios).find(radio => radio.checked);
  return selected ? selected.value : "instagram"; 
}

function callGetLinkFunc() {
  const text = NIK_INPUT.value;
  const linkType = getLinkType();
  const onlyLinks = getCheckBoxState("without-text");
  const replaceSocialLinks = getCheckBoxState("replace-socials-links");
  const cleanLink = getCheckBoxState("clean-link");
  const link = getLink(text, linkType, onlyLinks, replaceSocialLinks, cleanLink);
  LINK_OUTPUT.innerText = link;
  if (link !== text) {
    localStorage.setItem('TextAreaNik', text);
  }
}



COPY_BTN.addEventListener("click", (event) => {
  copyToClipboard(LINK_OUTPUT.innerText)
  event.target.disabled = true;
  setTimeout(function () {
    event.target.disabled = false;
  }, 500);
});


function copyToClipboard(text) {
  if (!text) {
    showMessage('ERROR! No text');
    return;
  }
  navigator.clipboard.writeText(text).then(function () {
    showMessage('Result copied to clipboard');
  }).catch(function (error) {
    showMessage('ERROR');
    console.error('ERROR:', error);
  });
}


function getLinkPath(linkType) {
  switch (linkType) {
    case 'instagram':
    case 'inst':
      return "https://www.instagram.com/";
    case 'telegram':
      return "https://t.me/";
    case 'youtube':
      return "https://www.youtube.com/@";
    case 'tiktok':
      return "http://www.tiktok.com/@";
    default:
      return "ERROR"
  }
}

function getLink(text, linkType = "instagram", onlyLinks = false, replaceSocialLinks = false, cleanLink = false,
  delimiter = "") {

  const linkPath = getLinkPath(linkType);

  if (linkPath === "ERROR") {
    return linkPath;
  }

  const platformPattern = /(youtube|Telegram|inst|Instagram|TikTok):\s+@([\w.'\-_!#^~]+)/gi;
  const usernamePattern = /(?<!\/)@([\w.'\-_!#^~]+)/g;

  let modifiedString = text
    .replace(platformPattern, (match, platform, username) => {
      return `${platform}: ${getLinkPath(platform.toLowerCase())}${username}  `
    })
    .replace(usernamePattern, match => {
      const username = match.slice(1);
      return `${delimiter}${linkPath}${username} `;
    });

  if (cleanLink || replaceSocialLinks) {
    const cleanLinkPattern = /\?.*/g;
    modifiedString = modifiedString.replace(cleanLinkPattern, " ");
  }

  if (onlyLinks) {
    const onlyLinksPattern = /(https?:\/\/)(?:www\.)?([^\s]+)/g;
    const matches = modifiedString.match(onlyLinksPattern);
    modifiedString = matches ? matches.join("\n") : "";
  }

  if (replaceSocialLinks) {
    const linkPattern = /(https?:\/\/(?:www\.)?instagram\.com\/|https?:\/\/(?:www\.)?youtube\.com\/@|https?:\/\/(?:www\.)?t\.me\/|http?:\/\/(?:www\.)?tiktok\.com\/@)/g;
    modifiedString = modifiedString.replace(linkPattern, linkPath);
  }

  return modifiedString;
}

function getCheckBoxState(id) {
  const checkbox = document.getElementById(id)
  return checkbox.checked;
}
