import { TWStorage } from "@/lib/thirdweb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const files = formData.getAll("files");

  // no need to validate dicom, if the files is not valid, the orthanc server will return an error
  const isStateFile = (files[0] as any).type === "application/json";
  try {
    /**
     * Stage 1 ===============================================
     * updaload to orthanc server
     */
    let orthancServerData: any = {};
    if (!isStateFile) {
      // upload to orthanc server
      const orthancServer = process.env.ORTHANC_SERVER_URL;
      const orthancServerUrl = `${orthancServer}/instances`;
      const orthancServerResponse = await fetch(orthancServerUrl, {
        method: "POST",
        body: files[0],
      });

      orthancServerData = await orthancServerResponse.json();

      if (orthancServerData.Status !== "Success") {
        if (orthancServerData.Status === "AlreadyStored") {
          return NextResponse.json(
            { error: "The file is already stored in the orthanc server" },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: "Failed to upload to orthanc server" },
          { status: 500 }
        );
      }
    }

    /**
     * Stage 2 ===============================================
     * upload to ipfs
     */

    // upload to ipfs server
    const ipfsServer = process.env.IPFS_SERVER_URL;
    const ipfsServerUrl = `${ipfsServer}/api/v0/add`;
    const formData = new FormData();
    formData.append("state", files[0]);
    const ipfsServerResponse = await fetch(ipfsServerUrl, {
      method: "POST",
      body: formData,
    });
    const ipfsServerData = await ipfsServerResponse.json();

    return NextResponse.json({
      orthanc: orthancServerData,
      ipfs: ipfsServerData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
