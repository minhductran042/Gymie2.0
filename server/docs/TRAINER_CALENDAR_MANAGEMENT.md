# 🗓️ Trainer Calendar Management System

## 📋 Workflow Yêu Cầu

### **User Story:**
> Trainer sau khi đồng ý với client, sẽ liên hệ và trainer có thể sắp xếp lịch riêng với client rồi nhập lên app để trainer có thể quản lí được lịch của chính mình

---

## 🔄 Complete Flow

### **Phase 1: Match Process**
```
1. Client browses trainers
2. Client sends request → TrainerClient(PENDING)
3. Trainer receives notification
4. Trainer reviews client profile
5. Trainer ACCEPTS → TrainerClient(MATCHED)
   OR Trainer REJECTS → TrainerClient(REJECTED)
```

### **Phase 2: Schedule Coordination** 🎯
```
6. Trainer contacts client (chat/phone/in-app)
7. They discuss:
   - Goals & expectations
   - Schedule preferences
   - Package selection
   - Meeting location
8. Trainer creates booking in app
   → TrainerBooking(CONFIRMED)
9. Client receives confirmation notification
```

### **Phase 3: Calendar Management** 🎯
```
10. Trainer views calendar:
    - Daily/Weekly/Monthly view
    - All bookings with all clients
    - Conflicts highlighted
    
11. Trainer can:
    - Create new bookings
    - Reschedule bookings
    - Cancel bookings
    - Mark as completed/no-show
    - Add notes after session
    
12. System tracks:
    - Session count (auto-increment)
    - Package progress (3/10 sessions done)
    - Payment status per session
```

---

## 📊 Current Schema Analysis

### **TrainerBooking (Current):**
```prisma
model TrainerBooking {
  id           Int           @id @default(autoincrement())
  trainerId    Int
  clientId     Int
  startTime    DateTime
  endTime      DateTime
  status       BookingStatus @default(PENDING)
  sessionType  String?       // "Personal Training", "Group Class"
  notes        String?
  price        Float?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?

  trainer Trainer @relation(...)
  client  User    @relation(...)

  @@index([trainerId, startTime])
  @@index([clientId, startTime])
  @@index([status, startTime])
}
```

### ✅ **What's Good:**
- Basic booking info (trainer, client, time, status)
- Indexes for calendar queries
- Price tracking
- Soft delete support

### ❌ **What's Missing:**

#### 1. **Link to TrainerClient Relationship** 🔴 CRITICAL
```prisma
trainerClientId Int?  // Which contract is this session for?
```

**Problem without it:**
```typescript
// Trainer có 5 clients, mỗi client có package 10 sessions
// Làm sao biết session này thuộc contract nào?
// Làm sao track 3/10 sessions completed?

Booking 1: trainerId=1, clientId=5 → Which contract? ❌
Booking 2: trainerId=1, clientId=5 → Same client, same contract? ❌
```

**Solution:**
```typescript
Booking 1: trainerClientId=10 → Contract with Alice (package 10 sessions)
Booking 2: trainerClientId=10 → Same contract, session 2/10
Booking 3: trainerClientId=15 → Different contract with Bob
```

---

#### 2. **Recurring Sessions** 🟡 IMPORTANT
```prisma
isRecurring     Boolean  @default(false)
recurrenceRule  String?  // "WEEKLY:MON,WED,FRI" or iCal format
parentBookingId Int?     // Original booking if this is recurrence
```

**Use Case:**
```
Trainer: "Mình train với bạn 3 buổi/tuần, Thứ 2-4-6, 6pm-7pm, 12 weeks"
→ Tạo 1 booking template
→ Generate 36 bookings automatically
→ Client thấy full schedule
```

**Without it:**
- Trainer phải tạo 36 bookings manually ❌
- Tedious, error-prone
- No bulk operations (cancel all, reschedule all)

---

