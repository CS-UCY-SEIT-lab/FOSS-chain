import { ethers } from "https://cdn.skypack.dev/ethers@5.7.2";

const LICENSE_MANAGER_ADDRESS = "0x413d5282A61AC9fDc2b6C715DDE857908A22AEbf";
const DOWNLOAD_AGREEMENT_ADDRESS = "0xecB86E40c9A84666F1BeeAA0001844908EB9bc79";
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = provider.getSigner();
let LICENSE_MANAGER_ABI, DOWNLOAD_AGREEMENT_ABI;
//to initialize our contracts

async function initializeContracts() {
  LICENSE_MANAGER_ABI = await fetch("/ade/LicenseManagerABI.json").then((res) =>
    res.json()
  );
  DOWNLOAD_AGREEMENT_ABI = await fetch("/ade/DownloadAgreementABI.json").then(
    (res) => res.json()
  );
  console.log("ABI load correctly done");
}

initializeContracts().then(() => {
  loadSoftwareProjects(true);
}); //after initialization of contracts load the projects in web page

initializeContracts(); //done

function getContract(address, abi, useSigner = false) {
  return new ethers.Contract(address, abi, useSigner ? signer : provider);
}

let currentScreenId = "browseProjects"; //start with this main screen!
loadSoftwareProjects(true);

function loadSoftwareProjects(loadAll) {
  const url = loadAll
    ? "/ade/PHP/get_all_software.php"
    : "/ade/PHP/get_user_software.php";
  //we want to fetch everything
  fetch(url)
    .then((response) => response.json())
    .then((softwareList) => {
      var projectsSection = document.getElementById(
        currentScreenId === "browseProjects"
          ? "projectsSection"
          : "myProjectsSection"
      );
      projectsSection.innerHTML = "";

      softwareList.forEach((software) => {
        var projectElement = document.createElement("div");
        projectElement.className = "project";
        projectElement.innerHTML = `
  <strong>${software.project_name}</strong><br>
  <span class="project-label">ID: ${software.project_id}</span>
  <span class="license-label">License: ${software.license_type}</span>
`;

        projectElement.addEventListener("click", function () {
          openProjectDetails(
            software.project_id,
            software.project_name,
            software.project_description,
            software.license_type,
            currentScreenId
          );
        });

        projectsSection.appendChild(projectElement);
      });
    })
    .catch((error) => console.error("Error:", error));
}

async function displayWalletInfo() {
  const walletAddressDisplay = document.getElementById("walletAddress");
  const walletBalanceDisplay = document.getElementById("walletBalance");

  try {
    const response = await fetch("/ade/PHP/get_wallet_info.php");
    const data = await response.json();

    if (data.success) {
      const walletAddress = data.wallet_address;
      walletAddressDisplay.textContent = walletAddress;

      const provider = new ethers.providers.JsonRpcProvider(
        "http://localhost:8545"
      ); //repeat this because of error
      const balance = await provider.getBalance(walletAddress);

      walletBalanceDisplay.textContent =
        ethers.utils.formatEther(balance) + " ETH"; //use function formatEther for right decimal
    } else {
      walletAddressDisplay.textContent = "Wallet not found";
      walletBalanceDisplay.textContent = "0 ETH";
      console.error("Could not get account balance.");
    }
  } catch (error) {
    console.error("Error", error);
  }
}

displayWalletInfo();

async function hashContent(content) {
  if (!content || content.trim() === "") {
    //trim content we dont care about whitespaces
    console.error("Content of file is empty");
    return null;
  }

  const encoder = new TextEncoder(); //to get bytes from string
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data); //hash them
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0")) //turn byte hash into 2digit hexa string
    .join("");
}

async function extractFunctions(content, fileType) {
  const functions = {};
  let regex;

  if (fileType === "c") {
    // C function regex
    regex =
      /(?:function|void|int|char|float|double)\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\}/g;
  } else if (fileType === "py") {
    // Python function regex
    regex = /^\s*def\s+(\w+)\s*\(.*?\)\s*:\s*((?:\n\s+.*)+)/gm;
  } else if (fileType === "java") {
    // Java function regex
    regex =
      /(?:(?:public|protected|private|static|final|native|synchronized|abstract|threadsafe|transient)\s+)*[\w\<\>\[\]]+\s+(\w+)\s*\([^\)]*\)\s*\{([\s\S]*?)\}/g;
  } else {
    console.warn(`Unsupported file type: ${fileType}`);
    return functions;
  }

  console.log("Extracting functions from file content...");

  let match;
  while ((match = regex.exec(content)) !== null) {
    const functionName = match[1];
    const functionBody = match[2];

    console.log(`FNAME: ${functionName}`);
    console.log("FBODY:\n", functionBody);

    const functionHash = await hashContent(functionBody.trim());
    console.log(`Hash for ${functionName}:`, functionHash);

    functions[functionName] = functionHash;
  }

  return functions;
}

