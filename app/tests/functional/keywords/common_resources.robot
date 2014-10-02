*** Settings ***
Documentation     A resource file with reusable keywords and variables.
...
...               The system specific keywords created here form our own
...               domain specific language. They utilize keywords provided
...               by the imported Selenium2Library.
Library           Selenium2Library
Library           Collections    # Library    libs/utils.py
Library           SauceLabs

*** Variables ***
${REMOTE_URL}
${DESIRED_CAPABILITIES}
${TEST_NAME}
${TEST_TAGS}
${BROWSER}  phantomjs
${URL}  http://localhost:3000/\#!
${PHANTOMJS_REMOTE_URL}  ${URL}
${DELAY}  1

*** Keywords ***
Open Test Browser
    [Documentation]    Open Browser ${URL} ${BROWSER}
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}

Close Test Browser
    Run keyword if  '${REMOTE_URL}' != ''
    ...  Report Sauce status
    ...  ${SUITE_NAME} | ${TEST_NAME}
    ...  ${SUITE_STATUS}  ${TEST_TAGS}  ${REMOTE_URL}
    Go To  ${URL}/api/robot/coverage
    Close all browsers

Home Page Should Be Open
    Page Should Contain Element   //div[@class='jumbotron text-center']
