# 🎯 Smart Recommendation System - Database Analysis

## 📋 Requirements Check

### **Target Features:**
```
Home screen shows:
1. "Top rated near you" (3 trainers)
2. "Matches your goals" (3 trainers)  
3. "Available today" (3 trainers)
```

---

## ✅ Database Capability Analysis

### **1. "Top rated near you"** 

#### Required Data:
- ✅ Trainer rating
- ❌ Trainer location
- ❌ User location

#### Current Schema:
```prisma
model Trainer {
  id              Int
  userId          Int
  specialties     String?
  certifications  String?
  experienceYears Int?
  hourlyRate      Float?
  isAvailable     Boolean   @default(true)
  // ❌ NO location field
  
  reviews         TrainerReview[]  // ✅ Has reviews
}

model TrainerReview {
  id        Int
  trainerId Int
  clientId  Int
  rating    Int        // ✅ Has rating (1-5)
  content   String?
  helpfulCount Int @default(0)
}

model User {
  // ❌ NO location fields (lat/lng, address, district)
}
```

#### ❌ **MISSING:**
1. **Trainer.location** (lat, lng, address, district)
2. **User.location** (lat, lng, preferred district)

#### Current Capability:
```typescript
// ✅ CAN DO: Top rated (global)
SELECT t.*, AVG(r.rating) as avgRating
FROM Trainer t
LEFT JOIN TrainerReview r ON r.trainerId = t.id
GROUP BY t.id
ORDER BY avgRating DESC
LIMIT 3;

// ❌ CANNOT: "near you" (no location data)
```

#### Solution Needed:
```prisma
model Trainer {
  // Add location fields
  district     String?    // "Quận 1", "Quận 3"
  city         String?    // "TP.HCM", "Hà Nội"
  address      String?
  latitude     Float?
  longitude    Float?
}

model UserProfile {
  // Add location preference
  preferredDistricts String? // JSON: ["Quận 1", "Quận 3"]
  city               String?
  homeLatitude       Float?
  homeLongitude      Float?
}
```

---

### **2. "Matches your goals"**

#### Required Data:
- ✅ User fitness goals
- ✅ Trainer specialties
- ❌ Goal-to-specialty mapping

#### Current Schema:
```prisma
model UserProfile {
  userId          Int    @unique
  fitnessGoal     String?  // ✅ "lose weight", "build muscle", etc.
  experienceLevel String?
  activityLevel   String?
}

model Trainer {
  specialties  String?  // ✅ "boxing, weight loss, cardio"
}

model TrainerTranslation {
  trainerId      Int
  languageId     String
  specialties    String?  // ✅ Translated specialties
}
```

#### ⚠️ **PARTIAL SUPPORT:**

**Problem:**
```prisma
UserProfile.fitnessGoal = "lose weight"  // Free text
Trainer.specialties = "boxing, weight loss"  // Free text, comma-separated

→ No structured matching ❌
→ Need string matching (unreliable)
```

**Example Issue:**
```
User goal: "lose weight"
Trainer specialty: "weight loss"
→ String match fails ❌

User goal: "giảm cân" (Vietnamese)
Trainer specialty: "weight loss" (English)
→ No match ❌
```

#### Current Capability:
```typescript
// ⚠️ BASIC MATCHING (unreliable):
const userGoal = "lose weight";

// Simple LIKE query
SELECT t.*
FROM Trainer t
WHERE t.specialties LIKE '%weight loss%'
  OR t.specialties LIKE '%lose weight%'
LIMIT 3;

// Problem: Misses variations, language issues
```

#### Solution Needed:
```prisma
// Option 1: Enum for goals
enum FitnessGoal {
  WEIGHT_LOSS
  MUSCLE_GAIN
  GENERAL_FITNESS
  SPORT_SPECIFIC
  INJURY_RECOVERY
  FLEXIBILITY
}

model UserProfile {
  fitnessGoal FitnessGoal?  // Structured
}

model Trainer {
  specialties FitnessGoal[]  // Array of structured goals
}

// Option 2: Many-to-many with GoalCategory table
model GoalCategory {
  id   Int    @id
  name String
  
  userProfiles UserProfile[]
  trainers     Trainer[]
}
```

---

### **3. "Available today"**