async function checkLicenseCompliance(
  walletAddress,
  functionHashes,
  licenseType
) {
  console.log("License Compliance");

  const downloadAgreementContract = getContract(
    DOWNLOAD_AGREEMENT_ADDRESS,
    DOWNLOAD_AGREEMENT_ABI.abi
  );

  let downloadedProjects = [];
  console.log("Uploader wallet address:", walletAddress); //remove this

  try {
    for (let projectId = 1; projectId <= 100; projectId++) {
      try {
        const downloads = await downloadAgreementContract.getDownloadsByProject(
          projectId
        ); //get Downloaded projects w/ matching project ID
        downloads.forEach((download) => {
          if (
            download.downloader.toLowerCase() === walletAddress.toLowerCase()
          ) {
            downloadedProjects.push({
              originalProjectId: projectId,
              licenseType: download.licenseType,
              timestamp: download.timestamp.toString(),
            });
          }
        });
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.error("Error fetching downloaded projects:", error);
    return { success: false, message: "Failed to fetch downloads." };
  }

  console.log("Downloaded Projects:", downloadedProjects);

  if (downloadedProjects.length === 0) {
    return {
      success: true,
      message: "No previous downloads. Project can be uploaded.",
    };
  }

  const licenseManagerContract = getContract(
    LICENSE_MANAGER_ADDRESS,
    LICENSE_MANAGER_ABI.abi,
    true
  );

  let matchingProjectId = null;
  let matchingHashes = [];

  for (const download of downloadedProjects) {
    try {
      const downloadedHashes = await licenseManagerContract.getProjectHashes(
        download.originalProjectId
      );
      for (const uploadHash of functionHashes) {
        if (downloadedHashes.includes(uploadHash)) {
          matchingProjectId = download.originalProjectId;
          matchingHashes.push(uploadHash);
        }
      }
    } catch (error) {
      console.error("Error fetching project hashes:", error);
    }
  }

  console.log("Matching Project ID:", matchingProjectId);
  console.log("Matching Hashes:", matchingHashes);

  if (matchingProjectId !== null) {
    const licenseManagerContract = getContract(
      LICENSE_MANAGER_ADDRESS,
      LICENSE_MANAGER_ABI.abi,
      true
    );
    let originalLicenseType;

    try {
      console.log("Fetching project details for ID:", matchingProjectId);

      const projectDetails = await licenseManagerContract.getProjectDetails(
        matchingProjectId
      );

      console.log("Raw Blockchain Response:", projectDetails);

      if (!projectDetails || typeof projectDetails !== "string") {
        console.error("Blockchain did not return a valid license type.");
        return {
          success: false,
          message: "Blockchain did not return a valid license type.",
        };
      }

      originalLicenseType = projectDetails.trim();
      console.log(
        "Retrieved License Type from Blockchain:",
        originalLicenseType
      );
    } catch (error) {
      console.error("Error fetching project details from blockchain:", error);
      return {
        success: false,
        message: "Blockchain query failed.",
      };
    }

    const response = await fetch("/ade/PHP/get_license_compatibility.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalLicense: originalLicenseType,
        uploadedLicense: licenseType,
      }),
    });

    const data = await response.json();
    const compatibleLicenses = data.compatibleLicenses || [];

    console.log("Compatible Licenses from PHP:", compatibleLicenses);
    console.log("Uploaded License:", licenseType);

    if (!compatibleLicenses.includes(licenseType)) {
      const errorMessage = `The uploaded project contains functions from a previously downloaded project (License: ${originalLicenseType}), but your chosen license (${licenseType}) is not compatible.\n\nAllowed Licenses: ${compatibleLicenses.join(
        ", "
      )}`;

      showComplianceModal(errorMessage);
      return { success: false };
    }
  }

  return {
    success: true,
    message: "Project complies and can be uploaded.",
  };
}
function showComplianceModal(message) {
  document.getElementById("complianceErrorMessage").innerText = message;
  document.getElementById("complianceErrorModal").style.display = "block";
}

function closeComplianceModal() {
  document.getElementById("complianceErrorModal").style.display = "none";
}

