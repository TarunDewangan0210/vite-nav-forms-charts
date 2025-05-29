# Data Flow Diagram - Check-in App

## Overview
This document describes the data flow patterns within the Check-in App, showing how data moves through the application from user input to storage and visualization.

## High-Level Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───▶│    Form     │───▶│   Storage   │───▶│  Dashboard  │
│ Interaction │    │ Validation  │    │ (LocalDB)   │    │   Charts    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   ▼                   ▼                   ▼
       │            ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
       │            │   Error     │    │    Data     │    │   Visual    │
       │            │  Messages   │    │ Processing  │    │  Updates    │
       │            └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                                    Feedback Loop
```

## Detailed Data Flow Patterns

### 1. Form Submission Flow

```
User Input
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FORM COMPONENT                               │
├─────────────────────────────────────────────────────────────────┤
│  1. User fills form fields                                     │
│  2. React Hook Form captures input                             │
│  3. Real-time validation occurs                                │
│  4. Error states update UI                                     │
└─────────────────────────────────────────────────────────────────┘
    ↓ (on submit)
┌─────────────────────────────────────────────────────────────────┐
│                   VALIDATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  1. Required field validation                                  │
│  2. Type checking (stress/morale levels)                       │
│  3. Conditional validation (stress reason)                     │
│  4. Data sanitization                                          │
└─────────────────────────────────────────────────────────────────┘
    ↓ (if valid)
┌─────────────────────────────────────────────────────────────────┐
│                   DATA PROCESSING                              │
├─────────────────────────────────────────────────────────────────┤
│  1. Generate unique ID                                         │
│  2. Add timestamp                                              │
│  3. Structure data as CheckIn object                           │
│  4. Prepare for storage                                        │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   STORAGE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  1. Retrieve existing check-ins                                │
│  2. Append new check-in                                        │
│  3. Save to localStorage                                       │
│  4. Handle storage errors                                      │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   NAVIGATION                                   │
├─────────────────────────────────────────────────────────────────┤
│  1. Reset form state                                           │
│  2. Navigate to table view                                     │
│  3. Trigger data refresh                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Data Retrieval Flow

```
Component Mount/Update
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   COMPONENT LIFECYCLE                          │
├─────────────────────────────────────────────────────────────────┤
│  1. useEffect hook triggers                                    │
│  2. Component requests data                                    │
│  3. Loading state activated                                    │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   STORAGE ACCESS                               │
├─────────────────────────────────────────────────────────────────┤
│  1. getCheckIns() function called                              │
│  2. localStorage.getItem() executed                            │
│  3. JSON parsing with error handling                           │
│  4. Return array of CheckIn objects                            │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATA PROCESSING                              │
├─────────────────────────────────────────────────────────────────┤
│  For Table: Direct display                                     │
│  For Dashboard: Process into chart data                        │
│    • Group by date                                             │
│    • Calculate averages                                        │
│    • Sort chronologically                                      │
│    • Format for visualization                                  │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   STATE UPDATE                                 │
├─────────────────────────────────────────────────────────────────┤
│  1. setState with processed data                               │
│  2. Component re-renders                                       │
│  3. UI updates with new data                                   │
│  4. Loading state deactivated                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Chart Data Flow

```
Raw Check-in Data
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATA AGGREGATION                             │
├─────────────────────────────────────────────────────────────────┤
│  processStressData() / processMoraleData()                     │
│    ↓                                                           │
│  1. Group check-ins by date                                    │
│  2. Calculate average stress/morale per day                    │
│  3. Create ChartData objects                                   │
│  4. Sort by date ascending                                     │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   CHART RENDERING                              │
├─────────────────────────────────────────────────────────────────┤
│  LineChart Component                                           │
│    ↓                                                           │
│  1. Create scales (time, linear)                               │
│  2. Generate SVG paths                                         │
│  3. Render axes and grid                                       │
│  4. Apply responsive sizing                                    │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   INTERACTIVE FEATURES                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Toggle between stress/morale                               │
│  2. Responsive chart resizing                                  │
│  3. Real-time updates on new data                              │
│  4. Statistics calculation                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Theme Management Flow

