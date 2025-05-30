// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DownloadAgreement {
    struct LicenseAgreement {
        address downloader;
        uint256 originalProjectId;
        string licenseType;
        uint256 timestamp;
    }

    mapping(uint256 => LicenseAgreement[]) public licenseRecords;

    event LicenseAccepted(address downloader, uint256 originalProjectId, string licenseType, uint256 timestamp);

    function acceptLicense(uint256 originalProjectId, string memory licenseType) public {
        licenseRecords[originalProjectId].push(
            LicenseAgreement(msg.sender, originalProjectId, licenseType, block.timestamp)
        );

        emit LicenseAccepted(msg.sender, originalProjectId, licenseType, block.timestamp);
    }

    function getDownloadsByProject(uint256 projectId) public view returns (LicenseAgreement[] memory) {
        return licenseRecords[projectId];
    }
}
