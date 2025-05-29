# Component Diagram - Check-in App

## Overview
This document provides a detailed view of the component structure and relationships within the Check-in App, showing how components interact and depend on each other.

## Component Hierarchy

```
App
├── ThemeProvider (Context Provider)
│   └── Router (BrowserRouter)
│       ├── Navigation (Global Component)
│       │   ├── NavBrand
│       │   ├── NavToggle (Mobile)
│       │   ├── NavMenu
│       │   │   ├── NavLinks
│       │   │   └── ThemeSelector
│       │   └── Navigation.css
│       └── Routes
│           ├── Route: "/" → CheckInTable
│           │   ├── TableHeader
│           │   │   ├── Title
│           │   │   └── ExportButton
│           │   ├── TableWrapper
│           │   │   └── CheckInTable
│           │   │       ├── TableHead
│           │   │       └── TableBody
│           │   │           └── TableRow[]
│           │   ├── EmptyState
│           │   └── CheckInTable.css
│           ├── Route: "/form" → CheckInForm
│           │   ├── FormHeader
│           │   ├── Form
│           │   │   ├── FormGroup[]
│           │   │   │   ├── Label
│           │   │   ├── Input/Select/Textarea
│           │   │   └── ErrorMessage
│           │   ├── ConditionalField (Why Stressed)
│           │   ├── FormActions
│           │   │   ├── ResetButton
│           │   │   └── SubmitButton
│           │   └── CheckInForm.css
│           └── Route: "/dashboard" → Dashboard
│               ├── DashboardHeader
│               ├── DashboardControls
│               │   └── MUI Switch
│               ├── EmptyDashboard
│               ├── StatsGrid
│               │   └── StatCard[]
│               ├── ChartContainer
│               │   └── LineChart
│               │       ├── ParentSize (Visx)
│               │       └── LineChartInner
│               │           ├── SVG
│               │           ├── Group (Visx)
│               │           ├── GridRows (Visx)
│               │           ├── GridColumns (Visx)
│               │           ├── LinePath (Visx)
│               │           ├── AxisBottom (Visx)
│               │           └── AxisLeft (Visx)
│               └── Dashboard.css
```

## Component Details

### Core Components

#### 1. App Component
```typescript
// Root application component
interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<CheckInTable />} />
              <Route path="/form" element={<CheckInForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};
```

**Dependencies:**
- ThemeProvider (Context)
- Router (React Router)
- Navigation (Component)
- Page Components

**Responsibilities:**
- Application initialization
- Global layout structure
- Route configuration
- Theme provider setup

#### 2. ThemeProvider Component
```typescript
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Dependencies:**
- React Context API
- localStorage
- Theme types

**Responsibilities:**
- Theme state management
- Theme persistence
- CSS variable updates
- Context provision

#### 3. Navigation Component
```typescript
interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navigation">
      <div className="nav-container">
        <NavBrand />
        <NavToggle onClick={() => setIsMenuOpen(!isMenuOpen)} />
        <NavMenu isOpen={isMenuOpen}>
          <NavLinks currentPath={location.pathname} />
          <ThemeSelector theme={theme} onThemeChange={setTheme} />
        </NavMenu>
      </div>
    </nav>
  );
};
```

**Dependencies:**
- useTheme hook
- useLocation hook
- React Router Link

**Responsibilities:**
- Application navigation
- Theme selection
- Mobile menu handling
- Active route highlighting

### Page Components

#### 4. CheckInTable Component
```typescript
interface CheckInTableProps {}

const CheckInTable: React.FC<CheckInTableProps> = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  useEffect(() => {
    setCheckIns(getCheckIns());
  }, []);

  return (
    <div className="check-in-table-container">
      <TableHeader onExport={() => exportToCSV(checkIns)} />
      {checkIns.length === 0 ? (
        <EmptyState />
      ) : (
        <TableWrapper>
          <CheckInDataTable checkIns={checkIns} />
        </TableWrapper>
      )}
    </div>
  );
};
```

**Dependencies:**
- getCheckIns utility
- exportToCSV utility
- CheckIn types

**Responsibilities:**
- Data retrieval and display
- CSV export functionality
- Empty state handling
- Responsive table rendering

#### 5. CheckInForm Component
```typescript
interface CheckInFormProps {}

