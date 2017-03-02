Uses: StepServer
Uses: Selenium

Feature: Basic steps

  #! StepServer start
  Feature-Start:
    Given I open Chrome

  Background:
    Given I navigate to http://localhost:9000
    And StepServer client SimpleStepPublisher is connected

  Scenario: I can call steps with and without a result
    Check I can call a step with a result
    And I can call a step without a result

  Scenario: I can call steps which fail
    Check I can call a step with a result
    And I can call a step which fails

  Scenario: I can call steps which are async
    Check I can call a step which succeeds asychronously
    And I can call a step which times out
