export const COLLECTIONS = {
    WATER_QUALITY: 'WaterQualityData',
    DISEASE_OUTBREAKS: 'DiseaseOutbreaks',
    FISH_PONDS: 'FishPonds',
    ALERTS: 'Alerts'
  };
  
  export const SCHEMAS = {
    waterQuality: {
      location: {
        type: 'string',
        required: true
      },
      pH: {
        type: 'number',
        required: true,
        min: 0,
        max: 14
      },
      temperature: {
        type: 'number',
        required: true
      },
      oxygenLevel: {
        type: 'number',
        required: true
      },
      salinity: {
        type: 'number',
        // required: true
      },
      timestamp: {
        type: 'timestamp',
        // required: true,
        default: 'serverTimestamp'
      },
      lastUpdatedBy: {
        type: 'string',
        required: true
      },
      status: {
        type: 'string',
        enum: ['normal', 'warning', 'critical'],
        // required: true
      }
    },
  
    diseaseOutbreak: {
      location: {
        type: 'string',
        required: true
      },
      diseaseName: {
        type: 'string',
        required: true
      },
      severity: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        required: true
      },
      affectedSpecies: {
        type: 'string',
        required: true
      },
      dateReported: {
        type: 'timestamp',
        required: true,
        default: 'serverTimestamp'
      },
      status: {
        type: 'string',
        enum: ['active', 'contained', 'resolved'],
        required: true
      },
      symptoms: {
        type: 'array',
        // required: true
      },
      treatments: {
        type: 'array',
        // required: true
      }
    },
  
    fishPond: {
      name: {
        type: 'string',
        required: true
      },
      location: {
        type: 'string',
        required: true
      },
      size: {
        type: 'number',
        required: true
      },
      depth: {
        type: 'number',
        // required: true
      },
      fishSpecies: {
        type: 'array',
        required: true
      },
      currentPopulation: {
        type: 'number',
        required: true
      },
      lastMaintenance: {
        type: 'timestamp',
        required: true
      }
    }
  };