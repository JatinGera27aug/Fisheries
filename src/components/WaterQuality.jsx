import { useState, useEffect } from 'react';
import { waterQualityService } from '../services/firebase.services';
// import AddWaterQualityForm from './AddWaterQualityForm';
import { useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, RefreshCcw, AlertCircle, DatabaseIcon } from 'lucide-react';
import { toast } from 'react-toastify';
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//     DialogDescription
// } from "./ui/dialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Button } from "./ui/button";
// import { Alert, AlertDescription } from "./ui/alert";
import { Loader2 } from "lucide-react";
// Chart.js registration
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const WaterQualityDashboard = () => {
    const navigate = useNavigate();
    const [waterQualityData, setWaterQualityData] = useState([]);
    // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [locations, setLocations] = useState([]);
    const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d'
    // Move fetchWaterQualityData and fetchLocations to the top of the component

    const fetchLocations = useCallback(async () => {
        try {
            const uniqueLocations = await waterQualityService.getUniqueLocations();
            setLocations(uniqueLocations);
        } catch (err) {
            console.error('Failed to fetch locations:', err);
            // Optionally set a default or show an error toast
            toast.error('Failed to fetch locations');
        }
    }, []);
    
    const resetFilters = () => {
        setSelectedLocation('all');
        setTimeRange('30d');
    };

    const fetchWaterQualityData = useCallback(async () => {
        try {
            setLoading(true);
            
            const filters = {
                ...(selectedLocation !== 'all' && { location: selectedLocation }),
                timeRange
            };
            
            const data = await waterQualityService.getWaterQualityData(filters);
            
            if (!data || data.length === 0) {
                setWaterQualityData([]);
                toast.info('No data available for the selected criteria');
            } else {
                setWaterQualityData(data);
            }
        } catch (err) {
            // setError('Failed to fetch water quality data');
            console.error(err);
            toast.error('Failed to fetch water quality data');
        } finally {
            setLoading(false);
        }
    }, [selectedLocation, timeRange]);

    // Now create handleDataAdded after fetchWaterQualityData is defined
    // const handleDataAdded = useCallback(() => {
    //     setIsAddModalOpen(false);
    //     fetchWaterQualityData();
    // }, [fetchWaterQualityData]);
    // useEffect(() => {
    //     if (isAddModalOpen) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'unset';
    //     }
    //     return () => {
    //         document.body.style.overflow = 'unset';
    //     };
    // }, [isAddModalOpen]);
    useEffect(() => {
        fetchWaterQualityData();
        fetchLocations();
    }, [fetchWaterQualityData, fetchLocations]);
    const prepareChartData = useCallback(() => {
        if (!waterQualityData.length) return null;
        const sortedData = [...waterQualityData].sort((a, b) =>
            a.timestamp.seconds - b.timestamp.seconds
        );
        const labels = sortedData.map(data =>
            new Date(data.timestamp.seconds * 1000).toLocaleString()
        );

        return {
            labels,
            datasets: [
                {
                    label: 'pH Levels',
                    data: sortedData.map(data => data.pH),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Oxygen Levels (mg/L)',
                    data: waterQualityData.map(data => data.oxygenLevel),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Temperature (°C)',
                    data: waterQualityData.map(data => data.temperature),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1,
                    fill: true
                }
            ]
        };
    }, [waterQualityData]);;
    const calculateAverage = (field) => {
        if (!waterQualityData.length) return 0;
        return (waterQualityData.reduce((acc, curr) => acc + curr[field], 0) / waterQualityData.length).toFixed(2);
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Water Quality Trends'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">

            {/* Compact Header and Add Reading Section */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">Water Quality Dashboard</h1>

                    <p className="text-gray-600 text-sm">Monitor water quality parameters</p>

                </div>
                <Button 
                onClick={() => navigate('/add-water-quality')} 
                className="bg-blue-600 hover:bg-blue-700"
            >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Reading
            </Button>
            </div>



            {/* Filters Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4">
                    {/* Location Dropdown */}
                    <Select 
                        value={selectedLocation} 
                        onValueChange={setSelectedLocation}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {locations.map(location => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Time Range Dropdown */}
                    <Select 
                        value={timeRange} 
                        onValueChange={setTimeRange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="24h">Last 24 Hours</SelectItem>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Reset Filters Button */}
                    <Button 
                        variant="outline" 
                        onClick={resetFilters}
                        disabled={selectedLocation === 'all' && timeRange === '30d'}
                    >
                        Reset Filters
                    </Button>
                </div>
            


                <Button

                    variant="outline"

                    onClick={fetchWaterQualityData}

                    className="w-full"

                >

                    <RefreshCcw className="h-4 w-4 mr-2" />

                    Refresh Data

                </Button>

            </div>



            {/* Error Handling */}

            {error && (

                <div className="bg-red-100 text-red-700 p-3 rounded-lg flex items-center">

                    <AlertCircle className="h-5 w-5 mr-2" />

                    {error}

                </div>

            )}



            {/* Compact Statistics */}

            <div className="grid grid-cols-3 gap-4">

                {["pH", "oxygenLevel", "temperature"].map((metric) => (

                    <Card key={metric} className="bg-white shadow-sm">

                        <CardContent className="pt-4 pb-2">

                            <p className="text-xs text-gray-500 mb-1">

                                Avg {metric === "pH" ? "pH" : metric === "oxygenLevel" ? "Oxygen" : "Temp"}

                            </p>

                            <div className="flex items-baseline">

                                <span className="text-lg font-bold">

                                    {calculateAverage(metric)}

                                </span>

                                <span className="text-xs text-gray-500 ml-1">

                                    {metric === "pH" ? "pH" : metric === "oxygenLevel" ? "mg/L" : "°C"}

                                </span>

                            </div>

                        </CardContent>

                    </Card>

                ))}

            </div>



            {/* Chart Section */}
            <Card className="mb-8 bg-white shadow-md">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">Water Quality Trends</CardTitle>
                        {loading && <Loader2 className="animate-spin" />}
                    </div>
                </CardHeader>
                <CardContent>
                    {waterQualityData.length > 0 ? (
                        <div className="h-[400px]">
                            <Line data={prepareChartData()} options={chartOptions} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-[400px] text-gray-500">
                            <div className="text-center">
                                <DatabaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No data available for the selected criteria</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


   {/* Recent Readings Table */}
   <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Recent Readings</CardTitle>
                        <span className="text-xs text-gray-500">
                            {waterQualityData.length} entries
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {waterQualityData.length > 0 ? (
                        <div className="overflow-x-auto max-h-[300px]">

                        <table className="w-full text-sm">

                            <thead className="sticky top-0 bg-gray-100">

                                <tr>

                                    {["Location", "pH", "O2", "Temp", "Status", "Added By"].map((header) => (

                                        <th key={header} className="p-2 text-left text-xs text-gray-500">

                                            {header}

                                        </th>

                                    ))}

                                </tr>

                            </thead>

                            <tbody>

                                {waterQualityData.map((reading) => (

                                    <tr key={reading.id} className="border-b last:border-b-0 hover:bg-gray-50">

                                        <td className="p-2">{reading.location}</td>

                                        <td className="p-2">{reading.pH}</td>

                                        <td className="p-2">{reading.oxygenLevel}</td>

                                        <td className="p-2">{reading.temperature}°C</td>

                                        <td className="p-2">

                                            <span

                                                className={`px-2 py-1 rounded-full text-xs ${reading.status === "critical"

                                                        ? "bg-red-100 text-red-800"

                                                        : reading.status === "warning"

                                                            ? "bg-yellow-100 text-yellow-800"

                                                            : "bg-green-100 text-green-800"

                                                    }`}

                                            >

                                                {reading.status}

                                            </span>

                                        </td>

                                        <td className="p-2 text-xs text-gray-500">

                                            {reading.updaterName || "Unknown"}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <DatabaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No readings available for the selected criteria</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );


};



export default WaterQualityDashboard;







