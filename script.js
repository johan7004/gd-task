"use strict";

const urlInputFields = document.querySelectorAll(".url-input");
const baetchNameInput = document.querySelector(".batch-name__input");
const linksList = document.querySelector(".links__list");
const cacheDisableBtn = document.querySelector("#disable-cache");
const headTag = document.getElementsByTagName("head")[0];
const cacheDisableText = document.querySelector(".cache-disable");
const oneTrustBtn = document.getElementById("control-onetrust");
const oneTrustContainer = document.getElementById("onetrust-consent-sdk");
const oneTrustBannerText = document.getElementById("onetrust-banner-state");
let validInputValues = []; // inital state
const totalStoredLinks = [];

document.addEventListener("DOMContentLoaded", function (event) {
  const oneTrustState = sessionStorage.getItem("oneTrustBanner");
  switch (oneTrustState) {
    case "true":
      const scripts = document.getElementsByTagName("script");
      oneTrustBtn.innerText = "Enable OneTrust Banner";
      oneTrustBannerText.style.display = "block";
      if (oneTrustContainer) oneTrustContainer.style.display = "none";
      document.head.insertAdjacentHTML(
        "beforeend",
        `<style>.onetrust-consent-sdk{display:none;visibility:hidden;}</style>`
      );
      for (let elem of scripts) {
        if (elem.src.includes("onetrust")) {
          elem.remove();
        }
      }
      break;
    case "false":
      oneTrustBtn.innerText = "Disable OneTrust Banner";
      oneTrustBannerText.style.display = "none";
    default:
      console.log(`one trustF`);
  }
});

function createCacheMetaTag() {
  const metaTag = document.createElement("meta");
  sessionStorage.setItem("cacheDisable", true);
  metaTag.setAttribute("id", "cache-control");
  metaTag.setAttribute("http-equiv", "Cache-Control");
  metaTag.setAttribute("content", "no-cache, no-store, must-revalidate");
  headTag.appendChild(metaTag);
}

function checkCachingState() {
  const cacheState = sessionStorage.getItem("cacheDisable");

  switch (cacheState) {
    case undefined:
    case null:
      sessionStorage.setItem("cacheDisable", false);
      break;
    case "true":
      sessionStorage.setItem("cacheDisable", cacheState);
      cacheDisableBtn.innerText = "Enable Cache";
      cacheDisableText.style.display = "block";
      createCacheMetaTag();

      break;
    case "true":
      sessionStorage.setItem("cacheDisable", false);
      break;
    default:
      console.log(`default ${cacheState}`);
      break;
  }
}
checkCachingState();

function toggleCaching() {
  const cacheDisableState = sessionStorage.getItem("cacheDisable");

  if (cacheDisableState === "false") {
    cacheDisableBtn.innerText = "Enable Cache";
    cacheDisableText.style.display = "block";
    createCacheMetaTag();
  } else {
    const cacheMetaTag = document.getElementById("cache-control");
    sessionStorage.setItem("cacheDisable", false);
    if (cacheMetaTag) {
      cacheMetaTag.remove();
      console.log(`meta tag removed`);
    }
    cacheDisableBtn.innerText = "Disable Cache";
    cacheDisableText.style.display = "none";
  }
}

function deleteCache() {
  window.location.reload(true);
}

function toggleOneTrust() {
  const oneTrustState = sessionStorage.getItem("oneTrustBanner");
  switch (oneTrustState) {
    case "false":
      sessionStorage.setItem("oneTrustBanner", true);
      oneTrustBtn ? (oneTrustBtn.innerText = "Enable OneTrust Banner") : "";
      oneTrustContainer ? (oneTrustContainer.style.display = "none") : "";
      oneTrustBannerText.style.display = "block";
      break;
    case "true":
      sessionStorage.setItem("oneTrustBanner", false);
      oneTrustBtn.innerText = "Disable OneTrust Banner";
      oneTrustContainer ? (oneTrustContainer.style.display = "block") : "";
      oneTrustBannerText ? (oneTrustBannerText.style.display = "none") : "";

      break;
    default:
      console.log(oneTrustState);
      break;
  }
}

function addUrlToBatch(testBatchList, testBatchKey) {
  const modalToggle = document.querySelector(".modal__input");
  modalToggle.style.display = "block";
  const newUrlButton = document.querySelector("#new-url-button");
  const newUrlInput = document.querySelector("#new-url");
  newUrlButton.addEventListener("click", () => {
    if (newUrlInput.value) {
      testBatchList[testBatchKey].testLinks.push(newUrlInput.value);
      localStorage.setItem("links", JSON.stringify(testBatchList));
      modalToggle.style.display = "none";
      location.reload();
    }
  });
}

