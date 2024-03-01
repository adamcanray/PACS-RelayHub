# PACS RelayHub

This project is using Orthanc as a PACS server. It is a simple relay server that can be used to forward DICOM files to private IPFS network. It is designed to be used in a private network, where the DICOM files are not allowed to be stored in a public network.

## Installation

1. Install Orthanc
   You can install Orthanc by following the instructions in the [official website](https://www.orthanc-server.com/download.php).
2. Configure Private IPFS
   You can configure private IPFS by following the instructions in this [repository](https://github.com/adamcanray/Private-IPFS-Cluster-Data-Replication).
3. Start the server
   ```bash
   npm install
   npm run dev
   ```
