import { useState, useEffect, useCallback } from 'react';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "./ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "./ui/select";
import { Button } from "./ui/button";
import { Loader2, DatabaseIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { diseaseOutbreakService } from '../services/firebase.services';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DiseaseOutbreakDashboard = () => {
    const [diseaseOutbreakData, setDiseaseOutbreakData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [timeRange, setTimeRange] = useState('30d');
    const [loading, setLoading] = useState(false);

    // Fetch locations on component mount
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const uniqueLocations = await diseaseOutbreakService.getUniqueLocations();
                setLocations(uniqueLocations);
            } catch (err) {
                console.error('Failed to fetch locations:', err);
                toast.error('Failed to fetch locations');
            }
        };
        fetchLocations();
    }, []);

    // Fetch disease outbreak data when filters change
    useEffect(() => {
        fetchDiseaseOutbreakData();
    }, [selectedLocation, timeRange]);

    const fetchDiseaseOutbreakData = useCallback(async () => {
        try {
            setLoading(true);
            
            const filters = {
                ...(selectedLocation !== 'all' && { location: selectedLocation }),
                timeRange
            };
            
            const data = await diseaseOutbreakService.getDiseaseOutbreakData(filters);
            
            if (!data || data.length === 0) {
                setDiseaseOutbreakData([]);
                toast.info('No disease outbreak data available for the selected criteria');
            } else {
                setDiseaseOutbreakData(data);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch disease outbreak data');
        } finally {
            setLoading(false);
        }
    }, [selectedLocation, timeRange]);

    // Prepare pie chart data for disease severity
    const prepareSeverityChartData = () => {
        const severityCounts = {
            low: 0,
            medium: 0,
            high: 0
        };

        diseaseOutbreakData.forEach(outbreak => {
            severityCounts[outbreak.severity]++;
        });

        return {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
                data: [
                    severityCounts.low, 
                    severityCounts.medium, 
                    severityCounts.high
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ]
            }]
        };
    };

    const resetFilters = () => {
        setSelectedLocation('all');
        setTimeRange('30d');
    };

    return (
        <div className="space-y-6">
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
            </div>

            {/* Severity Distribution Chart */}
            <Card className="mb-8 bg-white shadow-md">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">Disease Severity Distribution</CardTitle>
                        {loading && <Loader2 className="animate-spin" />}
                    </div>
                </CardHeader>
                <CardContent>
                    {diseaseOutbreakData.length > 0 ? (
                        <div className="h-[400px] flex justify-center items-center">
                            <div className="w-1/2">
                                <Pie 
                                    data={prepareSeverityChartData()} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }} 
                                />
                            </div>
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

            {/* Disease Outbreak Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Recent Disease Outbreaks</CardTitle>
                        <span className="text-xs text-gray-500">
                            {diseaseOutbreakData.length} entries
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {diseaseOutbreakData.length > 0 ? (
                        <div className="overflow-x-auto max-h-[300px]">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        {[
                                            "Location", 
                                            "Disease", 
                                            "Severity", 
                                            "Species", 
                                            "Status", 
                                            "Date Reported"
                                        ].map((header) => (
                                            <th 
                                                key={header} 
                                                className="p-2 text-left text-xs text-gray-500"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {diseaseOutbreakData.map((outbreak) => (
                                        <tr 
                                            key={outbreak.id} 
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="p-2">{outbreak.location}</td>
                                            <td className="p-2">{outbreak.diseaseName}</td>
                                            <td className="p-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        outbreak.severity === "high"
                                                            ? "bg-red-100 text-red-800"
                                                            : outbreak.severity === "medium"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {outbreak.severity}
                                                </span>
                                            </td>
                                            <td className="p-2">{outbreak.affectedSpecies}</td>
                                            <td className="p-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        outbreak.status === "active"
                                                            ? "bg-red-100 text-red-800"
                                                            : outbreak.status === "contained"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {outbreak.status}
                                                </span>
                                            </td>
                                            <td className="p-2">
                                                {outbreak.dateReported 
                                                    ? new Date(outbreak.dateReported.seconds * 1000).toLocaleDateString() 
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <DatabaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No disease outbreak records available</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DiseaseOutbreakDashboard;