#### 3. **Session Tracking** 🟡 IMPORTANT
```prisma
sessionNumber   Int?      // 1, 2, 3, ..., 10 (if package has 10 sessions)
completedAt     DateTime? // When marked complete (vs. scheduled time)
```

**Use Case:**
```
TrainerClient: packageType="10 sessions", totalSessions=10
Booking 1: sessionNumber=1, completedAt=2025-01-15 → Done ✅
Booking 2: sessionNumber=2, completedAt=null      → Upcoming
Booking 3: sessionNumber=3, deletedAt != null     → Cancelled

Progress: 1/10 completed, 1 cancelled, 8 remaining
```

---

#### 4. **Cancellation Details** 🟡 IMPORTANT
```prisma
cancelledBy     String?   // "TRAINER" | "CLIENT" | "SYSTEM"
cancelledAt     DateTime?
cancellationReason String?
cancellationFee    Float?   // If cancelled < 24h notice
```

**Use Case:**
```
Client cancels 2 hours before → Fee applies
Trainer cancels → No fee, offer makeup session
System cancels (trainer unavailable) → Auto-reschedule
```

**Analytics:**
- Who cancels more (trainer vs client)?
- Cancellation patterns (which days/times?)
- Revenue lost to cancellations

---

#### 5. **Location Info** 🟢 NICE-TO-HAVE
```prisma
location        String?   // "Gold's Gym District 1" | "Client's Home"
locationAddress String?
meetingLink     String?   // For online sessions
```

**Use Case:**
```
Trainer trains at 3 gyms + online
Booking 1: location="Gold's Gym", locationAddress="123 Main St"
Booking 2: location="Online", meetingLink="https://zoom.us/..."
Booking 3: location="Client's Home", locationAddress="456 Oak Ave"
```

---

#### 6. **Reminder System** 🟢 NICE-TO-HAVE
```prisma
reminderSent    Boolean   @default(false)
reminderSentAt  DateTime?
```

**Use Case:**
```
24 hours before booking:
→ Send reminder to client
→ Send reminder to trainer
→ Mark reminderSent=true
```

**Without it:**
- Manual reminder checking
- Higher no-show rate

---

#### 7. **Payment Per Session** 🟢 NICE-TO-HAVE
```prisma
isPaid          Boolean   @default(false)
paidAt          DateTime?
paymentMethod   String?   // "CASH", "CARD", "BANK_TRANSFER"
```

**Use Case:**
```
Package: Pay per session (not upfront)
Session 1 done → Client pays $50 → isPaid=true
Session 2 done → Client hasn't paid → isPaid=false → Follow up
```

---

## 🎯 Improved Schema

### **Option 1: Enhanced TrainerBooking (Recommended)**

```prisma
model TrainerBooking {
  id           Int           @id @default(autoincrement())
  trainerId    Int
  clientId     Int
  
  // NEW: Link to relationship/contract
  trainerClientId Int?      // Which TrainerClient contract
  
  // Time
  startTime    DateTime
  endTime      DateTime
  
  // Status & Type
  status       BookingStatus @default(PENDING)
  sessionType  String?       // "Personal Training", "Group Class", "Consultation"
  
  // NEW: Session tracking
  sessionNumber   Int?      // 1, 2, 3, ... (for package tracking)
  completedAt     DateTime? // Actual completion time
  
  // NEW: Recurring support
  isRecurring     Boolean  @default(false)
  recurrenceRule  String?  // "WEEKLY:MON,WED,FRI" or iCal RRULE
  parentBookingId Int?     // If this is instance of recurring booking
  
  // NEW: Location
  location        String?  // "Gold's Gym Q1", "Online", "Client's Home"
  locationAddress String?
  meetingLink     String?  // For online sessions
  
  // NEW: Cancellation tracking
  cancelledBy        String?   // "TRAINER" | "CLIENT" | "SYSTEM"
  cancelledAt        DateTime?
  cancellationReason String?
  cancellationFee    Float?
  
  // NEW: Payment per session
  isPaid        Boolean   @default(false)
  paidAt        DateTime?
  paymentMethod String?   // "CASH", "CARD", "BANK_TRANSFER"
  
  // NEW: Reminders
  reminderSent   Boolean   @default(false)
  reminderSentAt DateTime?
  
  // Existing
  notes        String?
  price        Float?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?

  // Relations
  trainer         Trainer        @relation(fields: [trainerId], references: [id], onDelete: Cascade)
  client          User           @relation("TrainerBookings", fields: [clientId], references: [id], onDelete: Cascade)
  trainerClient   TrainerClient? @relation(fields: [trainerClientId], references: [id])
  parentBooking   TrainerBooking? @relation("RecurringBookings", fields: [parentBookingId], references: [id])
  childBookings   TrainerBooking[] @relation("RecurringBookings")

  @@index([trainerId, startTime])
  @@index([clientId, startTime])
  @@index([trainerClientId, sessionNumber])
  @@index([status, startTime])
  @@index([parentBookingId])
  @@index([completedAt])
  @@index([deletedAt])
}
```