```
Theme Selection
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   THEME CONTEXT                                │
├─────────────────────────────────────────────────────────────────┤
│  1. User selects theme from dropdown                           │
│  2. setTheme() function called                                 │
│  3. Theme state updated in context                             │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   PERSISTENCE                                  │
├─────────────────────────────────────────────────────────────────┤
│  1. Save theme to localStorage                                 │
│  2. Set data-theme attribute on document                       │
│  3. CSS variables update automatically                         │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   UI UPDATE                                    │
├─────────────────────────────────────────────────────────────────┤
│  1. All components re-render with new theme                    │
│  2. CSS transitions provide smooth changes                     │
│  3. Charts update colors dynamically                           │
└─────────────────────────────────────────────────────────────────┘
```

### 5. CSV Export Flow

```
Export Request
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DATA PREPARATION                             │
├─────────────────────────────────────────────────────────────────┤
│  1. Get all check-ins from storage                             │
│  2. Define CSV headers                                         │
│  3. Map data to CSV format                                     │
│  4. Handle special characters and quotes                       │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FILE GENERATION                              │
├─────────────────────────────────────────────────────────────────┤
│  1. Create CSV content string                                  │
│  2. Generate Blob object                                       │
│  3. Create download URL                                        │
│  4. Generate filename with timestamp                           │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   DOWNLOAD TRIGGER                             │
├─────────────────────────────────────────────────────────────────┤
│  1. Create temporary anchor element                            │
│  2. Set download attributes                                    │
│  3. Programmatically click link                                │
│  4. Clean up temporary elements                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Models

### CheckIn Interface
```typescript
interface CheckIn {
  id: string;           // Unique identifier
  name: string;         // User name
  date: string;         // Check-in date
  activitiesSince: string;     // Activities since last check-in
  activitiesPlanned: string;   // Planned activities
  blockers: string;     // Blockers or help needed
  stressLevel: number;  // 1-5 stress rating
  whyStressed?: string; // Optional stress explanation
  moraleLevel: number;  // 1-5 morale rating
  timestamp: number;    // Creation timestamp
}
```

### ChartData Interface
```typescript
interface ChartData {
  date: string;         // Date for x-axis
  value: number;        // Average value for y-axis
}
```

## Error Handling Flow

```
Error Occurrence
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ERROR DETECTION                              │
├─────────────────────────────────────────────────────────────────┤
│  • Form validation errors                                      │
│  • Storage access errors                                       │
│  • Data processing errors                                      │
│  • Component rendering errors                                  │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   ERROR HANDLING                               │
├─────────────────────────────────────────────────────────────────┤
│  1. Try-catch blocks capture errors                            │
│  2. Error messages logged to console                           │
│  3. User-friendly messages displayed                           │
│  4. Graceful degradation implemented                           │
└─────────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────────┐
│                   RECOVERY ACTIONS                             │
├─────────────────────────────────────────────────────────────────┤
│  • Form: Show validation errors                                │
│  • Storage: Fallback to empty state                            │
│  • Charts: Show "No data" message                              │
│  • Navigation: Maintain app functionality                      │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Considerations

### Data Flow Optimizations

1. **Memoization**: Chart data processing is memoized to prevent unnecessary recalculations
2. **Lazy Loading**: Components load data only when needed
3. **Debouncing**: Form validation is debounced to reduce processing
4. **Efficient Updates**: Only affected components re-render on state changes

### Memory Management

1. **Cleanup**: Event listeners and subscriptions are properly cleaned up
2. **Garbage Collection**: Temporary objects are released promptly
3. **Storage Limits**: LocalStorage usage is monitored and managed
4. **Component Lifecycle**: Proper mounting and unmounting procedures 