#### Required Data:
- ✅ Trainer availability status
- ❌ Trainer schedule/calendar
- ❌ Booked time slots

#### Current Schema:
```prisma
model Trainer {
  isAvailable Boolean @default(true)  // ✅ Has flag
  // ❌ NO schedule data
  // ❌ NO time slots
  // ❌ NO working hours
}

// ❌ NO Calendar/Availability table
```

#### ❌ **INSUFFICIENT:**

**Problem:**
```
Trainer.isAvailable = true
→ Means: "Accepting clients generally"
→ NOT: "Has free slot today 6pm"

User sees "Available today"
→ Books trainer
→ Trainer: "Sorry, I'm booked today" ❌
→ Bad UX
```

#### Current Capability:
```typescript
// ✅ CAN DO: "Currently accepting clients"
SELECT *
FROM Trainer
WHERE isAvailable = true
  AND deletedAt IS NULL
LIMIT 3;

// ❌ CANNOT: "Available today at specific time"
// (no schedule data)
```

#### Solution Needed:
```prisma
model TrainerSchedule {
  id         Int      @id @default(autoincrement())
  trainerId  Int
  dayOfWeek  Int      // 0-6 (Sunday-Saturday)
  startTime  String   // "09:00"
  endTime    String   // "18:00"
  isActive   Boolean  @default(true)
  
  trainer    Trainer  @relation(fields: [trainerId], references: [id])
  
  @@index([trainerId, dayOfWeek])
}

model TrainerBooking {
  id           Int      @id @default(autoincrement())
  trainerId    Int
  clientId     Int
  startTime    DateTime
  endTime      DateTime
  status       BookingStatus
  
  trainer      Trainer  @relation(fields: [trainerId], references: [id])
  client       User     @relation(fields: [clientId], references: [id])
  
  @@index([trainerId, startTime])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

Then query:
```typescript
// Get trainers with free slots today
const today = new Date();
const todayStart = startOfDay(today);
const todayEnd = endOfDay(today);
const dayOfWeek = today.getDay();

SELECT DISTINCT t.*
FROM Trainer t
INNER JOIN TrainerSchedule ts 
  ON ts.trainerId = t.id 
  AND ts.dayOfWeek = ${dayOfWeek}
  AND ts.isActive = true
LEFT JOIN TrainerBooking tb
  ON tb.trainerId = t.id
  AND tb.startTime BETWEEN '${todayStart}' AND '${todayEnd}'
  AND tb.status IN ('PENDING', 'CONFIRMED')
WHERE t.isAvailable = true
  AND tb.id IS NULL  -- No bookings today
LIMIT 3;
```

---

## 📊 Summary: What's Missing?

| Feature | Required Fields | Current Status | Missing |
|---------|----------------|----------------|---------|
| **Top rated near you** | Trainer rating ✅<br>Trainer location ❌<br>User location ❌ | **50% ready** | Location fields |
| **Matches your goals** | User goals ✅<br>Trainer specialties ✅<br>Structured mapping ❌ | **60% ready** | Structured goals enum or M2M table |
| **Available today** | Availability flag ✅<br>Schedule ❌<br>Bookings ❌ | **30% ready** | Schedule & Booking tables |

---

## 🎯 Implementation Options

### **Option 1: MVP (Quick Win - 2 hours)** ⭐⭐⭐⭐⭐

**Use current data with limitations:**

```typescript
// 1. Top rated (ignore "near you" for now)
async getTopRated() {
  return await prisma.trainer.findMany({
    where: { isAvailable: true, deletedAt: null },
    include: {
      reviews: true,
      user: { select: { name: true, avatar: true } },
      translations: {
        where: { languageId: currentLang },
      },
    },
    take: 100,
  })
  .then(trainers => {
    // Calculate avg rating in app
    return trainers
      .map(t => ({
        ...t,
        avgRating: t.reviews.length > 0
          ? t.reviews.reduce((sum, r) => sum + r.rating, 0) / t.reviews.length
          : 0,
        reviewCount: t.reviews.length,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
  });
}

// 2. Matches your goals (basic string matching)
async getGoalMatched(userId: number) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { fitnessGoal: true },
  });
  
  if (!profile?.fitnessGoal) {
    return []; // No goal set
  }
  
  // Simple keyword matching
  const keywords = profile.fitnessGoal.toLowerCase().split(' ');
  
  return await prisma.trainer.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
      OR: keywords.map(kw => ({
        specialties: { contains: kw, mode: 'insensitive' },
      })),
    },
    include: {
      user: { select: { name: true, avatar: true } },
      translations: {
        where: { languageId: currentLang },
      },
    },
    take: 3,
  });
}