### **Update TrainerClient to track bookings:**
```prisma
model TrainerClient {
  // ... existing fields
  
  bookings TrainerBooking[]  // All sessions for this contract
  
  // ... rest stays same
}
```

---

## 🔄 Complete Workflow with Enhanced Schema

### **1. Client Request → Trainer Accept**
```typescript
// Client sends request
const trainerClient = await prisma.trainerClient.create({
  data: {
    trainerId: 1,
    clientId: 5,
    status: 'PENDING',
  },
});

// Trainer accepts
await prisma.trainerClient.update({
  where: { id: trainerClient.id },
  data: { 
    status: 'MATCHED',
    packageType: '10 sessions',
    totalSessions: 10,
    packagePrice: 5000000,
  },
});
```

---

### **2. Trainer Creates Schedule**

#### **Option A: Single Session**
```typescript
// POST /trainer/bookings
await prisma.trainerBooking.create({
  data: {
    trainerId: 1,
    clientId: 5,
    trainerClientId: trainerClient.id,  // ✅ Linked to contract
    startTime: new Date('2025-10-20 18:00'),
    endTime: new Date('2025-10-20 19:00'),
    status: 'CONFIRMED',
    sessionType: 'Personal Training',
    sessionNumber: 1,  // First session of package
    location: 'Gold\'s Gym District 1',
    price: 500000,
    notes: 'Focus on chest & triceps',
  },
});

// Auto-update TrainerClient
await prisma.trainerClient.update({
  where: { id: trainerClient.id },
  data: {
    sessionCount: { increment: 1 },  // 0 → 1
    startDate: new Date('2025-10-20'),
  },
});
```

#### **Option B: Recurring Sessions**
```typescript
// POST /trainer/bookings/recurring
const parentBooking = await prisma.trainerBooking.create({
  data: {
    trainerId: 1,
    clientId: 5,
    trainerClientId: trainerClient.id,
    startTime: new Date('2025-10-20 18:00'),
    endTime: new Date('2025-10-20 19:00'),
    status: 'CONFIRMED',
    isRecurring: true,
    recurrenceRule: 'WEEKLY:MON,WED,FRI',  // 3x/week
    sessionType: 'Personal Training',
    location: 'Gold\'s Gym District 1',
    price: 500000,
  },
});

// Generate child bookings (10 sessions)
const dates = generateRecurringDates(
  new Date('2025-10-20'),
  'WEEKLY:MON,WED,FRI',
  10  // totalSessions
);

for (let i = 0; i < dates.length; i++) {
  await prisma.trainerBooking.create({
    data: {
      trainerId: 1,
      clientId: 5,
      trainerClientId: trainerClient.id,
      parentBookingId: parentBooking.id,  // ✅ Link to parent
      startTime: dates[i],
      endTime: addHours(dates[i], 1),
      status: 'CONFIRMED',
      sessionNumber: i + 1,  // 1, 2, 3, ...
      sessionType: 'Personal Training',
      location: 'Gold\'s Gym District 1',
      price: 500000,
    },
  });
}
```

