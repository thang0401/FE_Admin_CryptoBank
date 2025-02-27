"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Typography,
} from "@mui/material"
import UploadIcon from "@mui/icons-material/Upload"
import { initGoogleDriveApi, createDriveFolder, uploadFileToDrive } from "../../utils/google-drive"

interface ContractUploadProps {
  onUploadComplete: (fileUrl: string, driveUrl: string) => void
}

const ContractUpload: React.FC<ContractUploadProps> = ({ onUploadComplete }) => {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [folderId, setFolderId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null) 
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null) 


  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://apis.google.com/js/api.js"
    script.onload = () => {
      window.gapi.load("client", () => {
        window.gapi.client
          .init({
            apiKey: "AIzaSyCNNeuyRg8HA5j1LqmLsfCYpdgTSkodNzM",
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          })
          .then(() => {
            console.log("GAPI client initialized")
          })
      })
    }
    document.body.appendChild(script)

    const scriptGIS = document.createElement("script")
    scriptGIS.src = "https://accounts.google.com/gsi/client"
    scriptGIS.onload = () => {
      initGoogleDriveApi()
    }
    document.body.appendChild(scriptGIS)

    return () => {
      document.body.removeChild(script)
      document.body.removeChild(scriptGIS)
    }
  }, [])

  const handleCreateFolder = async () => {
    try {
      const folderName = `Contract Folder ${new Date().toISOString()}`
      const id = await createDriveFolder(folderName)
      setFolderId(id)
      setMessage(`Folder created successfully: ${folderName}`)
      setIsSuccess(true)
      return id
    } catch (err) {
      setMessage("Unable to create folder. Please try again")
      setIsSuccess(false)
      console.error("Failed to create folder", err)
      return null
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setUploadProgress(0)
    setMessage(null)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 300)
  }

  const handleUploadComplete = async () => {
    if (!uploadedFile) {
      setMessage("Please select a file first")
      return
    }

    try {
      const targetFolderId = folderId || (await handleCreateFolder())
      if (!targetFolderId) {
        setMessage("Unable to create folder for file upload")
        return
      }

      const fileUrl = await uploadFileToDrive(uploadedFile, targetFolderId)
      setUploadProgress(100)

      const localFileUrl = URL.createObjectURL(uploadedFile)
      onUploadComplete(localFileUrl, fileUrl)

      setMessage("File uploaded successfully!")
      setTimeout(() => {
        setUploadDialogOpen(false)
        setUploadProgress(0)
        setUploadedFile(null)
        setMessage(null)
      }, 1000)
    } catch (err) {
      console.error("Failed to upload:", err)
      setMessage("Unable to upload file. Please try again.")
      setUploadProgress(0)
    }
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<UploadIcon />} onClick={() => setUploadDialogOpen(true)}>
          Upload Contract
        </Button>
      </Box>

      <Dialog open={isUploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Upload contract to Google Drive</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" gutterBottom>
            This action will upload your contract to Google Drive and create a shareable link.
            </Typography>

            {!folderId && (
              <Button variant="outlined" onClick={handleCreateFolder} sx={{ mb: 2, mt: 1 }}>
               Create Google Drive folder
              </Button>
            )}

            {folderId && (
              <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                Folder created. Ready to upload file.
              </Typography>
            )}

            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="contract-file-input"
            />
            <label htmlFor="contract-file-input">
              <Button variant="outlined" component="span" startIcon={<UploadIcon />} disabled={!folderId}>
              Select: 
              </Button>
            </label>

            {uploadedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {uploadedFile.name}
              </Typography>
            )}
          </Box>

          {uploadProgress > 0 && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" align="center">
                {uploadProgress}%
              </Typography>
            </Box>
          )}

          {message && (
            <Typography variant="body2" sx={{ mt: 2 }} color={isSuccess ? "green" : "red"}>
              {message}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUploadComplete}
            disabled={!uploadedFile || !folderId || (uploadProgress > 0 && uploadProgress < 90)}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ContractUpload