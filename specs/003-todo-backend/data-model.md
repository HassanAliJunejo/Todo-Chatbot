# Data Model: Phase II Todo App – Backend

## Entities

### User
Represents an authenticated user.
- **id**: UUID (Primary Key)
- **email**: String (Unique, Indexed)
- **hashed_password**: String
- **full_name**: String (Optional)
- **created_at**: DateTime (Auto-now)

### Task
Represents a todo item belonging to a user.
- **id**: UUID (Primary Key)
- **owner_id**: UUID (Foreign Key -> User.id, Indexed)
- **title**: String (Required)
- **description**: String (Optional)
- **completed**: Boolean (Default: False)
- **created_at**: DateTime (Auto-now)
- **updated_at**: DateTime (Auto-now-on-update)

## Validation Rules

- **User Registration**: Email must be valid format; Password must be >= 8 characters.
- **Task Creation**: Title cannot be empty; Title length max 255 chars.
- **Task Update**: Only the owner can update.

## Relationships

- **User 1 : N Task**: A user owns multiple tasks; a task is owned by exactly one user.
