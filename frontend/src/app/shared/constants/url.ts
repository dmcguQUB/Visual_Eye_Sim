//will change this to url when we have a real url
const BASE_URL = 'http://localhost:5001';

//url for all case studies
export const CASE_STUDIES_URL = BASE_URL + '/api/case_studies';
//get individual URL
export const CASE_STUDY_BY_ID_URL = CASE_STUDIES_URL + '/';

//need to export constants for both user login and register from API in backend
export const USER_URL = BASE_URL + '/api/users';
export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';
export const USER_REGISTRATION_OVER_TIME = BASE_URL + '/api/users/user-registrations';


//url for all questions
export const QUESTIONS_URL= BASE_URL + '/api/questions';
//url for all questions bu case study id
export const QUESTION_BY_ID_URL= QUESTIONS_URL + '/case_study/';


//url for posting user scores to the database 
export const USER_SCORES_URL = BASE_URL + '/api/userscores/';

//url for the test service in the backend
export const TEST_URL = BASE_URL + '/api/test/';
export const TEST_FOR_USER_URL = BASE_URL + '/api/test/user/';
export const TEST_FOR_CASE_STUDY = BASE_URL + '/api/test/test-scores/case-study/';
export const TEST_FOR_ALL_TESTS_AND_CASE_STUDIES = BASE_URL + '/api/test/test-scores/global-scores';