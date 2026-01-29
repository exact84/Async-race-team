# Async Race style guide

## File Naming

- **File names** must use **kebab-case**.
  Example: `user-profile.service.ts`

- **Services** must use the `.service.ts` suffix.
  Example: `auth.service.ts`, `cart.service.ts`

---

## Code Style

### Access Modifiers

- **All class fields and methods must explicitly declare access modifiers**
  (`public`, `protected`, `private`)

```ts
class UserService {
  private apiUrl: string;

  public getUser(): User {
    // ...
  }
}
```

---

### Return Types

- **All functions and methods must explicitly declare a return type**

```ts
function getTotal(): number {
  return 0;
}
```

---

### Function Declarations

- **Use `function` declarations for all functions**
- **Arrow functions are allowed only for callbacks**

```ts
function calculatePrice(): number {
  return 100;
}

items.forEach((item) => {
  console.log(item);
});
```

---

### Interfaces vs Types

- **Prefer `interface` over `type`**

```ts
interface User {
  id: string;
  name: string;
}
```

---

### Interface Methods

- **Methods in interfaces must use method syntax**

```ts
interface Logger {
  log(message: string): void;
}
```

### Constants

- **Constants must use `UPPER_SNAKE_CASE`**
- **Fields of constant objects must also use `UPPER_SNAKE_CASE`**

```ts
const API_CONFIG = {
  BASE_URL: "https://api.example.com",
  TIMEOUT_MS: 5000,
} as const;
```