---

### **3. Trainer Views Calendar**

```typescript
// GET /trainer/calendar?month=2025-10&view=month

const bookings = await prisma.trainerBooking.findMany({
  where: {
    trainerId: 1,
    startTime: {
      gte: new Date('2025-10-01'),
      lt: new Date('2025-11-01'),
    },
    deletedAt: null,
  },
  include: {
    client: {
      select: { name: true, avatar: true },
    },
    trainerClient: {
      select: { 
        packageType: true, 
        totalSessions: true,
        sessionCount: true,  // Progress
      },
    },
  },
  orderBy: { startTime: 'asc' },
});

// Response:
[
  {
    id: 1,
    startTime: '2025-10-20T18:00:00Z',
    endTime: '2025-10-20T19:00:00Z',
    status: 'CONFIRMED',
    sessionNumber: 1,
    client: { name: 'Alice', avatar: '...' },
    trainerClient: {
      packageType: '10 sessions',
      sessionCount: 0,  // Not completed yet
      totalSessions: 10,
    },
    location: 'Gold\'s Gym District 1',
  },
  {
    id: 2,
    startTime: '2025-10-22T18:00:00Z',
    endTime: '2025-10-22T19:00:00Z',
    status: 'CONFIRMED',
    sessionNumber: 2,
    client: { name: 'Alice', avatar: '...' },
    // ...
  },
]
```

**Calendar UI:**
```
October 2025

Mon       Tue       Wed       Thu       Fri       Sat       Sun
                              1         2         3         4
5         6         7         8         9         10        11
12        13        14        15        16        17        18
19        20 📅     21        22 📅     23        24 📅     25
          6pm-7pm             6pm-7pm             6pm-7pm
          Alice               Alice               Alice
          Session 1/10        Session 2/10        Session 3/10

26        27 📅     28        29 📅     30        31
          6pm-7pm             6pm-7pm
          Alice               Alice
          Session 4/10        Session 5/10
```

---

### **4. Trainer Marks Session Complete**

```typescript
// POST /trainer/bookings/:id/complete

const booking = await prisma.trainerBooking.update({
  where: { id: 1 },
  data: {
    status: 'COMPLETED',
    completedAt: new Date(),
    notes: 'Great session! Client benched 80kg.',
  },
});

// Auto-update TrainerClient progress
await prisma.trainerClient.update({
  where: { id: booking.trainerClientId },
  data: {
    sessionCount: { increment: 1 },  // 0 → 1
  },
});

// Check if package completed
const trainerClient = await prisma.trainerClient.findUnique({
  where: { id: booking.trainerClientId },
});

if (trainerClient.sessionCount >= trainerClient.totalSessions) {
  await prisma.trainerClient.update({
    where: { id: trainerClient.id },
    data: {
      status: 'COMPLETED',
      endDate: new Date(),
    },
  });
  
  // Notify client: "Package completed! Leave a review?"
}
```

---

### **5. Trainer Reschedules Session**

```typescript
// PUT /trainer/bookings/:id/reschedule

await prisma.trainerBooking.update({
  where: { id: 1 },
  data: {
    startTime: new Date('2025-10-21 19:00'),  // Changed from 20th to 21st
    endTime: new Date('2025-10-21 20:00'),
    notes: 'Rescheduled - trainer sick on 20th',
  },
});

// Notify client
await notificationService.send({
  userId: booking.clientId,
  title: 'Session Rescheduled',
  message: 'Your session on Oct 20 moved to Oct 21, 7pm',
});
```

---

### **6. Client Cancels Session**

