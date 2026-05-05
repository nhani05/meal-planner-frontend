# Meal Planner System - Entity & Related Components

## Project Structure

### Entities (JPA)
All entities are located in `src/main/java/com/example/javaweb/meal_planner_system/entity/`

#### User Management Module
- **UserAccount** - User authentication and account information
- **HealthProfile** - User's physical and health information
- **HealthGoal** - User's health goals and nutritional targets
- **PasswordResetToken** - OTP tokens for password recovery

#### Dish Management Module
- **DishCategory** - Categories for dishes
- **Dish** - Recipe/dish information
- **NutritionInfo** - Nutritional information per 100g
- **Ingredient** - Ingredients used in a dish
- **DishRating** - User ratings and reviews for dishes
- **FavoriteDish** - User's favorite dishes

#### Meal Planning Module
- **MealPlan** - Meal plan for a specific date
- **Meal** - A meal slot in a plan (breakfast, lunch, dinner, snack)
- **Portion** - Quantity of a dish in a meal
- **MealPlanTemplate** - Reusable meal plan templates

#### Feedback & Admin Module
- **UserFeedback** - User-submitted feedback and complaints
- **AdminAuditLog** - Admin action logs (if applicable)

### Enumerations
All enums are located in `src/main/java/com/example/javaweb/meal_planner_system/entity/enums/`

- **UserRole** - USER, ADMIN
- **UserStatus** - ACTIVE, LOCKED, DELETED
- **Gender** - MALE, FEMALE, OTHER
- **GoalType** - WEIGHT_LOSS, MUSCLE_GAIN, MAINTAIN
- **ActivityLevel** - LOW, MEDIUM, HIGH
- **DishSource** - SYSTEM, CUSTOM
- **DishDifficulty** - EASY, MEDIUM, HARD
- **MealType** - BREAKFAST, LUNCH, DINNER, SNACK
- **FeedbackStatus** - PENDING, PROCESSING, RESOLVED

### Data Transfer Objects (DTOs)
All DTOs are located in `src/main/java/com/example/javaweb/meal_planner_system/dto/`

- UserAccountDTO
- HealthProfileDTO
- HealthGoalDTO
- DishDTO
- NutritionInfoDTO
- IngredientDTO
- DishRatingDTO
- PortionDTO
- MealPlanDTO
- MealDTO
- DishCategoryDTO
- LoginDTO
- RegisterDTO
- MealPlanTemplateDTO
- AdminStatsDTO
- FeedbackDTO
- AdminDishRequestDTO
- ChangePasswordDTO / ForgotPasswordDTO / ResetPasswordDTO / VerifyOtpDTO

### Repositories
All repositories are located in `src/main/java/com/example/javaweb/meal_planner_system/repository/`

Spring Data JPA repositories with custom query methods:
- UserAccountRepository
- HealthProfileRepository
- HealthGoalRepository
- PasswordResetTokenRepository
- DishCategoryRepository
- DishRepository
- NutritionInfoRepository
- IngredientRepository
- DishRatingRepository
- FavoriteDishRepository
- MealPlanRepository
- MealRepository
- PortionRepository
- MealPlanTemplateRepository
- UserFeedbackRepository
- AdminAuditLogRepository

### Services
All services are located in `src/main/java/com/example/javaweb/meal_planner_system/service/`

**Service Interfaces:**
- UserAccountService
- HealthProfileService
- HealthGoalService
- DishService
- DishCategoryService
- DishRatingService
- FavoriteDishService
- IngredientService
- MealPlanService
- MealService
- PortionService
- AdminService

**Service Implementations:**
Located in `service/impl/` package

### Controllers
All controllers are located in `src/main/java/com/example/javaweb/meal_planner_system/controller/`

- **AuthController** - User authentication endpoints
- **HealthProfileController** - Health profile management
- **HealthGoalController** - Health goal management
- **DishController** - Dish management
- **DishCategoryController** - Dish category management
- **DishRatingController** - Dish rating endpoints
- **FavoriteDishController** - Favorite dishes management
- **IngredientController** - Ingredient management
- **MealPlanController** - Meal plan management
- **PortionController** - Portion management within meals
- **AdminController** - Admin dashboard and management

### Configuration
Located in `src/main/java/com/example/javaweb/meal_planner_system/config/`

