// Google Drive API integration utilities
export interface GoogleDriveConfig {
    clientId: string
    apiKey: string
    scopes: string
  }
  
  // Default configuration
  const defaultConfig: GoogleDriveConfig = {
    clientId: "752606603363-vjm8ml0q0756lt9656t956e5nlbt93n8.apps.googleusercontent.com",
    apiKey: "AIzaSyCNNeuyRg8HA5j1LqmLsfCYpdgTSkodNzM",
    scopes: "https://www.googleapis.com/auth/drive.file",
  }
  
  let tokenClient: any
  let accessToken: string | null = null
  let createdFolderId: string | null = null
  
  // Initialize Google API
  export const initGoogleDriveApi = (config: GoogleDriveConfig = defaultConfig) => {
    // This function should be called after the Google API script is loaded
    if (typeof window !== "undefined" && window.google) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: config.clientId,
        redirect_uri: "http://localhost:3000",
        scope: config.scopes,
        callback: (response: any) => {
          if (response.error) {
            console.error("Token error:", response)
          } else {
            accessToken = response.access_token
            console.log("Access token obtained:", accessToken)
          }
        },
      })
    }
  }
  
  // Request access token
  export const requestAccessToken = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!tokenClient) {
        reject(new Error("Token client not initialized"))
        return
      }
  
      tokenClient.callback = (response: any) => {
        if (response.error) {
          console.error("Error getting token:", response)
          reject(response)
        } else {
          accessToken = response.access_token
          if (accessToken) {
            resolve(accessToken)
          } else {
            reject(new Error("Failed to obtain access token"))
          }
        }
      }
      tokenClient.requestAccessToken()
    })
  }
  
  // Create folder in Google Drive
  export const createDriveFolder = async (folderName: string): Promise<string> => {
    if (!accessToken) {
      console.log("Requesting new token...")
      await requestAccessToken()
    }
  
    const metadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    }
  
    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    })
  
    if (!response.ok) {
      console.error("Failed to create folder:", await response.json())
      throw new Error("Folder creation failed")
    }
  
    const folderData = await response.json()
    console.log("Folder created:", folderData)
    createdFolderId = folderData.id
    return folderData.id
  }
  
  // Upload file to Google Drive
  export const uploadFileToDrive = async (file: File, folderId?: string): Promise<string> => {
    const targetFolderId = folderId || createdFolderId
  
    if (!targetFolderId) {
      throw new Error("No folder ID provided or created")
    }
  
    if (!accessToken) {
      const token = await requestAccessToken()
      accessToken = token
    }
  
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [targetFolderId],
    }
  
    const formData = new FormData()
    formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
    formData.append("file", file)
  
    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  
    if (!response.ok) {
      console.error("File upload failed:", await response.json())
      throw new Error("File upload failed")
    }
  
    const fileData = await response.json()
  
    // Make file publicly accessible
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "reader", type: "anyone" }),
    })
  
    console.log(`Uploaded file: ${file.name} to folder: ${targetFolderId}`)
    return `https://drive.google.com/file/d/${fileData.id}/view`
  }
  
  // Encoding/decoding utilities
  export const encodeBase64 = (input: string): string => {
    return btoa(unescape(encodeURIComponent(input)))
  }
  
  export const decodeBase64 = (input: string): string => {
    return decodeURIComponent(escape(atob(input)))
  }
  
  