```typescript
// POST /client/bookings/:id/cancel

const now = new Date();
const booking = await prisma.trainerBooking.findUnique({
  where: { id: 1 },
});

const hoursUntilSession = 
  (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

const fee = hoursUntilSession < 24 ? booking.price * 0.5 : 0;

await prisma.trainerBooking.update({
  where: { id: 1 },
  data: {
    status: 'CANCELLED',
    cancelledBy: 'CLIENT',
    cancelledAt: now,
    cancellationReason: 'Client sick',
    cancellationFee: fee,
  },
});

if (fee > 0) {
  // Charge cancellation fee
  await paymentService.charge({
    userId: booking.clientId,
    amount: fee,
    description: 'Late cancellation fee',
  });
}

// Notify trainer
await notificationService.send({
  userId: booking.trainerId,
  title: 'Session Cancelled',
  message: `Alice cancelled session on Oct 20. Fee: ${fee}`,
});
```

---

### **7. No-Show Tracking**

```typescript
// Cron job runs 2 hours after session end time
// Check if booking was completed

const noShows = await prisma.trainerBooking.findMany({
  where: {
    status: 'CONFIRMED',
    endTime: {
      lt: new Date(Date.now() - 2 * 60 * 60 * 1000),  // 2 hours ago
    },
    completedAt: null,
  },
});

for (const booking of noShows) {
  await prisma.trainerBooking.update({
    where: { id: booking.id },
    data: {
      status: 'NO_SHOW',
      cancelledBy: 'SYSTEM',
      cancellationReason: 'Client did not show up',
    },
  });
  
  // Charge full session fee
  await paymentService.charge({
    userId: booking.clientId,
    amount: booking.price,
    description: 'No-show fee',
  });
  
  // Notify both parties
}
```

---

## 📊 Calendar Analytics

### **Trainer Dashboard:**

```typescript
// GET /trainer/dashboard/stats

const stats = await prisma.trainerBooking.groupBy({
  by: ['status'],
  where: {
    trainerId: 1,
    startTime: {
      gte: startOfMonth(new Date()),
      lt: endOfMonth(new Date()),
    },
  },
  _count: true,
});

// Response:
{
  thisMonth: {
    confirmed: 15,
    completed: 8,
    cancelled: 2,
    noShows: 1,
  },
  revenue: {
    earned: 4000000,   // 8 completed * 500k
    pending: 3500000,  // 7 upcoming * 500k
    lost: 500000,      // 1 no-show * 500k
  },
  utilization: '85%',  // 26 hours booked / 30 available hours
}
```

---

## 🎨 UI Screens

### **Screen 1: Trainer Calendar (Main)**
```
┌─────────────────────────────────────────────────┐
│ 📅 My Calendar          [Day][Week][Month] 🔍  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Monday, Oct 20, 2025                          │
│                                                 │
│  09:00 ─────────────────────────────────────   │
│  10:00 ─────────────────────────────────────   │
│  ...                                            │
│  18:00 ═══════════════════════════════════════  │
│        │ 📍 Gold's Gym                         │
│        │ 👤 Alice (Session 1/10)               │
│        │ 💪 Personal Training                  │
│  19:00 └───────────────────────────────────────  │
│  20:00 ─────────────────────────────────────   │
│                                                 │
│  [+ New Booking]                                │
└─────────────────────────────────────────────────┘
```

### **Screen 2: Create Booking**
```
┌─────────────────────────────────────────────────┐
│ Create New Session                         [✕]  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Client: [Alice ▼]                              │
│                                                 │
│ Contract: 10 Sessions Package (2/10 done)      │
│                                                 │
│ Date & Time:                                    │
│ [📅 Oct 25, 2025]  [🕐 18:00] - [🕐 19:00]     │
│                                                 │
│ Session Type:                                   │
│ ○ Personal Training                             │
│ ○ Group Class                                   │
│ ○ Consultation                                  │
│                                                 │
│ Location:                                       │
│ [Gold's Gym District 1 ▼]                      │
│                                                 │
│ Recurring:                                      │
│ □ Repeat weekly on Mon, Wed, Fri               │
│   [Generate next 8 sessions]                    │
│                                                 │
│ Price: 500,000 VND                              │
│                                                 │
│ Notes:                                          │
│ [_________________________________]             │
│                                                 │
│        [Cancel]  [Create Session]               │
└─────────────────────────────────────────────────┘
```

