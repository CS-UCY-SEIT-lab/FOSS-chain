// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LicenseManager {
    struct LicenseAgreement {
        address downloader;
        uint256 originalProjectId;
        string licenseType;
        uint256 timestamp;
    }
    
    struct UploadedProject {
        address uploader;
        uint256 projectId;
        uint256 parentProjectId;
        string licenseType;
        bool flagged;
    }

    mapping(uint256 => LicenseAgreement[]) public licenseRecords; 
    mapping(uint256 => UploadedProject) public uploadedProjects; 
    mapping(uint256 => string[]) public projectFunctionHashes; // Store all function hashes for project

    event LicenseAccepted(address downloader, uint256 originalProjectId, string licenseType, uint256 timestamp);
    event ProjectUploaded(address uploader, uint256 projectId, uint256 parentProjectId, string licenseType, bool flagged, string[] functionHashes);

    function acceptLicense(uint256 originalProjectId, string memory licenseType) public {
        licenseRecords[originalProjectId].push(LicenseAgreement(msg.sender, originalProjectId, licenseType, block.timestamp));
        emit LicenseAccepted(msg.sender, originalProjectId, licenseType, block.timestamp);
    }

    function uploadProject(
        uint256 projectId,
        uint256 parentProjectId,
        string memory licenseType,
        string[] memory functionHashes
    ) public {
        bool isFlagged = false;

        if (parentProjectId != 0) {
            bool isCompatible = false;
            LicenseAgreement[] memory agreements = licenseRecords[parentProjectId];

            for (uint256 i = 0; i < agreements.length; i++) {
                if (keccak256(abi.encodePacked(agreements[i].licenseType)) == keccak256(abi.encodePacked(licenseType))) {
                    isCompatible = true;
                    break;
                }
            }

            if (!isCompatible) {
                isFlagged = true;
            }
        }

        uploadedProjects[projectId] = UploadedProject(msg.sender, projectId, parentProjectId, licenseType, isFlagged);
        projectFunctionHashes[projectId] = functionHashes;

        emit ProjectUploaded(msg.sender, projectId, parentProjectId, licenseType, isFlagged, functionHashes);
    }

    function getProjectHashes(uint256 projectId) public view returns (string[] memory) {
        return projectFunctionHashes[projectId];
    }

    function isProjectFlagged(uint256 projectId) public view returns (bool) {
        return uploadedProjects[projectId].flagged;
    }
    function getProjectDetails(uint256 projectId) public view returns (string memory licenseType) {
    require(uploadedProjects[projectId].uploader != address(0), "Project does not exist");
    return uploadedProjects[projectId].licenseType;
}

}
