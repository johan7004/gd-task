"use strict";

const urlInputFields = document.querySelectorAll(".url-input");
const batchNameInput = document.querySelector(".batch-name__input");
const linksList = document.querySelector(".links__list");

let validInputValues = []; // inital state
const totalStoredLinks = [];

function loadStoredLinks() {
  const storedLinks = JSON.parse(localStorage.getItem("links"));
  if (storedLinks && storedLinks.length) {
    validInputValues = [...storedLinks];

    storedLinks.forEach((links) => {
      const testBatchName = links.batchName;
      const batchNameTitle = document.createElement("h3");
      const storedLinksList = document.createElement("ul");
      storedLinksList.className = "stored-links";
      batchNameTitle.innerText = `Test Batch Name : ${testBatchName}`;
      batchNameTitle.className = "batch-name__title";
      linksList.appendChild(batchNameTitle);
      linksList.appendChild(storedLinksList);

      links.testLinks.forEach((testLink) => {
        const testLinksListElement = document.createElement("li");
        const testLinksUrl = document.createElement("a");
        testLinksUrl.innerText = testLink;
        testLinksUrl.className = "test__links";
        testLinksUrl.href = testLink;
        testLinksListElement.appendChild(testLinksUrl);
        storedLinksList.appendChild(testLinksListElement);
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

function formValidation(button_id) {
  if (batchNameInput.value) {
    const inputValues = [];
    urlInputFields.forEach((elem, index) => {
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