### **Screen 3: Session Details**
```
┌─────────────────────────────────────────────────┐
│ Session Details                            [✕]  │
├─────────────────────────────────────────────────┤
│                                                 │
│ 👤 Alice                        Session 1/10    │
│ ⭐ 4.8 rating                                   │
│                                                 │
│ 📅 Oct 20, 2025                                 │
│ 🕐 18:00 - 19:00 (1 hour)                       │
│ 📍 Gold's Gym District 1                        │
│                                                 │
│ Status: ✅ Confirmed                            │
│                                                 │
│ 💰 Price: 500,000 VND                           │
│ 💳 Payment: Not paid yet                        │
│                                                 │
│ 📝 Notes:                                       │
│ Focus on chest & triceps                        │
│                                                 │
│ ─────────────────────────────────────────────   │
│                                                 │
│ [Reschedule] [Cancel] [Mark Complete]           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### **Screen 4: Mark Complete**
```
┌─────────────────────────────────────────────────┐
│ Complete Session                           [✕]  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Session with Alice                              │
│ Oct 20, 2025 • 18:00-19:00                      │
│                                                 │
│ Exercises performed:                            │
│ [_________________________________]             │
│                                                 │
│ Client performance:                             │
│ ○ Excellent  ○ Good  ○ Average  ○ Needs work   │
│                                                 │
│ Notes for next session:                         │
│ [_________________________________]             │
│ [_________________________________]             │
│                                                 │
│ Payment status:                                 │
│ ☑ Mark as paid (500,000 VND)                    │
│ Method: [Cash ▼]                                │
│                                                 │
│        [Cancel]  [Complete Session]             │
│                                                 │
│ ✅ Progress: 1/10 sessions completed            │
└─────────────────────────────────────────────────┘
```

---

## 🔧 API Endpoints

### **Calendar Management:**

```typescript
// View calendar
GET    /api/trainer/calendar
       ?view=day|week|month
       &date=2025-10-20

// Get single booking
GET    /api/trainer/bookings/:id

// Create booking
POST   /api/trainer/bookings
       Body: { clientId, trainerClientId, startTime, endTime, ... }

// Create recurring
POST   /api/trainer/bookings/recurring
       Body: { clientId, startTime, recurrenceRule, count }

// Update booking
PUT    /api/trainer/bookings/:id
       Body: { startTime, endTime, location, notes }

// Reschedule
PUT    /api/trainer/bookings/:id/reschedule
       Body: { newStartTime, newEndTime, reason }

// Cancel
POST   /api/trainer/bookings/:id/cancel
       Body: { reason }

// Mark complete
POST   /api/trainer/bookings/:id/complete
       Body: { notes, isPaid, paymentMethod }

// Mark no-show
POST   /api/trainer/bookings/:id/no-show

// Bulk operations
POST   /api/trainer/bookings/bulk-reschedule
       Body: { bookingIds[], newStartTime }

POST   /api/trainer/bookings/bulk-cancel
       Body: { bookingIds[], reason }
```

### **Client View:**

```typescript
// Client's upcoming sessions
GET    /api/client/sessions
       ?status=upcoming|past|cancelled

// Request reschedule
POST   /api/client/sessions/:id/reschedule-request
       Body: { preferredTimes[] }

// Cancel session
POST   /api/client/sessions/:id/cancel
       Body: { reason }
```

### **Admin:**

```typescript
// View all bookings (oversight)
GET    /api/admin/bookings
       ?trainerId=&clientId=&status=&date=