// 3. Available today (just show isAvailable = true)
async getAvailableToday() {
  return await prisma.trainer.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
    },
    include: {
      user: { select: { name: true, avatar: true } },
      translations: {
        where: { languageId: currentLang },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}
```

**Pros:**
- ✅ Works NOW (no schema changes)
- ✅ Quick implementation (2 hours)
- ✅ Good enough for MVP

**Cons:**
- ⚠️ "Near you" = just "Top rated" (no location)
- ⚠️ Goal matching is basic (string search)
- ⚠️ "Available today" = just "accepting clients" (not actual schedule)

---

### **Option 2: Enhanced (Full Features - 2 days)** ⭐⭐⭐⭐

**Add missing fields to schema:**

```prisma
// Migration 1: Add location
model Trainer {
  id              Int       @id @default(autoincrement())
  userId          Int       @unique
  specialties     String?
  certifications  String?
  experienceYears Int?
  hourlyRate      Float?
  isAvailable     Boolean   @default(true)
  maxClients      Int       @default(10)
  
  // NEW: Location fields
  district        String?   // "Quận 1", "Quận 3"
  city            String?   // "TP.HCM", "Hà Nội"  
  address         String?
  latitude        Float?
  longitude       Float?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  deletedAt       DateTime?
  
  // ... existing relations
  
  schedules       TrainerSchedule[]  // NEW
  bookings        TrainerBooking[]   // NEW
}

model UserProfile {
  id                        Int       @id @default(autoincrement())
  userId                    Int       @unique
  height                    Float?
  weight                    Float?
  bodyFatPercentage         Float?
  muscleMass                Float?
  activityLevel             String?
  fitnessGoal               String?
  experienceLevel           String?
  
  // NEW: Location preference
  preferredDistricts        String?   // JSON: ["Quận 1", "Quận 3"]
  city                      String?
  homeLatitude              Float?
  homeLongitude             Float?
  
  // ... rest stays same
}

// Migration 2: Add schedule
model TrainerSchedule {
  id         Int      @id @default(autoincrement())
  trainerId  Int
  dayOfWeek  Int      // 0-6
  startTime  String   // "09:00"
  endTime    String   // "18:00"
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  trainer    Trainer  @relation(fields: [trainerId], references: [id])
  
  @@index([trainerId, dayOfWeek])
}

// Migration 3: Add bookings
model TrainerBooking {
  id           Int           @id @default(autoincrement())
  trainerId    Int
  clientId     Int
  startTime    DateTime
  endTime      DateTime
  status       BookingStatus @default(PENDING)
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  trainer      Trainer       @relation(fields: [trainerId], references: [id])
  client       User          @relation("TrainerBookings", fields: [clientId], references: [id])
  
  @@index([trainerId, startTime])
  @@index([clientId, startTime])
}

enum BookingStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

**Implementation:**

```typescript
// 1. Top rated near you (with location)
async getTopRatedNearby(userId: number) {
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { 
      preferredDistricts: true,
      city: true,
      homeLatitude: true,
      homeLongitude: true,
    },
  });
  
  // Use district filtering if available
  const districtFilter = userProfile?.preferredDistricts
    ? { district: { in: JSON.parse(userProfile.preferredDistricts) } }
    : {};
  
  const trainers = await prisma.trainer.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
      city: userProfile?.city || undefined,
      ...districtFilter,
    },
    include: {
      reviews: { select: { rating: true } },
      user: { select: { name: true, avatar: true } },
    },
    take: 50,
  });
  
  // Calculate rating + distance
  return trainers
    .map(t => {
      const avgRating = t.reviews.length > 0
        ? t.reviews.reduce((sum, r) => sum + r.rating, 0) / t.reviews.length
        : 0;
      
      // Calculate distance if coordinates available
      const distance = (t.latitude && t.longitude && 
                       userProfile?.homeLatitude && userProfile?.homeLongitude)
        ? calculateDistance(
            userProfile.homeLatitude, userProfile.homeLongitude,
            t.latitude, t.longitude
          )
        : null;
      
      return { ...t, avgRating, distance };
    })
    .sort((a, b) => {
      // Sort by rating first, then distance
      if (b.avgRating !== a.avgRating) {
        return b.avgRating - a.avgRating;
      }
      if (a.distance && b.distance) {
        return a.distance - b.distance;
      }
      return 0;
    })
    .slice(0, 3);
}

// 2. Matches your goals (with enum)
// (Keep string matching for now, or add enum in future)

// 3. Available today (with schedule)
async getAvailableToday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  // Get trainers with schedule today
  const trainersWithSchedule = await prisma.trainerSchedule.findMany({
    where: {
      dayOfWeek,
      isActive: true,
      trainer: {
        isAvailable: true,
        deletedAt: null,
      },
    },
    include: {
      trainer: {
        include: {
          user: { select: { name: true, avatar: true } },
          bookings: {
            where: {
              startTime: { gte: todayStart, lte: todayEnd },
              status: { in: ['PENDING', 'CONFIRMED'] },
            },
          },
        },
      },
    },
  });
  
  // Filter trainers with free slots
  return trainersWithSchedule
    .filter(schedule => {
      const trainer = schedule.trainer;
      const scheduleStart = parseTime(schedule.startTime);
      const scheduleEnd = parseTime(schedule.endTime);
      const scheduleMinutes = (scheduleEnd - scheduleStart) / 60000;
      
      const bookedMinutes = trainer.bookings.reduce((sum, booking) => {
        return sum + (booking.endTime.getTime() - booking.startTime.getTime()) / 60000;
      }, 0);
      
      // Has at least 1 hour free
      return (scheduleMinutes - bookedMinutes) >= 60;
    })
    .map(s => s.trainer)
    .slice(0, 3);
}
```

**Pros:**
- ✅ Full feature implementation
- ✅ Accurate location-based recommendations
- ✅ Real schedule/availability checking
- ✅ Better UX

**Cons:**
- ⏰ Takes 2 days (schema changes + migration + implementation)
- ⚠️ More complex
- ⚠️ Need trainer onboarding to fill location/schedule

---

### **Option 3: Hybrid (Quick + Iterative - 4 hours)** ⭐⭐⭐⭐⭐

**Phase 1 (2 hours): Use Option 1 (MVP)**
- Launch with basic recommendations
- Get user feedback
- Track which section gets most clicks

**Phase 2 (2 hours): Add location only**
```prisma
model Trainer {
  district String?
  city     String?
}

model UserProfile {
  preferredDistricts String? // JSON array
  city               String?
}
```

**Phase 3 (later): Add schedule if needed**

**Pros:**
- ✅ Ship fast
- ✅ Learn from usage
- ✅ Iterate based on data

---

## 🏆 Recommendation

### **For Gymie 2.0 MVP:**

### ✅ **Use Option 1 (MVP) - Ship in 2 hours**

**Rationale:**
1. **Good enough for graduation project**
   - Shows recommendation system ✅
   - Demonstrates algorithms ✅
   - Works without complex schema ✅

2. **Fast to implement**
   - No migrations needed
   - Pure business logic
   - Can iterate later

3. **Validates concept first**
   - See if users actually use recommendations
   - Track which section gets clicks
   - Then invest in enhancements

**Implementation Plan:**

```typescript
// src/routes/recommendation/recommendation.service.ts
@Injectable()
export class RecommendationService {
  
  // 1. Top Rated (3 trainers)
  async getTopRated(limit = 3) {
    const trainers = await this.prisma.trainer.findMany({
      where: { isAvailable: true, deletedAt: null },
      include: {
        reviews: { select: { rating: true } },
        user: { select: { name: true, avatar: true } },
        translations: true,
      },
      take: 50,
    });
    
    return trainers
      .map(t => ({
        ...t,
        avgRating: this.calculateAvgRating(t.reviews),
        reviewCount: t.reviews.length,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, limit);
  }
  
  // 2. Goal Matched (3 trainers)
  async getGoalMatched(userId: number, limit = 3) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    
    if (!profile?.fitnessGoal) {
      return this.getTopRated(limit); // Fallback
    }
    
    const keywords = this.extractKeywords(profile.fitnessGoal);
    
    return await this.prisma.trainer.findMany({
      where: {
        isAvailable: true,
        deletedAt: null,
        OR: keywords.map(kw => ({
          specialties: { contains: kw, mode: 'insensitive' },
        })),
      },
      include: {
        user: { select: { name: true, avatar: true } },
        reviews: { select: { rating: true } },
        translations: true,
      },
      take: limit,
    });
  }
  
  // 3. Available Now (3 trainers)
  async getAvailableNow(limit = 3) {
    return await this.prisma.trainer.findMany({
      where: {
        isAvailable: true,
        deletedAt: null,
      },
      include: {
        user: { select: { name: true, avatar: true } },
        reviews: { select: { rating: true } },
        translations: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
  
  // Helper
  private calculateAvgRating(reviews: { rating: number }[]) {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }
  
  private extractKeywords(goal: string): string[] {
    // Basic keyword extraction
    const keywords = goal.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    // Add synonyms
    const synonymMap = {
      'lose': ['loss', 'losing', 'reduce'],
      'weight': ['fat', 'slim'],
      'muscle': ['strength', 'build', 'gain'],
      'cardio': ['aerobic', 'endurance'],
    };
    
    const expanded = [...keywords];
    keywords.forEach(kw => {
      if (synonymMap[kw]) {
        expanded.push(...synonymMap[kw]);
      }
    });
    
    return [...new Set(expanded)];
  }
}
```

```typescript
// src/routes/recommendation/recommendation.controller.ts
@Controller('recommendations')
export class RecommendationController {
  
  @Get('home')
  async getHomeRecommendations(@CurrentUser() user: User) {
    const [topRated, goalMatched, availableNow] = await Promise.all([
      this.recommendationService.getTopRated(3),
      this.recommendationService.getGoalMatched(user.id, 3),
      this.recommendationService.getAvailableNow(3),
    ]);
    
    return {
      topRated: {
        title: 'Top Rated Near You',
        trainers: topRated,
      },
      goalMatched: {
        title: 'Matches Your Goals',
        trainers: goalMatched,
      },
      availableNow: {
        title: 'Available Today',
        trainers: availableNow,
      },
    };
  }
}
```

**Response example:**
```json
{
  "topRated": {
    "title": "Top Rated Near You",
    "trainers": [
      {
        "id": 1,
        "user": {
          "name": "John Smith",
          "avatar": "https://..."
        },
        "avgRating": 4.8,
        "reviewCount": 24,
        "hourlyRate": 500000,
        "specialties": "Boxing, Weight Loss"
      }
    ]
  },
  "goalMatched": {
    "title": "Matches Your Goals",
    "trainers": [...]
  },
  "availableNow": {
    "title": "Available Today",
    "trainers": [...]
  }
}
```

---

## 📝 Next Steps

### **Immediate (2 hours):**
- [ ] Create RecommendationService
- [ ] Create RecommendationController  
- [ ] Add GET /recommendations/home endpoint
- [ ] Test with sample data

### **Future Enhancements (if needed):**
- [ ] Add Trainer.district field (30 mins)
- [ ] Add location-based filtering (1 hour)
- [ ] Add TrainerSchedule table (3 hours)
- [ ] Add real-time availability (4 hours)

### **Analytics to track:**
```typescript
// Track which section gets clicks
{
  "section": "topRated" | "goalMatched" | "availableNow",
  "trainerId": 123,
  "userId": 456,
  "timestamp": "2025-10-18T10:00:00Z"
}

// If "goalMatched" gets 0 clicks → Remove it
// If "topRated" gets 80% clicks → Focus on that
```

---

## 🎯 Conclusion

### **Current Database Status:**

| Feature | Status | Action |
|---------|--------|--------|
| Top rated | ✅ 100% ready | Implement now |
| Goal matching | ⚠️ 60% ready (basic only) | MVP good enough |
| Available today | ⚠️ 50% ready (fake it) | MVP good enough |
| Location filtering | ❌ 0% ready | Skip for MVP |
| Real schedule | ❌ 0% ready | Skip for MVP |

### **MVP Recommendation:**
```
✅ Build Option 1 (2 hours)
✅ Ship with current schema
✅ Track usage analytics
📊 Enhance based on data
```

**You can start implementing NOW** - database is sufficient for MVP! 🚀
