| ID    | Scenario                        | Steps (Gherkin)                                         | Expected Result                     | Type        |
| ----- | ------------------------------- | ------------------------------------------------------- | ----------------------------------- | ----------- |
| TC-01 | Open application                | Given user opens `http://localhost:52330/ui/index.html` | Booking system page is displayed    | Positive    |
| TC-02 | Complete booking (General)      | Given user completes full booking with General waste    | Booking is confirmed                | Positive    |
| TC-03 | Complete booking (Heavy)        | Given Heavy waste and valid skip selected               | Booking succeeds with rules applied | Positive    |
| TC-04 | Complete booking (Plasterboard) | Given Plasterboard + Medium option selected             | Price updates correctly             | Positive    |
| TC-05 | Empty postcode                  | When user clicks search without postcode                | Validation message shown            | Negative    |
| TC-06 | Invalid postcode                | When user enters invalid postcode format                | No addresses returned               | Negative    |
| TC-07 | No address found                | Given postcode EC1A 1BB                                 | “No addresses found” displayed      | Edge        |
| TC-08 | Postcode API failure            | Given postcode API fails                                | Error message shown                 | API Failure |
| TC-09 | Retry postcode search           | When user retries after failure                         | Addresses loaded successfully       | State       |
| TC-10 | Slow API response               | Given slow API response                                 | Data loads after delay              | Edge        |
| TC-11 | Select address                  | When user selects address card                          | Address is marked selected          | Positive    |
| TC-12 | Change address selection        | When user selects different address                     | Previous selection removed          | State       |
| TC-13 | Select General waste            | When user selects General waste                         | Waste type set to General           | Positive    |
| TC-14 | Select Heavy waste              | When user selects Heavy waste                           | Heavy rules applied                 | Positive    |
| TC-15 | Select Plasterboard             | When user selects Plasterboard                          | Plaster options shown               | Positive    |
| TC-16 | Select plaster option           | When user selects Medium option                         | Option saved                        | Positive    |
| TC-17 | Change plaster option           | When user changes plaster option                        | Price updates                       | State       |
| TC-18 | Select skip                     | When user selects 4-yard skip                           | Skip selected                       | Positive    |
| TC-19 | Change skip selection           | When user selects another skip                          | Selection updated                   | State       |
| TC-20 | Heavy skip restriction          | Given Heavy waste selected                              | 12 and 14-yard skips disabled       | Business    |
| TC-21 | Click disabled skip             | When user clicks disabled skip                          | No selection happens                | Negative    |
| TC-22 | Validate skip pricing           | When skip list shown                                    | Prices are correct                  | Positive    |
| TC-23 | Plaster Small pricing           | When Small plaster selected                             | Base price shown                    | Positive    |
| TC-24 | Plaster Medium pricing          | When Medium plaster selected                            | Price increases by 10               | Positive    |
| TC-25 | Plaster Large pricing           | When Large plaster selected                             | Price increases by 20               | Positive    |
| TC-26 | Review screen update            | When all selections done                                | Review shows correct data           | Positive    |
| TC-27 | Missing waste selection         | When user clicks confirm without waste                  | Error alert shown                   | Negative    |
| TC-28 | Missing skip selection          | When user clicks confirm without skip                   | Error alert shown                   | Negative    |
| TC-29 | Missing address selection       | When user clicks confirm without address                | Error alert shown                   | Negative    |
| TC-30 | Successful booking              | Given valid full flow                                   | Booking confirmation shown          | Positive    |
| TC-31 | Double submit booking           | When user clicks confirm twice                          | Only one booking created            | Edge        |
| TC-32 | Confirm after success           | When user clicks confirm again                          | No duplicate booking                | Negative    |
| TC-33 | Page refresh reset              | When user refreshes mid flow                            | State reset                         | Edge        |
| TC-34 | Stepper navigation              | When user completes steps                               | Step indicator updates              | UI          |
| TC-35 | UI responsiveness               | When screen size changes                                | Layout remains usable               | UI          |
| TC-36 | Select skip before waste        | When user selects skip first                            | Selection blocked                   | Negative    |
| TC-37 | Rapid confirm clicks            | When user clicks confirm repeatedly                     | Only one request processed          | Negative    |
| TC-38 | Invalid plaster state           | When plaster selected without waste                     | No change applied                   | Negative    |
| TC-39 | Very long postcode input        | When user enters long string                            | Input handled safely                | Edge        |
| TC-40 | Rapid waste switching           | When user switches waste types fast                     | UI remains stable                   | Edge        |
| TC-41 | Address API failure             | Given address API fails                                 | Error message shown, no selection   | API Failure |
| TC-42 | Pricing API failure             | Given pricing API fails when skip selected              | Price not displayed, error shown    | API Failure |
| TC-43 | Booking API failure             | Given booking API fails on confirm                      | Error shown, booking not completed  | API Failure |
| TC-44 | Retry booking after failure     | When user retries booking after API failure             | Booking succeeds                    | State       |
