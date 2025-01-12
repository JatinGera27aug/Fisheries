import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diseaseOutbreakService } from '../services/firebase.services';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "./ui/select";
import { Loader2, ArrowLeft } from "lucide-react";

const AddDiseaseOutbreakForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        location: '',
        diseaseName: '',
        severity: '',
        affectedSpecies: '',
        status: '',
        symptoms: [],
        treatments: []
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(',').map(item => item.trim())
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await diseaseOutbreakService.addDiseaseOutbreakData(formData);
            toast.success('Disease outbreak data added successfully!');
            
            // Reset form
            setFormData({
                location: '',
                diseaseName: '',
                severity: '',
                affectedSpecies: '',
                status: '',
                symptoms: [],
                treatments: []
            });

            // Navigate back to dashboard
            navigate('/disease-outbreak');
        } catch (error) {
            console.error('Error adding disease outbreak data:', error);
            toast.error('Failed to add disease outbreak data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => navigate('/disease-outbreak')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>Report Disease Outbreak</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter location"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diseaseName">Disease Name</Label>
                                <Input
                                    id="diseaseName"
                                    name="diseaseName"
                                    value={formData.diseaseName}
                                    onChange={handleChange}
                                    placeholder="Enter disease name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="severity">Severity</Label>
                                <Select 
                                    value={formData.severity}
                                    onValueChange={(value) => setFormData(prev => ({...prev, severity: value}))}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="affectedSpecies">Affected Species</Label>
                                <Input
                                    id="affectedSpecies"
                                    name="affectedSpecies"
                                    value={formData.affectedSpecies}
                                    onChange={handleChange}
                                    placeholder="Enter affected species"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select 
                                    value={formData.status}
                                    onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="contained">Contained</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                                <Input
                                    id="symptoms"
                                    name="symptoms"
                                    value={formData.symptoms.join(', ')}
                                    onChange={(e) => handleMultiInputChange('symptoms', e.target.value)}
                                    placeholder="Enter symptoms, separated by commas"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="treatments">Treatments (comma-separated)</Label>
                                <Input
                                    id="treatments"
                                    name="treatments"
                                    value={formData.treatments.join(', ')}
                                    onChange={(e) => handleMultiInputChange('treatments', e.target.value)}
                                    placeholder="Enter treatments, separated by commas"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Report Disease Outbreak'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddDiseaseOutbreakForm;