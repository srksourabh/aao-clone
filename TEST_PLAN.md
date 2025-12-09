# AaoCab Test Plan

This document outlines manual and automated test cases for the AaoCab cab booking platform.

## Table of Contents

1. [Authentication Tests](#authentication-tests)
2. [Booking Flow Tests](#booking-flow-tests)
3. [Payment Tests](#payment-tests)
4. [Admin Dashboard Tests](#admin-dashboard-tests)
5. [Form Validation Tests](#form-validation-tests)
6. [UI/UX Tests](#uiux-tests)
7. [API Tests](#api-tests)
8. [Performance Tests](#performance-tests)
9. [Security Tests](#security-tests)
10. [Accessibility Tests](#accessibility-tests)

---

## Authentication Tests

### TC-AUTH-001: User Registration
**Priority:** High
**Steps:**
1. Navigate to `/register`
2. Enter valid name, email, phone, and password
3. Click "Create Account"

**Expected Results:**
- Success message displayed
- Verification email sent
- User redirected to login page

### TC-AUTH-002: Registration Validation
**Priority:** High
**Steps:**
1. Navigate to `/register`
2. Try submitting with:
   - Empty fields
   - Invalid email format
   - Password less than 6 characters
   - Invalid phone number (not 10 digits)

**Expected Results:**
- Appropriate error messages for each invalid field
- Form not submitted

### TC-AUTH-003: User Login
**Priority:** High
**Steps:**
1. Navigate to `/login`
2. Enter valid credentials
3. Click "Sign In"

**Expected Results:**
- User logged in successfully
- Redirected to home page or previous page
- User name shown in navigation

### TC-AUTH-004: Login with Invalid Credentials
**Priority:** High
**Steps:**
1. Navigate to `/login`
2. Enter invalid email/password
3. Click "Sign In"

**Expected Results:**
- Error message: "Invalid email or password"
- User remains on login page

### TC-AUTH-005: Password Reset Flow
**Priority:** Medium
**Steps:**
1. Navigate to `/forgot-password`
2. Enter registered email
3. Click "Send Reset Link"
4. Check email and click reset link
5. Enter new password on reset page

**Expected Results:**
- Reset email received
- Password updated successfully
- Can login with new password

### TC-AUTH-006: Remember Me Functionality
**Priority:** Low
**Steps:**
1. Login with "Remember me" checked
2. Close browser completely
3. Reopen and navigate to site

**Expected Results:**
- User remains logged in

### TC-AUTH-007: Logout
**Priority:** High
**Steps:**
1. Login to the application
2. Click "Logout" button

**Expected Results:**
- User logged out
- Session cleared
- Redirected to home page
- Protected pages no longer accessible

---

## Booking Flow Tests

### TC-BOOK-001: Create One-Way Booking
**Priority:** High
**Steps:**
1. Navigate to home page
2. Select "One Way" trip type
3. Enter pickup location (use autocomplete)
4. Enter drop location (use autocomplete)
5. Select date and time
6. Select vehicle type
7. Enter name, phone, email
8. Click "Book Now"

**Expected Results:**
- Booking created successfully
- Confirmation displayed with booking ID
- Appears in "My Bookings" if logged in

### TC-BOOK-002: Create Round Trip Booking
**Priority:** High
**Steps:**
1. Select "Round Trip" trip type
2. Enter locations, date, return date, time
3. Complete booking

**Expected Results:**
- Return date field visible
- Booking created with return date

### TC-BOOK-003: Create Rental Booking
**Priority:** Medium
**Steps:**
1. Select "Rental" trip type
2. Select rental package (4hrs/40km, 8hrs/80km, etc.)
3. Complete booking

**Expected Results:**
- Rental packages displayed
- Package selected in booking

### TC-BOOK-004: Special Requirements
**Priority:** Medium
**Steps:**
1. Create booking with:
   - Baby on board checked
   - Patient on board checked
   - Pet on board checked

**Expected Results:**
- Special requirements saved
- Displayed in booking details

### TC-BOOK-005: View Booking Details
**Priority:** High
**Steps:**
1. Login and navigate to "My Bookings"
2. Click on a booking

**Expected Results:**
- Full booking details displayed
- Route, date, time, vehicle shown
- Payment status shown
- Cancel button available (if applicable)

### TC-BOOK-006: Cancel Booking
**Priority:** High
**Steps:**
1. Navigate to booking details
2. Click "Cancel Booking"
3. Confirm cancellation

**Expected Results:**
- Booking status changed to "Cancelled"
- Success message displayed
- Cannot cancel already cancelled bookings
- Cannot cancel confirmed bookings < 4 hours before trip

### TC-BOOK-007: Location Autocomplete
**Priority:** High
**Steps:**
1. Start typing location in pickup field
2. Wait for suggestions

**Expected Results:**
- Google Places suggestions appear
- Selecting suggestion fills the field
- Works for both pickup and drop

---

## Payment Tests

### TC-PAY-001: Complete Payment
**Priority:** High
**Steps:**
1. Create a booking
2. Navigate to payment page
3. Enter test card: 4242 4242 4242 4242
4. Enter any future expiry and CVC
5. Click "Pay"

**Expected Results:**
- Payment processed successfully
- Redirected to success page
- Booking status updated to "paid"
- Receipt available for download

### TC-PAY-002: Payment with Insufficient Funds
**Priority:** High
**Steps:**
1. Navigate to payment page
2. Use test card: 4000 0000 0000 9995
3. Attempt payment

**Expected Results:**
- Error message displayed
- Payment not completed
- User can retry

### TC-PAY-003: Payment Already Completed
**Priority:** Medium
**Steps:**
1. Try to pay for already paid booking

**Expected Results:**
- Error message: "Booking already paid"
- Redirected to booking details

### TC-PAY-004: Download Receipt
**Priority:** Medium
**Steps:**
1. Complete a payment
2. Click "Download Receipt"

**Expected Results:**
- Receipt file downloaded
- Contains booking and payment details

### TC-PAY-005: Refund (Admin)
**Priority:** Medium
**Steps:**
1. Login as admin
2. Find a paid booking
3. Process refund

**Expected Results:**
- Refund processed via Stripe
- Booking status updated to "refunded"

---

## Admin Dashboard Tests

### TC-ADMIN-001: Admin Login
**Priority:** High
**Steps:**
1. Navigate to `/admin`
2. Enter admin credentials
3. Click "Login"

**Expected Results:**
- Logged into admin dashboard
- Booking list displayed

### TC-ADMIN-002: View All Bookings
**Priority:** High
**Steps:**
1. Login as admin
2. View bookings list

**Expected Results:**
- All bookings displayed
- Pagination works if many bookings
- Recent bookings shown first

### TC-ADMIN-003: Filter Bookings
**Priority:** Medium
**Steps:**
1. Use status filter dropdown
2. Select different statuses

**Expected Results:**
- List filtered by selected status
- Count updates accordingly

### TC-ADMIN-004: Update Booking Status
**Priority:** High
**Steps:**
1. Find a pending booking
2. Change status to "Confirmed"

**Expected Results:**
- Status updated
- Success message shown

### TC-ADMIN-005: Export to CSV
**Priority:** Medium
**Steps:**
1. Click "Export CSV" button

**Expected Results:**
- CSV file downloaded
- Contains all booking data

### TC-ADMIN-006: Mobile View
**Priority:** Medium
**Steps:**
1. Access admin on mobile device
2. View and interact with bookings

**Expected Results:**
- Card-based layout on mobile
- All functions accessible

---

## Form Validation Tests

### TC-VAL-001: Email Validation
**Priority:** High
**Test Cases:**
- Empty email -> Error
- "invalid" -> Error
- "test@" -> Error
- "test@domain.com" -> Valid

### TC-VAL-002: Phone Validation
**Priority:** High
**Test Cases:**
- Empty -> Error
- "123" -> Error (too short)
- "1234567890" -> Error (doesn't start with 6-9)
- "9876543210" -> Valid

### TC-VAL-003: Password Validation
**Priority:** High
**Test Cases:**
- Empty -> Error
- "12345" -> Error (< 6 chars)
- "password123" -> Valid

### TC-VAL-004: Name Validation
**Priority:** Medium
**Test Cases:**
- Empty -> Error
- "A" -> Error (< 2 chars)
- "John Doe" -> Valid

### TC-VAL-005: Date Validation
**Priority:** High
**Test Cases:**
- Past date -> Error
- Today (< 4 hours) -> Error
- Future date (> 4 hours) -> Valid

---

## UI/UX Tests

### TC-UI-001: Responsive Design
**Priority:** High
**Test on:**
- Mobile (320px - 480px)
- Tablet (768px - 1024px)
- Desktop (1024px+)

**Expected Results:**
- Layout adapts correctly
- No horizontal scrolling
- All elements accessible

### TC-UI-002: Loading States
**Priority:** Medium
**Steps:**
1. Trigger loading (slow network simulation)
2. Observe UI during loading

**Expected Results:**
- Loading spinners displayed
- Buttons disabled during submission
- No double submissions

### TC-UI-003: Error States
**Priority:** High
**Steps:**
1. Trigger various errors
2. Check error displays

**Expected Results:**
- Clear error messages
- Red/destructive styling
- Actionable information

### TC-UI-004: Toast Notifications
**Priority:** Medium
**Steps:**
1. Complete various actions
2. Observe notifications

**Expected Results:**
- Success toasts for completions
- Error toasts for failures
- Auto-dismiss after timeout

### TC-UI-005: Empty States
**Priority:** Low
**Steps:**
1. View "My Bookings" with no bookings

**Expected Results:**
- Friendly empty state message
- Call to action to book

---

## API Tests

### TC-API-001: Create Booking API
**Endpoint:** POST /api/bookings
**Test Cases:**
- Valid data -> 200 + booking created
- Missing required fields -> 400
- Invalid data types -> 400

### TC-API-002: Get Bookings API
**Endpoint:** GET /api/bookings
**Test Cases:**
- With auth token -> 200 + bookings
- Without auth -> 401

### TC-API-003: Payment Intent API
**Endpoint:** POST /api/payments/create-intent
**Test Cases:**
- Valid booking -> 200 + client_secret
- Already paid booking -> 400
- Non-existent booking -> 404

### TC-API-004: Webhook API
**Endpoint:** POST /api/payments/webhook
**Test Cases:**
- Valid signature -> 200
- Invalid signature -> 400
- payment_intent.succeeded -> Updates booking

---

## Performance Tests

### TC-PERF-001: Page Load Time
**Targets:**
- Home page: < 3s
- Booking page: < 2s
- My Bookings: < 2s

**Tools:** Chrome DevTools, Lighthouse

### TC-PERF-002: Lighthouse Scores
**Targets:**
- Performance: >= 70
- Accessibility: >= 90
- Best Practices: >= 90
- SEO: >= 90

### TC-PERF-003: Bundle Size
**Check:**
- First load JS: < 200KB
- Total bundle: < 500KB

---

## Security Tests

### TC-SEC-001: XSS Prevention
**Steps:**
1. Enter script tags in form fields
2. Submit and view results

**Expected Results:**
- Scripts not executed
- Content properly escaped

### TC-SEC-002: CSRF Protection
**Steps:**
1. Attempt cross-site form submission

**Expected Results:**
- Request rejected

### TC-SEC-003: SQL Injection
**Steps:**
1. Enter SQL in form fields

**Expected Results:**
- No SQL errors
- Input sanitized

### TC-SEC-004: Auth Token Security
**Check:**
- Tokens not in URL
- Tokens expire appropriately
- Tokens invalidated on logout

### TC-SEC-005: Sensitive Data
**Check:**
- No secrets in client code
- No credentials in console logs
- Stripe keys properly scoped

---

## Accessibility Tests

### TC-A11Y-001: Keyboard Navigation
**Steps:**
1. Navigate entire site using only keyboard

**Expected Results:**
- All interactive elements focusable
- Visible focus indicators
- Logical tab order

### TC-A11Y-002: Screen Reader
**Steps:**
1. Use screen reader (NVDA/VoiceOver)
2. Navigate through pages

**Expected Results:**
- All content readable
- Form labels announced
- Error messages announced

### TC-A11Y-003: Color Contrast
**Tools:** axe DevTools, Lighthouse
**Expected Results:**
- Text contrast >= 4.5:1
- Large text >= 3:1

### TC-A11Y-004: Alt Text
**Check:**
- All images have alt text
- Decorative images have empty alt

---

## Test Environment Setup

### Prerequisites
1. Node.js 18+
2. Environment variables configured
3. Supabase database with test data
4. Stripe test mode enabled

### Test Data
- Test user: test@example.com
- Test admin: Use ADMIN_USERNAME/PASSWORD from env
- Test card: 4242 4242 4242 4242

### Stripe Test Cards
| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0000 0000 0002 | Declined (generic) |

---

## Test Execution Checklist

Before each release:

- [ ] All high priority tests pass
- [ ] No console errors in browser
- [ ] Lighthouse score meets targets
- [ ] Mobile responsive works
- [ ] Payment flow tested end-to-end
- [ ] Admin functions work
- [ ] Email notifications sent
- [ ] No security vulnerabilities

---

## Bug Report Template

```markdown
## Bug Description
[Clear description of the issue]

## Steps to Reproduce
1.
2.
3.

## Expected Result
[What should happen]

## Actual Result
[What actually happens]

## Environment
- Browser:
- Device:
- User type: (logged in/guest/admin)

## Screenshots
[If applicable]
```