const CheckInForm: React.FC<CheckInFormProps> = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const stressLevel = watch('stressLevel');

  const onSubmit = (data: FormData) => {
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      ...data,
      timestamp: Date.now()
    };
    saveCheckIn(checkIn);
    navigate('/');
  };

  return (
    <div className="check-in-form-container">
      <FormHeader />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormFields register={register} errors={errors} />
        <ConditionalField show={Number(stressLevel) === 5} />
        <FormActions onReset={() => reset()} />
      </form>
    </div>
  );
};
```

**Dependencies:**
- React Hook Form
- useNavigate hook
- saveCheckIn utility
- Form validation

**Responsibilities:**
- Form state management
- Input validation
- Data submission
- Navigation after submit

#### 6. Dashboard Component
```typescript
interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [showMorale, setShowMorale] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    setCheckIns(getCheckIns());
  }, []);

  useEffect(() => {
    const data = showMorale 
      ? processMoraleData(checkIns) 
      : processStressData(checkIns);
    setChartData(data);
  }, [checkIns, showMorale]);

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <DashboardControls 
        showMorale={showMorale} 
        onToggle={setShowMorale} 
      />
      {checkIns.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <>
          <StatsGrid data={chartData} showMorale={showMorale} />
          <ChartContainer>
            <LineChart data={chartData} title={getChartTitle(showMorale)} />
          </ChartContainer>
        </>
      )}
    </div>
  );
};
```

**Dependencies:**
- getCheckIns utility
- processStressData/processMoraleData utilities
- LineChart component
- Material-UI Switch

**Responsibilities:**
- Data aggregation and processing
- Chart data management
- Statistics calculation
- View toggling (stress/morale)

### Utility Components

#### 7. LineChart Component
```typescript
interface LineChartProps {
  data: ChartData[];
  title: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color }) => {
  return (
    <ParentSize>
      {({ width, height }) => (
        <LineChartInner 
          data={data} 
          title={title} 
          color={color} 
          width={width} 
          height={height} 
        />
      )}
    </ParentSize>
  );
};

const LineChartInner: React.FC<LineChartProps & SizeProps> = ({
  data, title, color, width, height
}) => {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const dateScale = scaleTime({
    range: [0, xMax],
    domain: extent(data, d => new Date(d.date))
  });

  const valueScale = scaleLinear({
    range: [yMax, 0],
    domain: [1, 5]
  });

  return (
    <div>
      <h3>{title}</h3>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={valueScale} width={xMax} height={yMax} />
          <GridColumns scale={dateScale} width={xMax} height={yMax} />
          <LinePath
            data={data}
            x={d => dateScale(new Date(d.date))}
            y={d => valueScale(d.value)}
            stroke={color}
            strokeWidth={2}
            curve={curveMonotoneX}
          />
          <AxisBottom top={yMax} scale={dateScale} />
          <AxisLeft scale={valueScale} />
        </Group>
      </svg>
    </div>
  );
};
```

**Dependencies:**
- Visx components (Group, LinePath, etc.)
- D3 scales and utilities
- ParentSize for responsiveness

**Responsibilities:**
- Chart rendering and visualization
- Responsive sizing
- Data scaling and axis generation
- Interactive chart features

## Component Relationships

### Data Flow Relationships

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CheckInForm   │───▶│   Storage Utils │───▶│  CheckInTable   │
│                 │    │                 │    │                 │
│ • Form Input    │    │ • saveCheckIn() │    │ • Data Display  │
│ • Validation    │    │ • getCheckIns() │    │ • Export CSV    │
│ • Submission    │    │ • exportToCSV() │    │ • Table View    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │    Dashboard    │
                       │                 │
                       │ • Data Viz      │
                       │ • Statistics    │
                       │ • Chart Toggle  │
                       └─────────────────┘
```

