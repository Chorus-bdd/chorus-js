Uses: Web Sockets
Uses: Selenium
Uses: Chorus Context

Feature: I can use the counter

  Feature-Start:
    Given I start a web socket server
    And I open the RemoteWebDriver browser
    And I navigate to ${exampleAppURL}
    And I wait for the web socket client SimpleStepPublisher

  Background:
    Given I reset the counter

  Scenario: I can read the counter
    Then the counter value is 0

  Scenario: I can increment the counter
    And the counter value is 0
    When I click on the increment button
    Then the counter value is 1

  Scenario: I can decrement the counter
    And the counter value is 0
    When I click on the decrement button
    Then the counter value is -1