- **AppConfig** - Spring Security configuration, Password encoding, and CORS setup

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/user/{id}         - Get user details
```

### Health Profile Endpoints
```
GET    /api/health-profile/{accountId}     - Get health profile
POST   /api/health-profile/{accountId}     - Create/update health profile
```

### Health Goal Endpoints
```
GET    /api/health-goal/{accountId}        - Get health goal
POST   /api/health-goal/{accountId}        - Create/update health goal
```

### Dish Management Endpoints
```
GET    /api/dishes                         - Get all dishes
GET    /api/dishes/{id}                    - Get dish by ID
GET    /api/dishes/system                  - Get system dishes
GET    /api/dishes/account/{accountId}     - Get user's custom dishes
POST   /api/dishes                         - Create new dish
PUT    /api/dishes/{id}                    - Update dish
DELETE /api/dishes/{id}                    - Delete dish
```

### Dish Category Endpoints
```
GET    /api/dish-categories                - Get all categories
```

### Dish Rating Endpoints
```
POST   /api/dishes/{dishId}/ratings        - Rate a dish
GET    /api/dishes/{dishId}/ratings        - Get ratings for a dish
```

### Favorite Endpoints
```
GET    /api/favorites/account/{accountId}             - Get user's favorites
POST   /api/favorites/account/{accountId}/{dishId}    - Add favorite
DELETE /api/favorites/account/{accountId}/{dishId}    - Remove favorite
```

### Ingredient Endpoints
```
POST   /api/ingredients                    - Create ingredient
PUT    /api/ingredients/{id}               - Update ingredient
GET    /api/ingredients/{id}               - Get ingredient by ID
DELETE /api/ingredients/{id}               - Delete ingredient
```

### Meal Plan Endpoints
```
GET    /api/meal-plans/account/{accountId}             - Get user's meal plans
GET    /api/meal-plans/account/{accountId}/date/{date} - Get meal plan for specific date
POST   /api/meal-plans                                 - Create meal plan
PUT    /api/meal-plans/{id}                            - Update meal plan
DELETE /api/meal-plans/{id}                            - Delete meal plan
```

### Portion Endpoints
```
POST   /api/meal-plans/{planId}/meals/{mealType}/portions              - Add portion
PUT    /api/meal-plans/{planId}/meals/{mealType}/portions/{portionId} - Update portion
DELETE /api/meal-plans/{planId}/meals/{mealType}/portions/{portionId} - Delete portion
```

### Admin Endpoints
```
GET    /api/admin/statistics               - Get dashboard statistics
GET    /api/admin/users                    - List users with pagination
PATCH  /api/admin/users/{id}/lock          - Lock user account
PATCH  /api/admin/users/{id}/unlock        - Unlock user account
DELETE /api/admin/users/{id}               - Soft delete user
GET    /api/admin/feedbacks                - List feedbacks
PATCH  /api/admin/feedbacks/{id}/status    - Update feedback status
```

## Entity Relationships

```
UserAccount (1) ──┬─→ (1) HealthProfile
                  ├─→ (N) HealthGoal
                  ├─→ (N) PasswordResetToken
                  ├─→ (N) Dish (custom)
                  ├─→ (N) MealPlan
                  ├─→ (N) DishRating
                  ├─→ (N) FavoriteDish
                  └─→ (N) MealPlanTemplate

DishCategory (1) ──→ (N) Dish

Dish (1) ──┬─→ (1) NutritionInfo
           ├─→ (N) Ingredient
           ├─→ (N) DishRating
           ├─→ (N) FavoriteDish
           └─→ (N) Portion

MealPlan (1) ──→ (N) Meal

Meal (1) ──→ (N) Portion

Portion (N) ──→ (1) Dish
```

## Key Features

1. **User Management** - Registration, login, and account management with role-based access control
2. **Health Tracking** - Track user's physical information and health goals
3. **Dish Management** - Both system-provided and custom user dishes with nutritional information
4. **Ingredient Tracking** - Detailed ingredient information for each dish
5. **User Ratings** - Rate and review dishes
6. **Favorites** - Save favorite dishes
7. **Meal Planning** - Create meal plans for specific dates with meals (breakfast, lunch, dinner, snack)
8. **Portion Management** - Track portions and calculate nutritional values

## Technology Stack

- **Framework**: Spring Boot 4.0.6
- **Language**: Java 17
- **ORM**: JPA/Hibernate
- **Database**: MySQL 8.0+
- **Security**: Spring Security with BCrypt password encoding
- **Build Tool**: Maven
- **Additional Libraries**: Lombok

## Getting Started

1. Configure database connection in `application.yaml`
2. Run `mvn clean install` to build the project
3. Run `mvn spring-boot:run` to start the application
4. Access API endpoints at `http://localhost:8080/api/`

## Database Setup

The database schema is provided in `meal_planner_schema.sql`. Import it to your MySQL database:

```bash
mysql -u username -p database_name < meal_planner_schema.sql
```

## Future Enhancements

- [x] JWT token-based authentication
- [ ] Advanced meal plan recommendations
- [ ] Recipe suggestions based on nutritional goals
- [ ] Calorie tracking and analytics
- [ ] Mobile app integration
- [ ] Push notifications for meal reminders
- [ ] Social features (share recipes, meal plans)
- [ ] Advanced search and filtering
- [ ] Admin dish management endpoints (CRUD under /admin/dishes)
- [ ] Meal plan template endpoints
- [ ] List all ingredients with pagination/search
