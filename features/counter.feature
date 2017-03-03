Uses: StepRegistry
Uses: Selenium

Feature: I can use the counter

  #! StepRegistry start
  Feature-Start:
    Given I open Chrome

  Background:
    Given I navigate to http://localhost:9000
    And StepRegistry client SimpleStepPublisher is connected

  Scenario: I can read the counter
    Then the counter value is 0

  Scenario: I can increment the counter
    Given the counter value is 0
    When I click on the increment button
    Then the counter value is 1

  Scenario: I can decrement the counter
    Given the counter value is 0
    When I click on the decrement button
    Then the counter value is -1
