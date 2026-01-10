# **App Name**: DavaoCycle

## Core Features:

- E-Bike Discovery & Availability: Real-time map displaying available e-bikes at each station across Davao City malls. Filter by battery level, distance from user, and station capacity. Estimated walking time to nearest available bike.
- QR Code Rental System: Scan QR code on e-bike unit to unlock and start rental. Instant rental confirmation with bike details (ID, battery %, station location). One-tap unlock for seamless experience.
- Live Rental Tracking: Real-time timer showing current rental duration. Dynamic cost calculator displaying running charges (₱120 first hour, ₱50 each subsequent hour). Push notifications at key intervals.
- Payment Integration: Multiple payment options: GCash, PayMaya, credit/debit cards. Digital wallet system for quick checkout. Auto-charge option for seamless extended rentals. Payment history and receipt generation.
- Auto-Lock System with Navigation: Remote bike locking triggered by payment failure or timeout. Automatic navigation to nearest designated parking bay. Push notification with directions and parking bay map. Grace period (5-10 minutes) before lock activation. Unlock after payment confirmation.
- Trip Management: End rental button with final cost summary. Rental history with routes, duration, and costs. Favorite routes and stations. Estimated cost calculator before starting rental.
- User Profile & Settings: Manage payment methods and wallet balance. Personal information and verification status. Notification preferences. Rental statistics and achievements.
- Fleet Management: Real-time overview of all e-bike units with status indicators: Available (green), In-use (blue), Low battery (yellow), Maintenance needed (red), Offline/Lost connection (gray). Individual bike details: location (GPS), battery level, mileage, last service date. Maintenance scheduling and service history. Bike assignment to specific stations.
- Live Rental Monitoring: Active rentals dashboard showing: Renter name and contact, Bike ID and current location, Rental duration (live timer), Current amount owed, Payment status. Filter and search by station, duration, or payment status. Quick actions: send notification, lock bike, end rental.
- Station Management: Add/edit/remove e-bike stations. Set capacity limits per station. View station analytics (usage rates, peak times, revenue). Station-specific bike inventory. Geofencing setup for designated parking bays.
- User Management: Complete renter database with profiles. Payment history and outstanding balances. Dispute resolution tools. User verification status. Ban/suspend problematic users. Communication log (notifications sent, support tickets).
- Payment & Revenue Tracking: Transaction monitoring (completed, pending, failed). Daily/weekly/monthly revenue reports. Payment method breakdown. Outstanding payments dashboard. Refund processing. Export financial reports (CSV, PDF).
- Remote Lock/Unlock Control: Manual override for bike locks. Bulk operations for maintenance. Lock history and audit trail. Emergency unlock for customer support.
- Analytics & Reporting: Usage patterns and trends. Popular stations and routes. Peak hours and seasonal data. Average rental duration. Revenue forecasting. Fleet utilization rates. Battery consumption analytics. Custom date range reports with export.
- Geofencing & Compliance: Define designated parking bay boundaries. Real-time alerts for bikes outside approved zones. Penalty fee automation for improper parking. Map overlay of approved vs. restricted areas.
- Dynamic Pricing Tool: AI-powered tool that adjusts rental pricing based on real-time demand, weather conditions, and e-bike availability. The tool will analyze historical data and current conditions to suggest optimal pricing.
- Predictive Maintenance: Uses machine learning to predict when e-bikes will require maintenance based on usage patterns, sensor data (battery health, mileage), and historical maintenance records.  This tool helps optimize maintenance schedules and reduce downtime.

## Style Guidelines:

- Primary: Electric Blue (#0066FF) - energy, technology, trust
- Secondary: Vibrant Green (#00D084) - eco-friendly, sustainable, "go"
- Accent: Sunset Orange (#FF6B35) - urgency, notifications, warnings
- Background: Clean White (#FFFFFF) with Light Gray (#F5F5F5) sections
- Text: Dark Charcoal (#2C3E50) for readability
- Headlines/Titles: 'Poppins' Bold - modern, friendly, tech-forward
- Body Text: 'Inter' Regular - exceptional mobile readability, clean
- Numbers/Data: 'Roboto Mono' - clear for pricing and timers
- Icons: Line-based with rounded edges, 2px stroke weight
- Map Interface: Primary focus on customer app home screen
- Bottom Navigation: Easy thumb access (Discover, Active Ride, Wallet, Profile)
- CTAs: Large, high-contrast buttons with clear action labels
- Cards: Subtle shadows (0 2px 8px rgba(0,0,0,0.1)), 12px border radius
- Status Indicators: Color-coded badges with icons
- Animations: Smooth transitions (200-300ms), loading spinners for data fetch