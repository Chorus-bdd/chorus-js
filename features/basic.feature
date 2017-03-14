Uses: StepRegistry
Uses: Selenium

Feature: Basic steps

  #! StepRegistry start
  Feature-Start:
    Given I open Chrome

  Background:
    Given I navigate to http://localhost:9999
    And StepRegistry client SimpleStepPublisher is connected

  Scenario: I can call steps with and without a result
    Check I can call a step with a result
    And I can call a step without a result

  Scenario: I can call steps which fail
    Check I can call a step with a result
    And I can call a step which fails

  Scenario: I can call steps which are async
    Check I can call a step which succeeds asynchronously
    And I can call a step which times out
