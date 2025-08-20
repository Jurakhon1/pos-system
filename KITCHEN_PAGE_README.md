# Kitchen Page - Admin Panel

## Overview
The Kitchen page is a new addition to the admin panel that allows administrators to manage kitchen stations for the restaurant system.

## Features

### Kitchen Station Management
- **Create** new kitchen stations (e.g., Hot Kitchen, Cold Kitchen, Bar)
- **Edit** existing station details (name, description, active status)
- **Delete** stations with confirmation
- **View** station information including assigned menu items

### User Interface
- **Search** functionality to find stations by name or description
- **Grid layout** displaying station cards with key information
- **Modal forms** for creating and editing stations
- **Responsive design** that works on desktop and mobile devices

### Data Structure
Each kitchen station includes:
- Unique ID
- Location ID (for multi-location restaurants)
- Station name
- Description (optional)
- Active status
- Creation date
- Associated menu items

## File Structure

```
pos-system/src/
├── app/admin/kitchen/
│   └── page.tsx                 # Main kitchen page component
├── entities/kitchen/
│   ├── api/
│   │   └── kitchenApi.ts       # API functions for kitchen operations
│   ├── hooks/
│   │   └── useKitchen.ts       # React hooks for kitchen state management
│   └── index.ts                 # Exports for kitchen entity
```

## API Integration

The kitchen page integrates with the backend kitchen API endpoints:
- `GET /kitchen/stations` - Fetch all stations
- `POST /kitchen/stations` - Create new station
- `PATCH /kitchen/stations/:id` - Update station
- `DELETE /kitchen/stations/:id` - Delete station
- `POST /kitchen/stations/:id/assign-menu-item` - Assign menu item to station

## Usage

### Accessing the Kitchen Page
1. Navigate to `/admin` in the application
2. Click on the "Кухня" (Kitchen) card in the admin sections
3. Or directly navigate to `/admin/kitchen`

### Creating a New Station
1. Click the "Новая станция" (New Station) button
2. Fill in the station name (required)
3. Add an optional description
4. Set the active status
5. Click "Создать" (Create)

### Editing a Station
1. Click the "Изменить" (Edit) button on any station card
2. Modify the station details
3. Click "Сохранить" (Save)

### Deleting a Station
1. Click the trash icon on any station card
2. Confirm the deletion in the confirmation modal
3. Click "Удалить" (Delete)

## Technical Details

### State Management
- Uses React hooks for local state management
- Implements loading states for all operations
- Handles errors gracefully with user-friendly messages

### Form Validation
- Required field validation for station names
- Form state management with controlled inputs
- Proper form reset on modal open/close

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Grid layout that adapts to screen size
- Touch-friendly buttons and interactions

## Future Enhancements

Potential improvements for the kitchen page:
- **Menu item assignment** - Drag and drop interface for assigning menu items to stations
- **Station performance metrics** - Cooking time, order volume, etc.
- **Real-time updates** - WebSocket integration for live kitchen status
- **Station capacity management** - Limit concurrent orders per station
- **Kitchen workflow automation** - Automatic order routing to appropriate stations

## Dependencies

- **React 19** - Core framework
- **Next.js 15** - Full-stack framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client for API calls

## Browser Support

The kitchen page supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing

To test the kitchen page:
1. Start the development server: `npm run dev`
2. Navigate to `/admin/kitchen`
3. Test CRUD operations for kitchen stations
4. Verify responsive behavior on different screen sizes
5. Test error handling with network issues