// Resolve conflicts
POST   /api/admin/bookings/:id/resolve
       Body: { action, reason }
```

---

## ⚠️ Edge Cases & Solutions

### **1. Double Booking (Conflict)**

**Problem:**
```
Trainer creates:
Booking 1: Oct 20, 18:00-19:00 with Alice
Booking 2: Oct 20, 18:30-19:30 with Bob ❌ Conflict!
```

**Solution:**
```typescript
// Validation in service
async createBooking(data) {
  // Check for conflicts
  const conflicts = await prisma.trainerBooking.findFirst({
    where: {
      trainerId: data.trainerId,
      deletedAt: null,
      status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      OR: [
        {
          // New booking starts during existing
          AND: [
            { startTime: { lte: data.startTime } },
            { endTime: { gt: data.startTime } },
          ],
        },
        {
          // New booking ends during existing
          AND: [
            { startTime: { lt: data.endTime } },
            { endTime: { gte: data.endTime } },
          ],
        },
        {
          // New booking wraps existing
          AND: [
            { startTime: { gte: data.startTime } },
            { endTime: { lte: data.endTime } },
          ],
        },
      ],
    },
  });

  if (conflicts) {
    throw new ConflictException(
      `Time slot already booked with ${conflicts.client.name}`
    );
  }

  // Create booking
  return await prisma.trainerBooking.create({ data });
}
```

---

### **2. Package Expiry**

**Problem:**
```
Client buys 10 sessions package
Completes 3 sessions
Stops coming for 6 months
Package should expire
```

**Solution:**
```prisma
model TrainerClient {
  // Add expiry
  packageExpiresAt DateTime?  // 90 days from start
  
  // ...
}
```

```typescript
// Cron job: Check expired packages
const expired = await prisma.trainerClient.findMany({
  where: {
    status: 'ACTIVE',
    packageExpiresAt: { lt: new Date() },
  },
});

for (const contract of expired) {
  // Cancel remaining bookings
  await prisma.trainerBooking.updateMany({
    where: {
      trainerClientId: contract.id,
      status: 'CONFIRMED',
      startTime: { gt: new Date() },
    },
    data: {
      status: 'CANCELLED',
      cancelledBy: 'SYSTEM',
      cancellationReason: 'Package expired',
    },
  });

  // Update contract
  await prisma.trainerClient.update({
    where: { id: contract.id },
    data: { status: 'COMPLETED' },
  });
}
```

---

### **3. Trainer Unavailable (Vacation/Sick)**

**Problem:**
```
Trainer goes on vacation Oct 15-25
Has 10 bookings during that time
Need to cancel/reschedule all
```

**Solution:**
```typescript
// POST /trainer/availability/block
await prisma.trainerSchedule.create({
  data: {
    trainerId: 1,
    dayOfWeek: -1,  // Special: block all days
    startTime: '2025-10-15',
    endTime: '2025-10-25',
    isActive: false,
    reason: 'Vacation',
  },
});

// Auto-cancel bookings in that period
const bookings = await prisma.trainerBooking.findMany({
  where: {
    trainerId: 1,
    status: 'CONFIRMED',
    startTime: {
      gte: new Date('2025-10-15'),
      lt: new Date('2025-10-25'),
    },
  },
});

for (const booking of bookings) {
  await prisma.trainerBooking.update({
    where: { id: booking.id },
    data: {
      status: 'CANCELLED',
      cancelledBy: 'TRAINER',
      cancellationReason: 'Trainer on vacation',
      cancellationFee: 0,  // No fee if trainer cancels
    },
  });

  // Offer makeup session
  await notificationService.send({
    userId: booking.clientId,
    message: 'Session cancelled. Rebook after Oct 25?',
  });
}
```

---

### **4. Recurring Booking Updates**

**Problem:**
```
Created 10 recurring sessions (Mon/Wed/Fri)
Need to change all from 6pm → 7pm
```

**Solution:**
```typescript
// PUT /trainer/bookings/recurring/:parentId
const childBookings = await prisma.trainerBooking.findMany({
  where: { 
    parentBookingId: parentId,
    startTime: { gt: new Date() },  // Only future sessions
  },
});