function removeUrlFromBatch(testBatchList, batchKey, linkKey) {
  testBatchList[batchKey].testLinks.splice(linkKey, 1);

  localStorage.setItem("links", JSON.stringify(testBatchList));
  location.reload();
}

function loadStoredLinks() {
  const storedLinks = JSON.parse(localStorage.getItem("links"));
  if (storedLinks && storedLinks.length) {
    validInputValues = [...storedLinks];

    storedLinks.forEach((links, testBatchKey) => {
      const testBatchName = links.batchName;
      const batchNameTitle = document.createElement("h3");
      const storedLinksList = document.createElement("ul");
      const addUrlToBatchBtn = document.createElement("button");
      addUrlToBatchBtn.className = "add__input";
      addUrlToBatchBtn.innerText = "+";
      addUrlToBatchBtn.onclick = () => addUrlToBatch(storedLinks, testBatchKey);
      storedLinksList.className = "stored-links";
      batchNameTitle.innerText = `Test Batch Name : ${testBatchName}`;
      batchNameTitle.className = "batch-name__title";
      linksList.appendChild(batchNameTitle);
      linksList.appendChild(storedLinksList);
      linksList.appendChild(addUrlToBatchBtn);

      links.testLinks.forEach((testLink, testLinkkey) => {
        const testLinksListElement = document.createElement("li");
        const testLinksUrl = document.createElement("a");
        const urlDeleteButton = document.createElement("span");
        testLinksUrl.innerText = testLink;
        testLinksUrl.className = "test__links";
        urlDeleteButton.innerHTML = "&times;";
        urlDeleteButton.onclick = () =>
          removeUrlFromBatch(storedLinks, testBatchKey, testLinkkey);
        testLinksUrl.href = testLink;
        testLinksListElement.appendChild(testLinksUrl);
        storedLinksList.appendChild(testLinksListElement);
        testLinksListElement.appendChild(urlDeleteButton);
        totalStoredLinks.push(testLink);
      });
    });
  } else {
    const batchNameTitle = document.createElement("h3");
    batchNameTitle.innerText = "No Test Batches Stored Yet";
    batchNameTitle.className = "batch-name__title";
    linksList.appendChild(batchNameTitle);
  }
}

loadStoredLinks();

function storeValidLinks(validLinks) {
  localStorage.setItem("links", JSON.stringify(validLinks));

  return;
}

function addUrlInput() {
  const inputFieldcContainer = document.querySelector(".form__container");
  const inputFieldsUpdate = document.querySelectorAll(".url-input");

  const newInputField = document.createElement("input");
  newInputField.className = "form__input url-input";
  newInputField.id = `url-${inputFieldsUpdate.length + 1}`;
  inputFieldcContainer.appendChild(newInputField);
}

function formValidation(button_id) {
  if (batchNameInput.value) {
    const inputValues = [];
    const updatedInputField = document.querySelectorAll(".url-input");
    updatedInputField.forEach((elem, index) => {
      if (elem.value) {
        if (elem.value.includes(`https`)) {
          inputValues.push(elem.value);
          return;
        } else {
          alert(`invalid url in input field : ${index + 1} `);
        }
      }
    });
    if (inputValues.length) {
      validInputValues = [
        ...validInputValues,
        { batchName: `${batchNameInput.value}`, testLinks: inputValues },
      ];
      switch (button_id) {
        case "store-links-button":
          storeValidLinks(validInputValues);
          alert(`Links Stored Successfully`);
          window.location.reload();
          loadStoredLinks();
          break;
        case "load-links-button":
          if (inputValues.length) {
            inputValues.forEach((value) => window.open(value, "_blank"));
          }
          break;
        case "load-links-firefox":
          try {
            inputValues.forEach((value) => {
              const firefoxURL = `firefox:${value}`;
              window.open(firefoxURL, "_blank");
            });
          } catch (error) {
            document.querySelector(".error-message").innerText = error.message;
          }
          break;
        case "load-links-edge":
          const microsoftEdge = "microsoft-edge:";
          try {
            inputValues.forEach((value) =>
              window.open(`${microsoftEdge + value}`, "_blank")
            );
          } catch (error) {
            document.querySelector(".error-message").innerText = error.message;
          }
          break;
        default:
          console.log("Unknown button_id");
          break;
      }
    }
  } else {
    alert("Enter a valid Batch Name");
  }
}

function loadAllStoredTestLinks() {
  totalStoredLinks.forEach((storedLink) => window.open(storedLink, "_blank"));
}
