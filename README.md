# Check-in App

A comprehensive React TypeScript application for team check-ins with data visualization and theme switching capabilities.

## Features

### 🚀 Core Functionality
- **Check-in Form**: Submit team check-ins with stress and morale levels
- **Data Table**: View all check-ins in a responsive table format
- **Dashboard**: Visualize stress and morale trends over time
- **CSV Export**: Export check-in data for offline analysis

### 🎨 User Experience
- **Theme Switching**: Light, Dark, and Blue themes
- **Responsive Design**: Optimized for mobile and desktop
- **Form Validation**: Real-time validation with error messages
- **Conditional Fields**: Additional fields based on stress level

### 📊 Data Visualization
- **Interactive Charts**: Line charts using Visx library
- **Toggle Views**: Switch between stress and morale data
- **Statistics**: Average values, trends, and totals
- **Real-time Updates**: Charts update when new data is submitted

### 🧪 Testing & Quality
- **Unit Tests**: Component and utility function tests
- **Code Coverage**: Track test coverage with Vitest
- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code quality and consistency

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Charts**: Visx (D3-based visualization)
- **UI Components**: Material-UI (MUI)
- **Styling**: CSS with CSS Variables for theming
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite
- **Storage**: Local Storage for data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vite-nav-forms-charts
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation component
│   ├── LineChart.tsx    # Chart visualization component
│   └── *.css           # Component styles
├── pages/              # Page components
│   ├── CheckInTable.tsx # Data table page
│   ├── CheckInForm.tsx  # Form submission page
│   ├── Dashboard.tsx    # Data visualization page
│   └── *.css           # Page styles
├── context/            # React contexts
│   └── ThemeContext.tsx # Theme management
├── utils/              # Utility functions
│   ├── storage.ts      # Local storage operations
│   └── chartData.ts    # Data processing for charts
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── test/               # Test configuration
│   └── setup.ts        # Test setup file
└── App.tsx             # Main application component
```

## Usage

### Submitting a Check-in

1. Navigate to the "Check-in Form" page
2. Fill in the required fields:
   - Name (required)
   - Date (defaults to today)
   - Activities since last check-in
   - Activities planned
   - Blockers or help needed
   - Stress level (1-5, required)
   - Morale level (1-5, required)
3. If stress level is 5, explain why you're stressed
4. Submit the form

### Viewing Data

1. **Table View**: See all check-ins in a sortable table
2. **Dashboard**: View charts and statistics
3. **Export**: Download data as CSV for analysis

### Customization

- **Themes**: Switch between Light, Dark, and Blue themes
- **Responsive**: Works on mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation and screen reader support

## Testing

The application includes comprehensive tests for:

- Component rendering and interaction
- Utility function behavior
- Data storage and retrieval
- Form validation

Run tests with:
```bash
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] User authentication
- [ ] Team management
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Data export to other formats
- [ ] Integration with external tools
- [ ] Real-time collaboration
- [ ] Mobile app version
