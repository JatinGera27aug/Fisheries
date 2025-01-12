import { useState, useEffect } from 'react';
import { waterQualityService } from '../services/firebase.services';
import { toast } from 'react-toastify';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
// } from "./ui/dialog";
// import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";

const AddWaterQualityForm = ({ onDataAdded, isOpen, onOpenChange }) => {
    const [formData, setFormData] = useState({
        location: '',
        pH: '',
        temperature: '',
        oxygenLevel: '',
        salinity: '',
    });
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    // Fetch user data when the dialog opens
    useEffect(() => {
        const fetchUserData = async () => {
            // Ensure we only fetch when dialog is open
            if (!isOpen) {
                setUserLoading(false);
                return;
            }

            setUserLoading(true);
            const currentUser = auth.currentUser;
            
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "Users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("Fetched User Data:", userData);
                        setUserData(userData);
                    } else {
                        console.error("No user document found!");
                        toast.error("User profile not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast.error("Error fetching user information");
                } finally {
                    setUserLoading(false);
                }
            } else {
                console.error("No current user found");
                setUserLoading(false);
            }
        };

        fetchUserData();
    }, [isOpen]);

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

            // Notify parent component to refresh data
            if (onDataAdded) {
                onDataAdded();
            }

            // Close the dialog
            if (onOpenChange) {
                onOpenChange(false);
            }
        } catch (error) {
            console.error('Error adding water quality data:', error);
            toast.error('Failed to add water quality data');
        } finally {
            setLoading(false);
        }
    };

    // Render content based on loading and user data
    const renderContent = () => {
        if (userLoading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            );
        }

        if (!userData) {
            return (
                <div className="text-center p-6">
                    <p className="text-red-500">Unable to retrieve user information</p>
                    <Button 
                        onClick={() => onOpenChange?.(false)} 
                        className="mt-4"
                    >
                        Close
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {/* User Info Header */}
                <div className="bg-gray-100 p-4 rounded-lg">
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... rest of the form remains the same ... */}
                </form>
            </div>
        );
    };

    return renderContent();
};

export default AddWaterQualityForm;