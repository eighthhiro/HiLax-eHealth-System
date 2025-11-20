# JavaScript File Segregation - Structure Documentation

## New File Organization

### Directory Structure
```
js/
├── content/
│   ├── shared-content.js         # Common content for all roles
│   ├── admin-content.js          # HR/Admin specific content
│   ├── physician-content.js      # Physician specific content
│   ├── nurse-content.js          # Nurse specific content
│   ├── pharmacist-content.js     # Pharmacist specific content
│   ├── medtech-content.js        # MedTech specific content
│   ├── radtech-content.js        # RadTech specific content
│   └── content-factory.js        # Routes to appropriate content module
├── role-config.js                # Role permissions and menu configuration
├── content-generator.js          # Legacy file (can be deprecated)
└── dashboard.js                  # Main dashboard controller
```

## Module Descriptions

### 1. Shared Content (`shared-content.js`)
**Purpose**: Contains content that is shared across multiple roles
**Contents**:
- `getAllPatientsContent()` - Patient list/record view
- `getPrescriptionsContent()` - Prescriptions management
- `getDefaultContent()` - Placeholder for unimplemented pages

### 2. Admin Content (`admin-content.js`)
**Purpose**: Content specific to HR/Admin role
**Contents**:
- `getDashboardContent()` - Admin dashboard with hospital statistics
- `getAllStaffContent()` - Organizational hierarchy tree
- `getBentoBanner()` - Mission/Vision/Philosophy banner

**Features**:
- Full patient management access
- Staff hierarchy with 22 employees
- All department oversight
- Add Staff button with approval tooltip

### 3. Physician Content (`physician-content.js`)
**Purpose**: Content specific to Physician role
**Contents**:
- `getDashboardContent()` - Physician dashboard
- Statistics: My Patients (42), Appointments (8), Prescriptions (67), Pending Results (12)

### 4. Nurse Content (`nurse-content.js`)
**Purpose**: Content specific to Nurse role
**Contents**:
- `getDashboardContent()` - Nurse dashboard
- Statistics: Assigned Patients (15), Vital Signs (28), Medications (45), Tasks (7)

### 5. Pharmacist Content (`pharmacist-content.js`)
**Purpose**: Content specific to Pharmacist role
**Contents**:
- `getDashboardContent()` - Pharmacist dashboard
- Statistics: Pending Prescriptions (23), Dispensed Today (87), Low Stock (12), Verified (234)

### 6. MedTech Content (`medtech-content.js`)
**Purpose**: Content specific to Medical Technologist role
**Contents**:
- `getDashboardContent()` - MedTech dashboard
- Statistics: Pending Tests (18), Completed Today (45), In Progress (7), Critical Results (3)

### 7. RadTech Content (`radtech-content.js`)
**Purpose**: Content specific to Radiologic Technologist role
**Contents**:
- `getDashboardContent()` - RadTech dashboard
- Statistics: Pending Scans (9), Completed Today (22), Awaiting Report (14), Scheduled (16)

### 8. Content Factory (`content-factory.js`)
**Purpose**: Factory pattern to instantiate correct content module based on role
**Methods**:
- `initializeRoleContent()` - Creates role-specific content instance
- `getDashboardContent()` - Routes to role-specific dashboard
- `getAllPatientsContent()` - Routes to shared patient content
- `getAllStaffContent()` - Routes to admin staff hierarchy
- `getPrescriptionsContent()` - Routes to shared prescriptions
- `getDefaultContent()` - Routes to default placeholder

**Pattern**:
```javascript
const contentFactory = new ContentFactory(currentUser);
const dashboardHTML = contentFactory.getDashboardContent(); // Role-specific
const patientsHTML = contentFactory.getAllPatientsContent(); // Shared
```

## Integration

### Dashboard.html
Updated script includes in order:
```html
<script src="./js/role-config.js"></script>
<script src="./js/content/shared-content.js"></script>
<script src="./js/content/admin-content.js"></script>
<script src="./js/content/physician-content.js"></script>
<script src="./js/content/nurse-content.js"></script>
<script src="./js/content/pharmacist-content.js"></script>
<script src="./js/content/medtech-content.js"></script>
<script src="./js/content/radtech-content.js"></script>
<script src="./js/content/content-factory.js"></script>
<script src="./js/content-generator.js"></script>
<script src="./js/dashboard.js"></script>
```

### Dashboard.js
Changed initialization:
```javascript
// OLD:
this.contentGenerator = new ContentGenerator(this.currentUser);

// NEW:
this.contentGenerator = new ContentFactory(this.currentUser);
```

## Benefits

1. **Separation of Concerns**: Each role has its own module
2. **Easier Maintenance**: Update one role without affecting others
3. **Scalability**: Add new roles by creating new content modules
4. **Code Organization**: Related content grouped together
5. **Better Collaboration**: Multiple developers can work on different role modules
6. **Reduced File Size**: Smaller, focused files instead of one large file

## Future Development

### Adding a New Role:
1. Create `js/content/newrole-content.js`
2. Add class with `getDashboardContent()` method
3. Update `content-factory.js` switch statement
4. Add script tag to `dashboard.html`
5. Update `role-config.js` with permissions

### Example New Role Template:
```javascript
class NewRoleContent {
    constructor(currentUser) {
        this.currentUser = currentUser;
    }

    getDashboardContent() {
        return `
            <div class="dashboard-overview">
                <!-- Role-specific dashboard content -->
            </div>
        `;
    }

    getBentoBanner() {
        return `<!-- Mission/Vision/Philosophy -->`;
    }
}
```

## Migration Notes

- `content-generator.js` can be deprecated once all roles are migrated
- Current implementation maintains backward compatibility
- All existing functionality preserved
- No breaking changes to dashboard.js interface

## Testing Checklist

- [ ] Admin dashboard loads correctly
- [ ] Physician dashboard shows correct statistics
- [ ] Nurse dashboard loads
- [ ] Pharmacist dashboard loads
- [ ] MedTech dashboard loads
- [ ] RadTech dashboard loads
- [ ] All Patients page works for all roles
- [ ] Staff hierarchy shows for Admin
- [ ] Prescriptions page accessible to appropriate roles
- [ ] Patient role sees only their own record
