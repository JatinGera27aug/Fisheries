import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { initializeApp, getApps, deleteApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Chart, registerables } from 'chart.js';

// Approach 1: Modify initialization to check for existing apps
const initializeFirebaseApp = (config) => {
  // Check if an app with the same name already exists
  const existingApps = getApps();
  
  // If an app already exists, delete it first
  if (existingApps.length > 0) {
    const defaultApp = existingApps[0];
    deleteApp(defaultApp);
  }

  // Initialize and return the new app
  return initializeApp(config);
};

const PerformanceMetrics = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const firebaseAppRef = useRef(null);

  useEffect(() => {
    // New Firebase config
    const newFirebaseConfig = {
      apiKey: "AIzaSyB2WqBWfgTaMt_yHr5YR8kMPRZATLVlxz8",
      authDomain: "fisheriesdashboard-23749.firebaseapp.com",
      databaseURL: "https://fisheriesdashboard-23749-default-rtdb.firebaseio.com",
      projectId: "fisheriesdashboard-23749",
      storageBucket: "fisheriesdashboard-23749.firebasestorage.app",
      messagingSenderId: "80589146797",
      appId: "1:80589146797:web:f68c8a0c29b8dc4a2f9424",
      measurementId: "G-X69P61RD42"
    };

    // Alternative Approach 1: Use getApp with name
    try {
      firebaseAppRef.current = initializeApp(newFirebaseConfig, 'PerformanceMetricsApp');
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }

    // Alternative Approach 2: Use existing app with different configuration
    const database = getDatabase(firebaseAppRef.current);

    // Register Chart.js components
    Chart.register(...registerables);

    // Get chart context
    const ctx = chartRef.current.getContext('2d');

    // Create chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Server Load',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          }
        }
      }
    });

    // Reference to metrics in Firebase Realtime Database
    const metricsRef = ref(database, 'metrics/');

    // Listen for real-time updates
    const unsubscribe = onValue(metricsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const labels = [];
        const loadValues = [];

        // Process data
        Object.keys(data).forEach(key => {
          labels.push(data[key].time);
          loadValues.push(data[key].load);
        });

        // Update chart
        if (chartInstanceRef.current) {
          chartInstanceRef.current.data.labels = labels;
          chartInstanceRef.current.data.datasets[0].data = loadValues;
          chartInstanceRef.current.update();
        }
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      
      // Clean up Firebase app
      if (firebaseAppRef.current) {
        deleteApp(firebaseAppRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-600">
            Real-Time Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas 
            ref={chartRef} 
            id="performanceChart" 
            className="w-full h-[400px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;