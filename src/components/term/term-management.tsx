"use client"

import React, { useState, useEffect } from "react"
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}))

interface InterestRate {
    id: string
    term: string
    rate: number
    minBalance: number
    status: "active" | "inactive"
}

interface FormData {
    term: string
    rate: string
    minBalance: string
    status: "active" | "inactive"
}



const TermManagement: React.FC = () => {
    const [interestRates, setInterestRates] = useState<InterestRate[]>([
        {
            id: "term001",
            term: "1 month",
            rate: 2.5,
            minBalance: 5,
            status: "active",
        },
        {
            id: "term002",
            term: "3 months",
            rate: 3.0,
            minBalance: 7,
            status: "active",
        },
        {
            id: "term003",
            term: "6 months",
            rate: 4.2,
            minBalance: 10,
            status: "active",
        },
        {
            id: "term004",
            term: "9 months",
            rate: 4.8,
            minBalance: 12,
            status: "active",
        },
        {
            id: "term005",
            term: "12 months",
            rate: 5.5,
            minBalance: 20,
            status: "active",
        },
        {
            id: "term006",
            term: "24 months",
            rate: 6.5,
            minBalance: 30,
            status: "active",
        },
    ])

    const [openDialog, setOpenDialog] = useState(false)
    const [selectedRate, setSelectedRate] = useState<InterestRate | null>(null)
    const [formData, setFormData] = useState<FormData>({
        term: "",
        rate: "",
        minBalance: "",
        status: "active",
    })

    const handleOpenDialog = (rate?: InterestRate) => {
        if (rate) {
            setSelectedRate(rate)
            setFormData({
                term: rate.term,
                rate: rate.rate.toString(),
                minBalance: rate.minBalance.toString(),
                status: rate.status,
            })
        } else {
            setSelectedRate(null)
            setFormData({ term: "", rate: "", minBalance: "", status: "active" })
        }
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
        setSelectedRate(null)
    }

    const handleFormChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        const newRate: InterestRate = {
            id: selectedRate ? selectedRate.id : `RATE${Date.now()}`,
            term: formData.term,
            rate: parseFloat(formData.rate),
            minBalance: parseFloat(formData.minBalance),
            status: formData.status,
        }

        if (selectedRate) {
            setInterestRates((prev) =>
                prev.map((rate) => (rate.id === selectedRate.id ? newRate : rate))
            )
        } else {
            setInterestRates((prev) => [...prev, newRate])
        }
        handleCloseDialog()
    }

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this interest rate?")) {
            setInterestRates((prev) => prev.filter((rate) => rate.id !== id))
        }
    }

    return (
        <Box sx={{ p: 3 }}>
            <StyledCard>
                <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">
                            Interest Rate Management
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add New Rate
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Term</TableCell>
                                    <TableCell>Interest Rate (%)</TableCell>
                                    <TableCell>Minimum Balance (USDC)</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {interestRates.map((rate) => (
                                    <TableRow key={rate.id}>
                                        <TableCell>{rate.id}</TableCell>
                                        <TableCell>{rate.term}</TableCell>
                                        <TableCell sx={{paddingLeft:20}} >{rate.rate}</TableCell>
                                        <TableCell sx={{paddingLeft:20}} >{rate.minBalance}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={rate.status === "active" ? "Active" : "Inactive"}
                                                color={rate.status === "active" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenDialog(rate)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(rate.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </StyledCard>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedRate ? "Edit Interest Rate" : "Add New Interest Rate"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Term (e.g., 6 months)"
                                value={formData.term}
                                onChange={(e) => handleFormChange("term", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Interest Rate (%)"
                                type="number"
                                value={formData.rate}
                                onChange={(e) => handleFormChange("rate", e.target.value)}
                                inputProps={{ step: "0.1" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Minimum Balance (USDC)"
                                type="number"
                                value={formData.minBalance}
                                onChange={(e) => handleFormChange("minBalance", e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={formData.status}
                                onChange={(e) => handleFormChange("status", e.target.value)}
                                SelectProps={{ native: true }}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </TextField>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedRate ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default TermManagement