window.submitProject = async function () {
  const input = document.getElementById("projectFiles");
  const projectName = document.getElementById("projectName").value.trim();
  const projectDescription = document
    .getElementById("projectDescription")
    .value.trim();
  const licenseType = document.getElementById("licenseType").value;

  if (
    !projectName ||
    !projectDescription ||
    !licenseType ||
    input.files.length === 0
  ) {
    alert("Please fill out all required fields before submitting.");
    return;
  }
  const files = Array.from(input.files);
  const formData = new FormData();
  const zip = new JSZip();

  if (files.length === 0) {
    alert("No files selected! Please upload a folder.");
    return;
  }

  let projectFunctionHashes = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = file.webkitRelativePath || file.name;
    const fileExtension = fileName.split(".").pop();

    try {
      const fileContent = await file.text();
      console.log(`Processing File: ${fileName}`);

      const functionHashes = await extractFunctions(fileContent, fileExtension);
      for (const hash of Object.values(functionHashes)) {
        projectFunctionHashes.push(hash);
      }

      const fileArrayBuffer = await file.arrayBuffer();
      zip.file(fileName, fileArrayBuffer);
    } catch (error) {
      console.error(`Error processing file: ${fileName}`, error);
    }
  }

  if (projectFunctionHashes.length === 0) {
    alert("No functions detected in the uploaded files.");
    return;
  }

  const walletAddress = document.getElementById("walletAddress").textContent;
  const parentId = document.getElementById("parentProjectId").value.trim();
  if (parentId) {
    const parentDetails = await fetch(
      `/ade/PHP/get_project_details.php?id=${parentId}`
    );
    const parentData = await parentDetails.json();
    if (parentData.success) {
      const originalLicense = parentData.license_type;
      const uploadedLicense = licenseType;

      const checkResponse = await fetch(
        "/ade/PHP/get_license_compatibility.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ originalLicense, uploadedLicense }),
        }
      );
      const result = await checkResponse.json();

      const compatibleLicenses = result.compatibleLicenses || [];
      if (!compatibleLicenses.includes(uploadedLicense)) {
        const errorMessage = `This project is marked as derived from Project ID:
        ${parentId} (License: ${originalLicense}), but your selected license (${uploadedLicense}) is not compatible.
        Allowed Licenses: ${compatibleLicenses.join(", ")}`;
        showComplianceModal(errorMessage);
        return;
      }
    } else {
      alert("Failed to fetch parent project license.");
      return;
    }
  }

  console.log("Checking License Compliance Before Upload...");
  const complianceResult = await checkLicenseCompliance(
    walletAddress,
    projectFunctionHashes,
    licenseType
  );

  if (!complianceResult.success) {
    console.error("License Compliance Failed:", complianceResult.message);
    return;
  }

  console.log("License Compliance Passed. Proceeding with Upload...");

  try {
    const zipContent = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
    });

    const zipBlob = new Blob([zipContent], { type: "application/zip" });
    formData.append("projectFiles", zipBlob, "project.zip");
    formData.append(
      "projectName",
      document.getElementById("projectName").value
    );
    formData.append(
      "projectDescription",
      document.getElementById("projectDescription").value
    );
    formData.append("walletAddress", walletAddress);
    formData.append("licenseType", licenseType);
    formData.append(
      "parentProjectId",
      document.getElementById("parentProjectId").value || ""
    );

    console.log("Sending project data to PHP");
    const projectResponse = await fetch("/ade/PHP/add_software.php", {
      method: "POST",
      body: formData,
    });

    const projectData = await projectResponse.json();
    console.log("Project Insert Response:", projectData);

    if (!projectData.success) {
      console.error("Error adding project:", projectData.error);
      alert("Error adding project: " + projectData.error);
      return;
    }

    const projectId = projectData.project_id;
    console.log("Project ID received:", projectId);

    const contract = getContract(
      LICENSE_MANAGER_ADDRESS,
      LICENSE_MANAGER_ABI.abi,
      true
    );
    const tx = await contract.uploadProject(
      projectId,
      0,
      document.getElementById("licenseType").value,
      projectFunctionHashes
    );
    await tx.wait();

    console.log("Project upload recorded on blockchain:", tx.hash);

    closeCreateProjectModal();
    openScreen("browseProjects");
    loadSoftwareProjects(true);
  } catch (error) {
    console.error("Error during project and hash submission:", error);
    alert("Failed to upload project.");
  }
};

