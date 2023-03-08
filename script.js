"use strict";

const urlInputFields = document.querySelectorAll(".url-input");
const batchNameInput = document.querySelector(".batch-name__input");
const linksList = document.querySelector(".links__list");

let validInputValues = []; // inital state
const totalStoredLinks = [];

function addUrlToBatch(testBatchList, testBatchKey) {
  const modalToggle = document.querySelector(".modal__input");
  modalToggle.style.display = "block";
  const newUrlButton = document.querySelector("#new-url-button");
  const newUrlInput = document.querySelector("#new-url");
  newUrlButton.addEventListener("click", () => {
    if (newUrlInput.value) {
      testBatchList[testBatchKey].testLinks.push(newUrlInput.value);
      console.log(`newUrlInput.value`);
      console.log(newUrlInput.value);
      console.log(`newUrlInput.value`);
      console.log(testBatchList);
      localStorage.setItem("links", JSON.stringify(testBatchList));
      modalToggle.style.display = "none";
      location.reload();
    }
  });
}

function removeUrlFromBatch(testBatchList, batchKey, linkKey) {
  console.log(`remove url from batch ${batchKey} and link number ${linkKey}`);
  console.log(`from remove function`);
  console.log(testBatchList[batchKey].testLinks.splice(linkKey, 1));
  console.log(testBatchList);
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
  console.log(`adding url Inputs`);
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
          console.log(button_id);
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
          console.log(`firefox event`);
          console.log("Loading links in Firefox");
          console.log("Loading links in Firefox");
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
