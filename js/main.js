const NIK_INPUT = document.getElementById("nik-textarea");
const LINK_OUTPUT = document.getElementById("link-textarea");
const GET_LINK_BUTTON = document.getElementById("get-link-button");
const COPY_BTN = document.getElementById("link-copy-btn")


const TextAreaNikContent = localStorage.getItem('TextAreaNik');
if (TextAreaNikContent !== null) {
  NIK_INPUT.value = TextAreaNikContent;
};


function showMessage(text) {
  // Находим элемент контейнера сообщения
  const messageContainer = document.getElementById('message-container');

  // Показываем сообщение, установив его стиль display в 'block'
  messageContainer.style.display = 'block';

  const messageText = text;

  // Устанавливаем текст сообщения внутри контейнера
  messageContainer.textContent = messageText;

  // Через некоторое время (например, 3 секунды) скрываем сообщение
  setTimeout(function () {
    messageContainer.style.display = 'none';
  }, 1000); // 3000 миллисекунд (3 секунды)
}



function getLinkType() {
  const radios = document.getElementsByName("typesLink");
  const selected = Array.from(radios).find(radio => radio.checked);
  return selected.value
}

GET_LINK_BUTTON.addEventListener("click", (event) => {
  if (NIK_INPUT.value !== "") {
    if (NIK_INPUT.classList.contains("error")) {
      NIK_INPUT.classList.remove("error")
    }
    const text = NIK_INPUT.value;

    localStorage.setItem('TextAreaNik', text);

    const linkType = getLinkType()

    const onlyLinks = getCheckBoxState("without-text")

    const link = getLink(text, linkType, onlyLinks);

    LINK_OUTPUT.value = link;

    return true

  }

  NIK_INPUT.classList.add("error")

});


COPY_BTN.addEventListener("click", () => {
  const result = LINK_OUTPUT.value;

  navigator.clipboard.writeText(result).then(function () {
    showMessage('Результат скопирован в буфер обмена');
  }).catch(function (error) {
    showMessage('Не удалось скопировать результат в буфер обмена');
    console.error('Не удалось скопировать результат в буфер обмена:', error);
  });
});


function getLinkPath(linkType) {
  switch (linkType) {
    case 'instagram':
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



function getLink(text, linkType = "instagram", onlyLinks = false,
  delimiter = "") {

  const linkPath = getLinkPath(linkType);

  if (linkPath === "ERROR") {
    return linkPath;
  }

  let link = ""
  const modifiedString = text.replace(/@[^\s]+/g, match => {
    const username = match.slice(1);
    link += `${linkPath}${username}\n`;
    return `${delimiter}${linkPath}${username}`;
  });
  if (!onlyLinks) {
    return modifiedString;
  }
  return link;
}

function getCheckBoxState(id) {
  const checkbox = document.getElementById(id)
  if (checkbox.checked) {
    return true
  }
  return false
}