window.openProjectDetails = async function (projectId, sourceScreenId) {
  console.log("Fetching Project ID:", projectId);

  try {
    const response = await fetch(
      `/ade/PHP/get_project_details.php?id=${projectId}`
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch project details.");
    }

    var modal = document.getElementById("projectDetailsModal");
    var title = document.getElementById("projectDetailsTitle");
    var description = document.getElementById("projectDetailsDescription");
    var projectIdDisplay = document.getElementById("projectDetailsId");
    var licenseDisplay = document.getElementById("projectLicense");
    var parentDisplay = document.getElementById("projectParentId");
    if (!parentDisplay) {
      parentDisplay = document.createElement("p");
      parentDisplay.id = "projectParentId";
      document
        .getElementById("projectDetailsContent")
        .appendChild(parentDisplay);
    }
    parentDisplay.textContent = data.parent_project_id
      ? `Derived from Project ID: ${data.parent_project_id}`
      : `Original Project`;

    var downloadButtonContainer = modal.querySelector(
      ".download-button-container"
    );

    if (
      !modal ||
      !title ||
      !description ||
      !projectIdDisplay ||
      !licenseDisplay
    ) {
      console.error("One or more modal elements are missing in the HTML.");
      alert("Unable to display project details due to a missing element.");
      return;
    }

    if (!downloadButtonContainer) {
      downloadButtonContainer = document.createElement("div");
      downloadButtonContainer.className = "download-button-container";
      modal.appendChild(downloadButtonContainer);
    }

    downloadButtonContainer.innerHTML = "";

    title.textContent = data.project_name || "Unnamed Project";
    description.textContent =
      data.project_description || "No description available";
    projectIdDisplay.textContent = `Project ID: ${data.project_id || "N/A"}`;
    licenseDisplay.textContent = data.license_type
      ? `License: ${data.license_type}`
      : `License: Not specified`;

    var downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Project";
    downloadButton.className = "download-button";

    downloadButton.onclick = async function () {
      try {
        console.log("Initiating License Agreement on Blockchain...");

        const contract = await setupDownloadContract();
        const tx = await contract.acceptLicense(projectId, data.license_type);
        await tx.wait();

        console.log("License Agreement Stored on Blockchain!");

        window.location.href = `/ade/PHP/download.php?id=${encodeURIComponent(
          data.project_id
        )}`;
      } catch (error) {
        console.error("Error accepting license on blockchain:", error);
        alert("Failed to confirm license agreement.");
      }
    };

    downloadButtonContainer.appendChild(downloadButton);

    modal.style.display = "block";

    document.body.appendChild(modal);
  } catch (error) {
    console.error("Error fetching project details:", error);
    alert("Failed to fetch project details. Please try again.");
  }
};

async function setupDownloadContract() {
  return getContract(
    DOWNLOAD_AGREEMENT_ADDRESS,
    DOWNLOAD_AGREEMENT_ABI.abi,
    true
  );
}

document.addEventListener("click", function (event) {
  var modal = document.getElementById("projectDetailsModal");
  if (event.target === modal) {
    closeProjectDetailsModal();
  }
});

function closeProjectDetailsModal() {
  document.getElementById("projectDetailsModal").style.display = "none";
}

window.openCreateProjectModal = function () {
  var modal = document.getElementById("createProjectModal");
  modal.style.display = "block";
};

window.closeCreateProjectModal = function () {
  document.getElementById("createProjectModal").style.display = "none";
};

document.addEventListener("click", function (event) {
  var modal = document.getElementById("createProjectModal");
  var modalContent = document.querySelector(".modal-content");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

window.searchProjects = function (query) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  fetch(`/ade/PHP/search_projects.php?q=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((projects) => {
      if (projects.length > 0) {
        projects.forEach((project) => {
          const li = document.createElement("li");
          li.innerHTML = `
  <strong>${project.project_name}</strong><br>
  <span class="license-label">License: ${project.license_type}</span>`;
          li.className = "search-result-item";
          li.onclick = function () {
            openProjectDetails(
              project.project_id,
              project.project_name,
              project.project_description,
              currentScreenId
            );
            searchResults.innerHTML = "";
          };
          searchResults.appendChild(li);
        });
      } else if (query.length === 0) {
        searchButtonClick();
      }
    })
    .catch((error) => console.error("Error fetching search results:", error));
};

window.searchButtonClick = function () {
  const query = document.getElementById("searchBar").value;
  const searchResults = document.getElementById("searchResults");

  fetch(`/ade/PHP/search_projects.php?q=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((projects) => {
      const projectsSection = document.getElementById("projectsSection");
      projectsSection.innerHTML = "";

      projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.className = "project";
        projectElement.textContent = project.project_name;
        projectElement.addEventListener("click", function () {
          openProjectDetails(
            project.project_id,
            project.project_name,
            project.project_description,
            currentScreenId
          );
        });
        projectsSection.appendChild(projectElement);
      });

      searchResults.innerHTML = "";
    })
    .catch((error) => console.error("Error fetching projects:", error));
};

document
  .getElementById("searchBar")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchButtonClick();
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  displayWalletInfo();
});

window.openScreen = function (screenId) {
  currentScreenId = screenId;
  var screens = ["browseProjects", "myProjects"];

  screens.forEach(function (screen) {
    var screenElement = document.getElementById(screen);
    var linkElement = document.getElementById(screen + "Link");

    screenElement.style.display = screen === screenId ? "block" : "none";
    linkElement.classList.toggle("active", screen === screenId);
  });
  loadSoftwareProjects(screenId === "browseProjects");
};
