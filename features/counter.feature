Uses: Web Sockets
Uses: Selenium

Feature: I can use the counter

  Feature-Start:
    Given I start a web socket server
    And I open Chrome

  Background:
    Given I navigate to http://localhost:9999
    And I wait for the web socket client SimpleStepPublisher

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
