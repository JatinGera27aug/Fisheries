import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { waterQualityService } from '../services/firebase.services';
import { toast } from 'react-toastify';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";

const AddWaterQualityPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        location: '',
        pH: '',
        temperature: '',
        oxygenLevel: '',
        salinity: '',
    });
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "Users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserData(userData);
                    } else {
                        toast.error("User profile not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast.error("Error fetching user information");
                }
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'location' ? value : Number(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast.error('You must be logged in to add data');
            setLoading(false);
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                lastUpdatedBy: currentUser.uid,
                updaterName: userData ? `${userData.firstName} ${userData.lastName}` : 'Unknown',
                updaterEmail: currentUser.email,
                userType: userData?.userType || 'unknown',
                timestamp: new Date()
            };

            await waterQualityService.addWaterQualityData(dataToSubmit);
            toast.success('Water quality data added successfully!');
            
            // Reset form
            setFormData({
                location: '',
                pH: '',
                temperature: '',
                oxygenLevel: '',
                salinity: '',
            });

            // Navigate back to dashboard
            navigate('/water-quality');
        } catch (error) {
            console.error('Error adding water quality data:', error);
            toast.error('Failed to add water quality data');
        } finally {
            setLoading(false);
        }
    };

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => navigate('/water-quality')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>Add Water Quality Reading</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* User Info Banner */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Logged in as</p>
                                <h3 className="text-lg font-semibold">
                                    {userData.firstName} {userData.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {userData.userType}
                                </p>
                            </div>
                            <div className="text-sm text-gray-500">
                                {userData.email}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter pond location"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pH">pH Level (0-14)</Label>
                                <Input
                                    id="pH"
                                    name="pH"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                    value={formData.pH}
                                    onChange={handleChange}
                                    placeholder="Enter pH"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="temperature">Temperature (°C)</Label>
                                <Input
                                    id="temperature"
                                    name="temperature"
                                    type="number"
                                    step="0.1"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    placeholder="Enter temperature"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="oxygenLevel">Oxygen Level (mg/L)</Label>
                                <Input
                                    id="oxygenLevel"
                                    name="oxygenLevel"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.oxygenLevel}
                                    onChange={handleChange}
                                    placeholder="Enter oxygen level"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salinity">Salinity (ppt)</Label>
                                <Input
                                    id="salinity"
                                    name="salinity"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={formData.salinity}
                                    onChange={handleChange}
                                    placeholder="Enter salinity"
                                    required
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
                                    Adding...
                                </>
                            ) : (
                                'Add Water Quality Reading'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddWaterQualityPage;