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
    amountMonth: string
    interestRate: number
    minimum: number
    deleted: boolean 
}

// interface ServerInterestRate{
//     id: string 
//     amountMonth: number
//     interestRate: number
//     minimum: number
//     deleted: boolean 
// }

interface FormData {
    term: string
    rate: string
    minBalance: string
    status: "active" | "inactive"
}



const TermManagement: React.FC = () => {
    const [interestRates, setInterestRates] = useState<InterestRate[]>([])
    // const [serverinterestRates, setServerInterestRates] = useState<ServerInterestRate[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //map func
    // const mapToInterestRate = (serverData: ServerInterestRate[]): InterestRate[] => {
    //     return serverData.map((item) => ({
    //         id: item.id,
    //         term: item.amountMonth.toString(),
    //         rate: item.interestRate, 
    //         minBalance: item.minimum,
    //         status: item.deleted, // Convert boolean to string literal
    //     }));
    // };
    //
    useEffect(() => {
        const fetchInterestRates = async () => {
            try {
                const response = await fetch('https://be-crypto-depot.name.vn/term/all-term');
                if (!response.ok) {
                    throw new Error('Failed to fetch interest rates');
                }
                const data: InterestRate[] = await response.json();
                console.log(data);
                setInterestRates(data);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setLoading(false);
            }
        };
        fetchInterestRates();
    }, []);

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
                term: rate.amountMonth,
                rate: rate.interestRate.toString(),
                minBalance: rate.minimum.toString(),
                status: rate.deleted ?"active":"inactive",
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

    const handleSubmit = async () => {
        const newRate: InterestRate = {
            id: selectedRate ? selectedRate.id : `RATE${Date.now()}`,
            amountMonth: formData.term,
            interestRate: parseFloat(formData.rate),
            minimum: parseFloat(formData.minBalance),
            deleted: formData.status==="active"?true:false,
        }

        try{
            const method = selectedRate ? 'PUT' : 'POST';                           //Selected method

            const endpoint = selectedRate
            ? `https://be-crypto-depot.name.vn/term/update-term-interest-rate`              // Update endpoint
            : 'https://be-crypto-depot.name.vn/term/add-term';                                                 // Create endpoint
            //
            console.log(`${method} ${endpoint}`)
            const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRate),
            });

            if(response.ok){
            const updatedRate = await response.json();
            console.log(updatedRate)
            if (selectedRate) {
                setInterestRates((prev) =>
                    prev.map((rate) => (rate.id === selectedRate.id ? updatedRate : rate))
                )
            } else {
                setInterestRates((prev) => [...prev, updatedRate])
            }
            }
            else {
                throw new Error(`Failed to ${selectedRate ? 'update' : 'create'} rate: ${response.statusText}`);
            }

        }catch(error){
            console.error('Error submitting rate:', error);
            // Optionally, show an error message to the user
            alert('An error occurred while submitting the rate. Please try again.');
        }
        handleCloseDialog()
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this interest rate?")) {
            const endpoint= `https://be-crypto-depot.name.vn/term/delete-term`
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: id,
                });

            if(response.ok){
                setInterestRates((prev) => prev.filter((rate) => rate.id !== id))
            }else{

            }
            
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
                                        <TableCell>{rate.amountMonth}</TableCell>
                                        <TableCell sx={{paddingLeft:20}} >{rate.interestRate}</TableCell>
                                        <TableCell sx={{paddingLeft:20}} >{rate.minimum}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={!rate.deleted ? "Active" : "Inactive"}
                                                color={!rate.deleted ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenDialog(rate)} >
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
                                disabled={selectedRate != null}
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
                                disabled={selectedRate != null}
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