### Context Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    ThemeProvider                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Navigation  │  │ CheckInForm │  │  Dashboard  │         │
│  │             │  │             │  │             │         │
│  │ useTheme()  │  │ useTheme()  │  │ useTheme()  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │CheckInTable │  │  LineChart  │  │   Styles    │         │
│  │             │  │             │  │             │         │
│  │ useTheme()  │  │ CSS Vars    │  │ CSS Vars    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### Router Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      BrowserRouter                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                                           │
│  │ Navigation  │                                           │
│  │             │                                           │
│  │ • Link      │                                           │
│  │ • useLocation                                           │
│  └─────────────┘                                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Routes    │  │   Routes    │  │   Routes    │         │
│  │             │  │             │  │             │         │
│  │ "/" →       │  │ "/form" →   │  │"/dashboard"→│         │
│  │CheckInTable │  │CheckInForm  │  │ Dashboard   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐                                           │
│  │CheckInForm  │                                           │
│  │             │                                           │
│  │ useNavigate │                                           │
│  └─────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Communication Patterns

### 1. Props Down, Events Up
```typescript
// Parent passes data down
<LineChart 
  data={chartData} 
  title="Stress Levels" 
  color="#ef4444" 
/>

// Child emits events up
<ExportButton 
  onClick={() => exportToCSV(checkIns)} 
  disabled={checkIns.length === 0}
/>
```

### 2. Context for Global State
```typescript
// Provider at top level
<ThemeProvider>
  <App />
</ThemeProvider>

// Consumer anywhere in tree
const { theme, setTheme } = useTheme();
```

### 3. Custom Hooks for Logic
```typescript
// Reusable logic extraction
const useCheckIns = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  
  useEffect(() => {
    setCheckIns(getCheckIns());
  }, []);
  
  const addCheckIn = (checkIn: CheckIn) => {
    saveCheckIn(checkIn);
    setCheckIns(prev => [...prev, checkIn]);
  };
  
  return { checkIns, addCheckIn };
};
```

### 4. Higher-Order Components
```typescript
// Responsive wrapper
const ResponsiveLineChart = withResponsiveContainer(LineChart);

// Usage
<ResponsiveLineChart data={chartData} title="Chart" />
```

## Component Testing Strategy

### Unit Testing Approach

#### 1. Component Rendering Tests
```typescript
describe('Navigation', () => {
  test('renders navigation brand', () => {
    render(<NavigationWrapper />);
    expect(screen.getByText('Check-in App')).toBeInTheDocument();
  });
});
```

#### 2. Interaction Tests
```typescript
test('theme selector changes theme', () => {
  render(<NavigationWrapper />);
  const themeSelect = screen.getByLabelText('Theme:');
  fireEvent.change(themeSelect, { target: { value: 'dark' } });
  expect(themeSelect).toHaveValue('dark');
});
```

#### 3. Integration Tests
```typescript
test('form submission creates check-in', () => {
  render(<CheckInFormWrapper />);
  // Fill form
  // Submit
  // Verify navigation
  // Verify data storage
});
```

### Component Mocking

#### 1. Context Mocking
```typescript
const mockThemeContext = {
  theme: 'light' as Theme,
  setTheme: jest.fn()
};

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => mockThemeContext
}));
```

#### 2. Router Mocking
```typescript
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));
```

#### 3. Utility Mocking
```typescript
jest.mock('../utils/storage', () => ({
  getCheckIns: jest.fn(() => []),
  saveCheckIn: jest.fn(),
  exportToCSV: jest.fn()
}));
```

## Performance Considerations

### Component Optimization

#### 1. Memoization
```typescript
// Expensive calculations
const chartData = useMemo(() => {
  return processChartData(checkIns, showMorale);
}, [checkIns, showMorale]);

// Component memoization
export default React.memo(LineChart);
```

#### 2. Callback Optimization
```typescript
const handleSubmit = useCallback((data: FormData) => {
  saveCheckIn(data);
  navigate('/');
}, [navigate]);
```

#### 3. Lazy Loading
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CheckInForm = lazy(() => import('./pages/CheckInForm'));
```

### Bundle Optimization

#### 1. Code Splitting
- Route-based splitting
- Component-based splitting
- Library splitting

#### 2. Tree Shaking
- ES6 module imports
- Unused code elimination
- Library optimization

#### 3. Asset Optimization
- Image compression
- Font optimization
- CSS minification 