for (const booking of childBookings) {
  const newStart = setHours(booking.startTime, 19);  // 7pm
  const newEnd = setHours(booking.endTime, 20);

  await prisma.trainerBooking.update({
    where: { id: booking.id },
    data: {
      startTime: newStart,
      endTime: newEnd,
    },
  });
}

// Notify client once (not 10 times)
await notificationService.send({
  userId: booking.clientId,
  message: 'All future sessions moved to 7pm',
});
```

---

## 📈 Metrics to Track

### **Trainer Performance:**
```typescript
{
  totalSessions: 120,
  completedSessions: 108,
  cancelledByTrainer: 2,
  cancelledByClient: 8,
  noShows: 2,
  
  completionRate: '90%',  // 108/120
  cancellationRate: '1.7%',  // 2/120
  clientRetention: '85%',
  
  avgSessionsPerClient: 12,
  avgClientLifetime: '6 months',
  
  revenue: {
    earned: 54000000,
    pending: 6000000,
    lost: 1000000,
  },
}
```

### **Client Behavior:**
```typescript
{
  bookingsCreated: 15,
  attended: 12,
  cancelled: 2,
  noShows: 1,
  
  attendanceRate: '80%',  // 12/15
  avgCancellationNotice: '36 hours',
  
  preferredTimes: {
    'Mon 6pm': 4,
    'Wed 6pm': 4,
    'Fri 6pm': 4,
  },
}
```

---

## 🎯 Implementation Priority

### **Phase 1 (Must Have - Week 1):**
- [x] Add trainerClientId to TrainerBooking
- [x] Add sessionNumber, completedAt
- [x] Add cancellation fields
- [ ] Update TrainerClient model with bookings relation
- [ ] Create booking CRUD endpoints
- [ ] Calendar view API
- [ ] Mark complete functionality

### **Phase 2 (Important - Week 2):**
- [ ] Add recurring booking fields
- [ ] Recurring booking generation logic
- [ ] Conflict detection
- [ ] Reschedule functionality
- [ ] Payment per session tracking
- [ ] Dashboard analytics

### **Phase 3 (Nice to Have - Week 3):**
- [ ] Location fields
- [ ] Meeting link (online sessions)
- [ ] Reminder system
- [ ] Bulk operations
- [ ] Calendar export (iCal)
- [ ] Mobile calendar sync

---

## 📝 Migration Script

```bash
npx prisma migrate dev --name add_trainer_calendar_enhancements
```

---

## ✅ Summary

### **Current Status:**
- ✅ Basic TrainerBooking exists
- ⚠️ Missing contract link (trainerClientId)
- ⚠️ Missing session tracking
- ⚠️ Missing recurring support
- ⚠️ No cancellation tracking

### **After Enhancement:**
- ✅ Full calendar management
- ✅ Contract-linked sessions
- ✅ Progress tracking (3/10 done)
- ✅ Recurring bookings
- ✅ Detailed cancellation tracking
- ✅ Payment per session
- ✅ Analytics & insights

### **Estimated Effort:**
- **Database Schema:** 30 minutes
- **Backend APIs:** 8 hours
- **Calendar UI:** 12 hours
- **Testing:** 4 hours
- **Total:** ~3 days

### **ROI:**
- **Very High** - Core feature for trainer management
- Enables professional scheduling
- Reduces manual coordination
- Improves client satisfaction
- Generates valuable analytics

---

**Bạn muốn tôi:**
1. ✅ Apply schema changes to TrainerBooking?
2. ✅ Generate migration?
3. ✅ Create Calendar Service & Controller?
4. ✅ Implement conflict detection?
