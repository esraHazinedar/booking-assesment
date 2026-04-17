Skip Booking Automation Framework
🌐 Live Demo

The application is deployed and accessible here:

👉 https://chic-gelato-36f66f.netlify.app/

 Project Structure

- page-objects/ → Page Object Models for UI interactions
- tests/automation/ → Playwright test cases
- ui/ → UI components and resources
- evidence/ → test execution evidence (screenshots, outputs)
- manual-tests.md → manual test cases
- bug-reports.md → reported issues
  
 Overview

This project is a Playwright-based end-to-end (E2E) automation framework designed to test a skip booking application.

It uses a Page Object Model (POM) architecture and a deterministic mocking strategy to simulate backend behavior and ensure stable, repeatable test execution.

The framework supports multiple booking flows including conditional business logic for waste types and pricing rules.

 Automation Coverage

The test suite covers full user journeys:

General waste booking flow
Heavy waste booking flow
Plasterboard booking flow (conditional logic)
Validated Areas

Each test validates:

UI state transitions
Business rules and conditions
Skip pricing logic
Disabled/enabled UI behavior
Review summary correctness
Booking confirmation flow


Architecture
Page Object Model (POM)

All UI interactions are encapsulated in:

page-objects/BookingPage.ts
Includes reusable methods for:
Postcode search
Address selection
Waste type selection
Skip selection
Plasterboard logic handling
Review validation
Booking confirmation
 API Contract Implementation Layer

A lightweight API simulation layer (api.js) was created to match the required API contract specification provided in the task.

This ensures the frontend behaves exactly according to expected backend design, including:

HTTP methods (GET / POST)
Endpoint structure
Request payload formats
Response JSON schema

This layer guarantees consistency between:

UI behavior
Test automation
Expected backend contract

It acts as a contract-compliant API simulation layer, enabling development and testing without a real backend service.

 Mocking & Test Data Strategy

This project uses a fully deterministic testing approach with a two-layer strategy.

1.  Frontend Business Logic Simulation

The UI simulates backend-like behavior for controlled test scenarios.

📍 Postcode Behavior
Postcode	Behavior
SW1A 1AA	Returns 12 addresses
EC1A 1BB	Returns empty state
M1 1AE	Delayed response (~1.5s latency simulation)
Latency Simulation
M1 1AE simulates real network delay (~1500ms)
Used to validate loading states and asynchronous UI behavior
 Skip Pricing Engine

Base dataset includes 8 skip sizes:

4-yard → 20-yard
Heavy Waste Rule:
Disables 12-yard
Disables 14-yard
Plasterboard Pricing Rules
Small → no price change
Medium → +£10 per skip
Large → +£20 per skip
2.Playwright Network Mock Layer

All backend API calls are intercepted using Playwright routing:

**/api/postcode/lookup
**/api/skips*
**/api/booking/confirm
✔ Benefits of This Approach
Fully deterministic test execution
No external backend dependency
Full control over edge cases
Ability to simulate latency and failures
Stable CI/CD execution


Testing Strategy

The automation suite covers:

End-to-end booking flows
Negative validation scenarios
Empty state handling
Retry and latency simulation
UI state consistency checks
Pricing verification


Summary

This framework is built using:

Playwright E2E automation
Page Object Model (POM)
Contract-aligned API simulation layer
Deterministic mocking strategy
Realistic UI behavior simulation

It ensures stable, repeatable, and production-like testing without backend dependency.


UI & QA Evidence

This project includes full QA evidence to validate functional and non-functional requirements.

Screenshots

The following UI states are documented:

Desktop view (general flow)
Mobile responsive view
Error states (empty postcode, retry scenarios)
Disabled skip states (heavy waste rules)
Price breakdown in review step
🎥 Flow Video

A 60–120 second end-to-end recording demonstrates:

Full booking journey
State transitions
Booking confirmation flow
📊 Lighthouse Report

A Lighthouse audit was performed on the deployed application.

Results:

Performance: 96
Accessibility: 73
Best Practices: 100
SEO: 90

The report is included under:

/evidence/lighthouse/lighthouse-report.pdf



 Playwright Execution Report

The Playwright HTML test execution report has been generated after running the automated test suite.

It provides:

Test execution results (pass/fail status)
Step-by-step test traces
Assertions and debugging details

The report is included in the project under:

/evidence/playwright-report/index.html
